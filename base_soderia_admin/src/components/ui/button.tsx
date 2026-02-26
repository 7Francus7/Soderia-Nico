import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
       variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'success';
       size?: 'sm' | 'md' | 'lg' | 'icon';
       isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
       ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

              const baseStyles = "inline-flex items-center justify-center rounded-[14px] font-bold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white active:scale-[0.97] select-none";

              const variants = {
                     primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 border-t border-white/10",
                     success: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 border-t border-white/10",
                     secondary: "bg-slate-100/80 text-slate-900 hover:bg-slate-200 border border-slate-200 backdrop-blur-sm",
                     destructive: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/25 border-t border-white/10",
                     outline: "border-2 border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold",
                     ghost: "hover:bg-slate-100/80 hover:text-slate-900 text-slate-500 font-semibold",
              };

              const sizes = {
                     sm: "h-9 px-4 text-xs",
                     md: "h-11 px-5 py-2.5 text-sm",
                     lg: "h-14 px-8 text-base",
                     icon: "h-11 w-11 p-2.5",
              };

              return (
                     <button
                            ref={ref}
                            className={cn(baseStyles, variants[variant], sizes[size], className)}
                            disabled={disabled || isLoading}
                            {...props}
                     >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin stroke-[3]" />}
                            <span className="flex items-center gap-2">
                                   {children}
                            </span>
                     </button>
              );
       }
);
Button.displayName = "Button";

export { Button };
