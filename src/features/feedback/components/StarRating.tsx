import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarRatingProps } from '../types';

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={cn(
            "p-1 transition-colors",
            disabled ? "cursor-default" : "cursor-pointer hover:text-yellow-400",
            star <= value ? "text-yellow-400" : "text-gray-300"
          )}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );
}