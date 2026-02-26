import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
       variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
       size?: 'sm' | 'md' | 'lg' | 'icon';
       isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
       ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

              const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white active:scale-95";

              const variants = {
                     primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20",
                     secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
                     destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20",
                     outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
                     ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-500",
              };

              const sizes = {
                     sm: "h-8 px-3 text-xs",
                     md: "h-10 px-4 py-2 text-sm",
                     lg: "h-12 px-8 text-base",
                     icon: "h-10 w-10 p-2",
              };

              return (
                     <button
                            ref={ref}
                            className={cn(baseStyles, variants[variant], sizes[size], className)}
                            disabled={disabled || isLoading}
                            {...props}
                     >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {children}
                     </button>
              );
       }
);
Button.displayName = "Button";

export { Button };
