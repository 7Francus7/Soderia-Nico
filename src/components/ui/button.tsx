import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
       "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
       {
              variants: {
                     variant: {
                            default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90",
                            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                            outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
                            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                            ghost: "hover:bg-accent hover:text-accent-foreground",
                            link: "text-primary underline-offset-4 hover:underline",
                            premium: "bg-slate-900 dark:bg-white text-white dark:text-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.03]",
                     },
                     size: {
                            default: "h-12 px-6 py-3",
                            sm: "h-9 rounded-xl px-3",
                            lg: "h-14 rounded-3xl px-10 text-base",
                            icon: "h-10 w-10",
                     },
              },
              defaultVariants: {
                     variant: "default",
                     size: "default",
              },
       }
)

export interface ButtonProps
       extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {
       asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
       ({ className, variant, size, asChild = false, ...props }, ref) => {
              const Comp = asChild ? Slot : "button"
              return (
                     <Comp
                            className={cn(buttonVariants({ variant, size, className }))}
                            ref={ref}
                            {...props}
                     />
              )
       }
)
Button.displayName = "Button"

export { Button, buttonVariants }
