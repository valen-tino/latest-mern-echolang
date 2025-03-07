import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={`px-4 py-2 rounded-md ${
          variant === 'default' 
            ? 'bg-primary text-primary-foreground' 
            : 'border border-input bg-background'
        } ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
