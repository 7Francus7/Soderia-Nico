import { ReactNode } from "react";

export interface MetricCardProps {
       label: string;
       value: string;
       icon: ReactNode;
       color: "blue" | "purple" | "rose" | "amber";
       href?: string;
}

export interface QuickActionCardProps {
       title: string;
       subtitle: string;
       icon: ReactNode;
       href: string;
       color: "blue" | "sky" | "rose" | "emerald";
}
