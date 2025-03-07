import * as React from 'react';

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-background">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
