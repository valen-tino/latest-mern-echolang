import { feedback } from '@/lib/mock/data';
import type { ProductFeedback } from '../types';

export async function createFeedback(data: Omit<ProductFeedback, 'id' | 'createdAt'>): Promise<ProductFeedback> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newFeedback: ProductFeedback = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString()
  };

  return newFeedback;
}

export async function getFeedbackForProduct(productId: string): Promise<ProductFeedback[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return feedback.filter(f => f.productId === productId);
}