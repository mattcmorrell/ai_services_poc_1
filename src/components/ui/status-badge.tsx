import { cn } from "@/lib/utils";

export type StatusBadgeVariant = "running" | "done" | "paused" | "pending" | "stopped" | "declined";

const variantStyles: Record<StatusBadgeVariant, React.CSSProperties> = {
  running:  { background: "var(--color-info-muted)",    color: "var(--color-info)" },
  done:     { background: "var(--color-success-muted)", color: "var(--color-success)" },
  paused:   { background: "var(--color-warning-muted)", color: "var(--color-warning)" },
  pending:  { background: "var(--muted)",               color: "var(--muted-foreground)" },
  stopped:  { background: "color-mix(in srgb, var(--color-danger) 8%, transparent)",  color: "color-mix(in srgb, var(--color-danger) 50%, var(--muted-foreground))" },
  declined: { background: "color-mix(in srgb, var(--color-danger) 8%, transparent)",  color: "color-mix(in srgb, var(--color-danger) 50%, var(--muted-foreground))" },
};

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function StatusBadge({ variant, dot = true, className, children }: StatusBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 font-mono text-xs font-semibold", className)}
      style={{ padding: "3px 10px", borderRadius: 20, ...variantStyles[variant] }}
    >
      {dot && <span className="h-[6px] w-[6px] rounded-full flex-shrink-0" style={{ background: "currentColor" }} />}
      {children}
    </span>
  );
}
