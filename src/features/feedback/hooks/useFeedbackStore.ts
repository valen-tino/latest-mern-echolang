import { create } from 'zustand';
import type { Feedback } from '@/features/feedback/types';

type FeedbackStore = {
  feedbacks: Feedback[];
  addFeedback: (feedback: Feedback) => void;
};

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedbacks: [],
  addFeedback: (feedback) => set((state) => ({ feedbacks: [...state.feedbacks, feedback] })),
}));
