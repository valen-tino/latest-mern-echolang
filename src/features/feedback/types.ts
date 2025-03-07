import { create } from 'zustand';

type Feedback = {
  id: string;
  videoId: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type FeedbackStore = {
  feedbacks: Feedback[];
  addFeedback: (feedback: Feedback) => void;
};

export const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedbacks: [],
  addFeedback: (feedback) => set((state) => ({ feedbacks: [...state.feedbacks, feedback] })),
}));
