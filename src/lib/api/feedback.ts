export interface Feedback {
  id: string;
  userId: string;
  content: string;
  rating: number;
  createdAt: string;
  response?: string;
}

export async function submitFeedback(content: string, rating: number): Promise<void> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

export async function getFeedback(): Promise<Feedback[]> {
  // Simulate API call
  return [
    {
      id: '1',
      userId: '2',
      content: 'Great service!',
      rating: 5,
      createdAt: new Date().toISOString(),
    }
  ];
}