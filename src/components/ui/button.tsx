import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
       "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
       {
              variants: {
                     variant: {
                            default: "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90",
                            destructive: "bg-danger text-white shadow-sm hover:bg-danger/90",
                            outline: "border border-border bg-transparent hover:bg-secondary hover:text-foreground hover:border-border",
                            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70 shadow-none",
                            ghost: "hover:bg-secondary text-muted-foreground hover:text-foreground",
                            link: "text-primary underline-offset-4 hover:underline",
                            tonal: "bg-accent text-accent-foreground hover:bg-accent/80 shadow-none",
                     },
                     size: {
                            default: "h-10 px-5",
                            sm: "h-8 rounded-lg px-3 text-xs",
                            lg: "h-12 rounded-xl px-8 text-base",
                            xl: "h-14 rounded-2xl px-10 text-lg",
                            icon: "h-10 w-10",
                     },
                     shape: {
                            default: "rounded-md",
                            pill: "rounded-full",
                     },
              },
              defaultVariants: {
                     variant: "default",
                     size: "default",
                     shape: "default",
              },
       }
)

export interface ButtonProps
       extends React.ButtonHTMLAttributes<HTMLButtonElement>,
       VariantProps<typeof buttonVariants> {
       asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
       ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
              const Comp = asChild ? Slot : "button"
              return (
                     <Comp
                            className={cn(buttonVariants({ variant, size, shape, className }))}
                            ref={ref}
                            {...props}
                     />
              )
       }
)
Button.displayName = "Button"

export { Button, buttonVariants }
