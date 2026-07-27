export function buildRoutinePrompt(morningSteps: any[], eveningSteps: any[]): string {
  return `Explain the rationale behind the selected Morning Routine (${morningSteps.length} steps) and Evening Routine (${eveningSteps.length} steps) in clear, accessible steps without changing product order.`;
}
