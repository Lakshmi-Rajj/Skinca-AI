import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  UserProfile, RoutineProtocol, CatalogProduct, IngredientInfo,
  ScanResult, WeeklyAdherence, TrackerEntry, CompatibilityReport, ChatMessage,
  JournalEntry,
} from '../types/mobile.types';
import type { VisionAnalysisResult } from '../engines/geminiEngine';
import { CATALOG_DATA } from '../engines/catalog.data';
import { geminiRespond } from '../engines/geminiEngine';
import { buildRoutine, scoreProduct } from '../engines/routineEngine';
import { lookupIngredient as inciLookup } from '../engines/inciEngine';
import { loadJson, saveJson, incrementUsage } from '../utils/storage';
import { canUseFeature, type PremiumFeature } from '../utils/premium';

// ─── WEEKLY ADHERENCE ──────────────────────────────────────────
function computeStreak(tracker: TrackerEntry[]): number {
  const sorted = [...tracker].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const entry of sorted) {
    if (entry.amCompleted && entry.pmCompleted) streak++;
    else break;
  }
  return streak;
}

function computeWeeklyAdherence(tracker: TrackerEntry[]): WeeklyAdherence {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const entry = tracker.find(t => t.date === iso);
    return {
      label,
      date: iso,
      amDone: entry?.amCompleted ?? false,
      pmDone: entry?.pmCompleted ?? false,
    };
  });
  const completed = days.filter(d => d.amDone && d.pmDone).length;
  const partial = days.filter(d => d.amDone || d.pmDone).length;
  const weekScore = Math.round((partial / 7) * 100);
  return { days, weekScore, currentStreak: computeStreak(tracker) };
}

export function rankCatalogForProfile(profile: UserProfile): CatalogProduct[] {
  return CATALOG_DATA
    .map(p => ({ ...p, matchScore: scoreProduct(p, profile) }))
    .filter(p => p.matchScore >= 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

const DEFAULT_PROFILE: UserProfile = {
  gender: 'FEMALE',
  id: 'demo', userId: 'demo', skinType: 'COMBINATION', primaryConcern: 'acne',
  sensitivity: 'MODERATE', ageRange: '25-34', climate: 'TEMPERATE', budget: 'MASS',
  currency: 'INR', budgetMinInINR: 300, budgetMaxInINR: 3000, analysisMode: 'FULL_AI_SCAN',
  hasConsentedToDataCollection: false,
  existingProducts: '', allergies: '', ingredientPreferences: '', isPregnant: false,
  subscriptionTier: 'FREE', onboardingDone: false, isLoggedIn: false,
};





const PROFILE_KEY   = 'skinca_profile';
const ROUTINE_KEY   = 'skinca_routine';
const TRACKER_KEY   = 'skinca_tracker';
const SAVED_KEY     = 'skinca_saved_ids';
const JOURNAL_KEY   = 'skinca_journal';
const SCAN_KEY      = 'skinca_last_scan';

export function useMobileState() {
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadJson<UserProfile>(PROFILE_KEY, DEFAULT_PROFILE)
  );

  const [routine, setRoutine] = useState<RoutineProtocol | null>(() =>
    loadJson<RoutineProtocol | null>(ROUTINE_KEY, null)
  );

  const [tracker, setTracker] = useState<TrackerEntry[]>(() =>
    loadJson<TrackerEntry[]>(TRACKER_KEY, [])
  );

  const [savedIds, setSavedIds] = useState<string[]>(() =>
    loadJson<string[]>(SAVED_KEY, [])
  );


  const [journal, setJournal] = useState<JournalEntry[]>(() =>
    loadJson<JournalEntry[]>(JOURNAL_KEY, [])
  );

  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [lastScanResult, setLastScanResultState] = useState<VisionAnalysisResult | null>(() =>
    loadJson<VisionAnalysisResult | null>(SCAN_KEY, null)
  );
  const [premiumGate, setPremiumGate] = useState<{ feature: PremiumFeature; message: string } | null>(null);

  const setLastScanResult = useCallback((result: VisionAnalysisResult) => {
    setLastScanResultState(result);
    saveJson(SCAN_KEY, result);
  }, []);

  // Generate routine automatically on initial load if none exists
  useEffect(() => {
    if (!routine) {
      const r = buildRoutine(profile);
      setRoutine(r);
      saveJson(ROUTINE_KEY, r);
    }
  }, [profile, routine]);

  const completeOnboarding = useCallback((data: Partial<UserProfile>) => {
    const updated: UserProfile = { ...profile, ...data, onboardingDone: true };
    setProfile(updated);
    saveJson(PROFILE_KEY, updated);
    const r = buildRoutine(updated);
    setRoutine(r);
    saveJson(ROUTINE_KEY, r);
  }, [profile]);

  const resetOnboarding = useCallback(() => {
    const updated: UserProfile = { ...profile, onboardingDone: false };
    setProfile(updated);
    saveJson(PROFILE_KEY, updated);
  }, [profile]);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    saveJson(PROFILE_KEY, updated);
  }, [profile]);

  const generateRoutine = useCallback((pOverride?: UserProfile) => {
    const target = pOverride ?? profile;
    const r = buildRoutine(target, lastScanResult);
    setRoutine(r);
    saveJson(ROUTINE_KEY, r);
  }, [profile, lastScanResult]);


  const toggleStep = useCallback((stepId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setTracker(prev => {
      const existing = prev.find(t => t.date === today);
      const isAM = (routine?.am ?? []).some(s => (s as any).id === stepId || String(s.order) === stepId);
      const isPM = (routine?.pm ?? []).some(s => (s as any).id === stepId || String(s.order) === stepId);

      let updated: TrackerEntry[];
      if (!existing) {
        updated = [...prev, {
          date: today,
          amCompleted: !!isAM,
          pmCompleted: !!isPM,
          notes: '',
        }];
      } else {
        updated = prev.map(t => t.date === today ? {
          ...t,
          amCompleted: isAM ? !t.amCompleted : t.amCompleted,
          pmCompleted: isPM ? !t.pmCompleted : t.pmCompleted,
        } : t);
      }
      saveJson(TRACKER_KEY, updated);
      return updated;
    });
  }, [routine]);

  const toggleSavedProduct = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveJson(SAVED_KEY, next);
      return next;
    });
  }, []);

  const isProductSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: 'j_' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
    };
    setJournal(prev => {
      const next = [newEntry, ...prev];
      saveJson(JOURNAL_KEY, next);
      return next;
    });
  }, []);

  const runScan = useCallback((inciText: string, productName = 'Scanned Formula'): ScanResult => {
    const ok = canUseFeature(profile.subscriptionTier, 'CAMERA_SCAN');
    if (!ok) {
      setPremiumGate({ feature: 'CAMERA_SCAN', message: 'You have reached your daily limit of 5 free scans.' });
    }
    incrementUsage('CAMERA_SCAN');

    const ingredients = inciText.split(',').map(s => s.trim()).filter(Boolean);
    const safetyBreakdown = ingredients.map(ing => {
      const lower = ing.toLowerCase();
      const isFragrance = lower.includes('parfum') || lower.includes('fragrance') || lower.includes('essential oil');
      const isHarsh = lower.includes('alcohol denat') || lower.includes('sls') || lower.includes('sulfate');
      const status: 'SAFE' | 'CAUTION' | 'AVOID' = isFragrance || isHarsh ? 'AVOID' : lower.includes('acid') ? 'CAUTION' : 'SAFE';
      return {
        ingredient: ing,
        status,
        reason: isFragrance ? 'Known sensitizer for reactive skin' : isHarsh ? 'Harsh surfactant or drying agent' : status === 'CAUTION' ? 'Active acid — check concentration' : 'Clinical safety evaluation',
      };
    });

    const safeCount = safetyBreakdown.filter(b => b.status === 'SAFE').length;
    const cautionCount = safetyBreakdown.filter(b => b.status === 'CAUTION').length;
    const calculatedScore = ingredients.length > 0
      ? Math.round(((safeCount * 1.0 + cautionCount * 0.6) / ingredients.length) * 100)
      : 100;

    const result: ScanResult = {
      productName,
      ingredients,
      safetyScore: Math.max(20, Math.min(100, calculatedScore)),
      safetyBreakdown,
      analysisText: `Analyzed ${ingredients.length} active compounds. ${safeCount} safe ingredients, ${cautionCount} cautions. High compatibility with ${profile.skinType} skin profile.`,
    };

    setScanResult(result);
    return result;
  }, [profile]);

  const sendChatMessage = useCallback(async (userText: string): Promise<string> => {
    const ok = canUseFeature(profile.subscriptionTier, 'AI_CHAT');
    if (!ok) {
      setPremiumGate({ feature: 'AI_CHAT', message: 'Upgrade to PRO for unlimited AI skincare mentorship.' });
    }
    incrementUsage('AI_CHAT');
    return geminiRespond(userText, profile, lastScanResult ?? undefined);
  }, [profile]);

  const upgradeToPremium = useCallback(() => {
    const updated = { ...profile, subscriptionTier: 'PREMIUM' as const };
    setProfile(updated);
    saveJson(PROFILE_KEY, updated);
    setPremiumGate(null);
  }, [profile]);

  const dismissPremiumGate = useCallback(() => setPremiumGate(null), []);

  const catalog = useMemo(() => rankCatalogForProfile(profile), [profile]);
  const weeklyAdherence = useMemo(() => computeWeeklyAdherence(tracker), [tracker]);

  return {
    profile,
    routine,
    tracker,
    savedIds,
    journal,
    scanResult,
    lastScanResult,
    setLastScanResult,
    premiumGate,
    catalog,
    weeklyAdherence,
    completeOnboarding,
    resetOnboarding,
    updateProfile,
    generateRoutine,
    toggleStep,
    toggleSavedProduct,
    isProductSaved,
    addJournalEntry,
    runScan,
    setScanResult,
    sendChatMessage,
    upgradeToPremium,
    dismissPremiumGate,
  };
}
