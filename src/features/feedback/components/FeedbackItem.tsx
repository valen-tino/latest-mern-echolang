import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Feedback } from '../types';

interface FeedbackItemProps {
  feedback: Feedback;
  onRespond: (id: string, response: string) => Promise<void>;
}

export function FeedbackItem({ feedback, onRespond }: FeedbackItemProps) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onRespond(feedback.id, response);
      setResponse('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{feedback.userName}</h3>
              <Badge variant={feedback.status === 'pending' ? 'secondary' : 'default'}>
                {feedback.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium">Rating:</span>
            <span className="ml-2 text-sm">{feedback.rating}/5</span>
          </div>
        </div>

        <p className="mb-4">{feedback.content}</p>

        {feedback.response ? (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Admin Response:</h4>
            <p>{feedback.response}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder="Write a response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <Button 
              onClick={handleSubmit}
              disabled={!response.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}