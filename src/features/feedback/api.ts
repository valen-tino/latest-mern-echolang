import { Feedback } from './types';

// Simulated API calls
export async function getFeedbackList(): Promise<Feedback[]> {
  return [
    {
      id: '1',
      userId: '2',
      userName: 'John Doe',
      content: 'Great service! The translation quality is excellent.',
      rating: 5,
      createdAt: new Date().toISOString(),
      status: 'pending'
    },
    {
      id: '2',
      userId: '3',
      userName: 'Jane Smith',
      content: 'Could improve processing speed.',
      rating: 4,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }
  ];
}

export async function respondToFeedback(feedbackId: string, response: string): Promise<void> {
  // Simulate API call
  return new Promise((resolve) => setTimeout(resolve, 500));
}