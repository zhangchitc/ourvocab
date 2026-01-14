// Ebbinghaus forgetting curve intervals in milliseconds
export const INTERVALS = [
  0,                      // Stage 0: immediate
  5 * 60 * 1000,          // Stage 1: 5 minutes
  30 * 60 * 1000,         // Stage 2: 30 minutes
  12 * 60 * 60 * 1000,    // Stage 3: 12 hours
  24 * 60 * 60 * 1000,    // Stage 4: 1 day
  2 * 24 * 60 * 60 * 1000,  // Stage 5: 2 days
  4 * 24 * 60 * 60 * 1000,  // Stage 6: 4 days
  7 * 24 * 60 * 60 * 1000,  // Stage 7: 7 days
  15 * 24 * 60 * 60 * 1000, // Stage 8: 15 days
];

export type Feedback = 'green' | 'yellow' | 'red';

export function calculateNextReview(
  currentStage: number,
  feedback: Feedback
): { nextStage: number; nextReviewTime: Date } {
  const now = new Date();
  let nextStage = currentStage;
  let interval: number;

  switch (feedback) {
    case 'green': // Remember
      nextStage = Math.min(currentStage + 1, 8);
      interval = INTERVALS[nextStage];
      break;
    case 'yellow': // Fuzzy
      interval = Math.floor(INTERVALS[currentStage] * 0.5);
      break;
    case 'red': // Forget
      nextStage = 1;
      interval = INTERVALS[1]; // 5 minutes
      break;
  }

  return {
    nextStage,
    nextReviewTime: new Date(now.getTime() + interval),
  };
}
