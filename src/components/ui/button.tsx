import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900',
          'disabled:pointer-events-none disabled:opacity-40',
          variant === 'default' && 'bg-primary text-black hover:bg-primary/90',
          variant === 'outline' &&
            'border border-dark-600 bg-dark-900/95 text-white shadow-sm hover:border-primary/50 hover:bg-dark-800',
          variant === 'ghost' && 'text-white hover:bg-dark-800',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'icon' && 'h-10 w-10 shrink-0',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
