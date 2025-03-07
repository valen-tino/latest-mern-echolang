import { MessageSquare } from 'lucide-react';
import { FeedbackItem } from './FeedbackItem';
import { Feedback } from '../types';

interface FeedbackListProps {
  feedbacks: Feedback[];
  onRespond: (id: string, response: string) => Promise<void>;
}

export function FeedbackList({ feedbacks, onRespond }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <MessageSquare className="mx-auto h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium">No feedback yet</h3>
        <p>Customer feedback will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedbacks.map((feedback) => (
        <FeedbackItem
          key={feedback.id}
          feedback={feedback}
          onRespond={onRespond}
        />
      ))}
    </div>
  );
}