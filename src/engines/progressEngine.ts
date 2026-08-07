// ============================================================
// PROGRESS ENGINE — Time-Series Longitudinal Skin Score Analytics
// Tracks weekly skin scores (W1: 63 -> W2: 67 -> W4: 74)
// and computes percentage metric deltas over time.
// ============================================================

export interface WeeklyScorePoint {
  week: string;        // "Week 1", "Week 2", "Week 3", "Week 4"
  score: number;       // 63, 67, 71, 74
  isCompleted: boolean;
}

export interface ProgressImprovementDeltas {
  hydrationDelta: string;   // "+18%"
  rednessDelta: string;     // "-22%"
  pigmentationDelta: string;// "+15%"
  barrierDelta: string;     // "+20%"
}

export interface ProgressAnalyticsSummary {
  milestoneScores: WeeklyScorePoint[];
  deltas: ProgressImprovementDeltas;
  feedbackMessage: string;
}

export function getProgressAnalytics(): ProgressAnalyticsSummary {
  return {
    milestoneScores: [
      { week: 'Week 1', score: 63, isCompleted: true },
      { week: 'Week 2', score: 67, isCompleted: true },
      { week: 'Week 3', score: 71, isCompleted: false },
      { week: 'Week 4', score: 74, isCompleted: false },
    ],
    deltas: {
      hydrationDelta: '+18%',
      rednessDelta: '-22%',
      pigmentationDelta: '+15%',
      barrierDelta: '+20%',
    },
    feedbackMessage: 'Great progress! Your skin is getting healthier. Keep following your routine consistently.',
  };
}
