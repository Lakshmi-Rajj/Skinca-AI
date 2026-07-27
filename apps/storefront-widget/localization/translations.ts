export const defaultTranslations: Record<string, Record<string, string>> = {
  en: {
    welcomeTitle: 'Find Your Perfect Routine',
    welcomeSub: 'Answer a few quick questions to receive a dermatologist-validated skincare routine.',
    startBtn: 'Start Quiz',
    skinTypeQuestion: 'What is your primary skin type?',
    concernsQuestion: 'What skin concerns would you like to address?',
    allergiesQuestion: 'Do you have any known ingredient allergies or exclusions?',
    submitBtn: 'Generate My Routine',
    morningRoutineTitle: 'Morning Routine',
    eveningRoutineTitle: 'Evening Routine',
    whySelectedTitle: 'Why This Routine Was Selected',
    resetBtn: 'Retake Quiz',
  },
};

export class LocalizationManager {
  private currentLang: string;

  constructor(lang: string = 'en') {
    this.currentLang = lang;
  }

  t(key: string): string {
    const dict = defaultTranslations[this.currentLang] || defaultTranslations['en'];
    return dict[key] || key;
  }
}
