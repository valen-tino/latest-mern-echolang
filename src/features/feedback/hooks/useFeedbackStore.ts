import { create } from 'zustand';
import { ProductFeedback } from '../types';

interface FeedbackStore {
  feedbacks: ProductFeedback[];
  addFeedback: (feedback: ProductFeedback) => void;
}

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedbacks: [],
  addFeedback: (feedback) => 
    set((state) => ({
      feedbacks: [feedback, ...state.feedbacks]
    }))
}));