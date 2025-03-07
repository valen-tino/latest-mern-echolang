import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { FeedbackFormData } from '@/features/feedback/types';

export function FeedbackForm({
  productName,
  onSubmit,
}: {
  productName: string;
  onSubmit: (data: FeedbackFormData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 5,
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rating">Rating for {productName}</Label>
        <Input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label htmlFor="comment">Comments</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={4}
        />
      </div>
      <Button type="submit">Submit Feedback</Button>
    </form>
  );
}
