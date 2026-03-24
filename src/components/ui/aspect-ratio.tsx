import type { ComponentProps } from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { cn } from '@/lib/utils';

/**
 * shadcn/ui-style wrapper around Radix Aspect Ratio.
 * @see https://ui.shadcn.com/docs/components/aspect-ratio
 */
function AspectRatio({
  className,
  ...props
}: ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root className={cn(className)} {...props} />;
}

export { AspectRatio };
