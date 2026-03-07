import { ReactNode } from "react";

export interface MetricCardProps {
       label: string;
       value: string;
       icon: ReactNode;
       description?: string;
       variant?: "blue" | "purple" | "rose" | "amber" | "emerald";
       href?: string;
}

export interface QuickActionCardProps {
       title: string;
       subtitle?: string;
       icon: ReactNode;
       href: string;
       color?: "primary" | "secondary" | "rose" | "sky" | "amber" | "slate";
}
