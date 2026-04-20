import { cn } from "@/lib/utils";

type AlertPillVariant = "urgent" | "attention" | "info" | "success";

const variantStyles: Record<AlertPillVariant, React.CSSProperties> = {
  urgent: {
    background: "color-mix(in srgb, var(--destructive) 12%, transparent)",
    color: "var(--destructive)",
  },
  attention: {
    background: "var(--color-warning-muted)",
    color: "var(--color-warning)",
  },
  info: {
    background: "var(--color-info-muted)",
    color: "var(--color-info)",
  },
  success: {
    background: "color-mix(in srgb, var(--color-success) 12%, transparent)",
    color: "var(--color-success)",
  },
};

interface AlertPillProps {
  variant: AlertPillVariant;
  className?: string;
  children: React.ReactNode;
}

export function AlertPill({ variant, className, children }: AlertPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold",
        className
      )}
      style={{ padding: "3px 10px", borderRadius: 4, ...variantStyles[variant] }}
    >
      {children}
    </span>
  );
}
