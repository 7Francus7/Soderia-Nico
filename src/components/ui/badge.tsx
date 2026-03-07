import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
       "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
       {
              variants: {
                     variant: {
                            default: "border-transparent bg-primary text-primary-foreground shadow-sm",
                            secondary: "border-border bg-secondary text-secondary-foreground",
                            destructive: "border-transparent bg-danger text-white shadow-sm",
                            outline: "text-foreground",
                            success: "border-success/10 bg-success/5 text-success",
                            warning: "border-warning/10 bg-warning/5 text-warning",
                            info: "border-info/10 bg-info/5 text-info",
                            tonal: "border-primary/10 bg-primary/5 text-primary",
                     },
              },
              defaultVariants: {
                     variant: "default",
              },
       }
)

export interface BadgeProps
       extends React.HTMLAttributes<HTMLDivElement>,
       VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
       return (
              <div className={cn(badgeVariants({ variant }), className)} {...props} />
       )
}

export { Badge, badgeVariants }
