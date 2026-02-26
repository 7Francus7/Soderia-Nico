import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ className, size = 24 }: { className?: string, size?: number }) => {
       return <Loader2 size={size} className={cn("animate-spin text-blue-600", className)} />;
};
