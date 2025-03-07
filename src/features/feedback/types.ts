export interface ProductFeedback {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface FeedbackFormData {
  rating: number;
  content: string;
}

export interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}