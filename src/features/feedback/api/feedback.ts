import { ProductFeedback, FeedbackFormData } from '../types';
import { useAuthStore } from '@/features/auth';

export async function submitProductFeedback(
  productId: string,
  productName: string,
  data: FeedbackFormData
): Promise<ProductFeedback> {
  const user = useAuthStore.getState().user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const feedback: ProductFeedback = {
    id: crypto.randomUUID(),
    userId: user.id,
    userName: user.name,
    productId,
    productName,
    rating: data.rating,
    content: data.content,
    createdAt: new Date().toISOString()
  };

  // TODO: Replace with actual API call
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return feedback;
}