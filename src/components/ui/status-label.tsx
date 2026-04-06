import { cn } from "@/lib/utils";

type StatusLabelVariant = "success" | "danger" | "muted";

const variantStyles: Record<StatusLabelVariant, React.CSSProperties> = {
  success: { color: "var(--color-success)", opacity: 0.7 },
  danger: { color: "var(--color-danger)", opacity: 0.7 },
  muted: { color: "var(--muted-foreground)", opacity: 0.8 },
};

interface StatusLabelProps {
  variant?: StatusLabelVariant;
  className?: string;
  children: React.ReactNode;
}

export function StatusLabel({ variant = "muted", className, children }: StatusLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[12px] font-semibold uppercase",
        className
      )}
      style={{ letterSpacing: "0.06em", ...variantStyles[variant] }}
    >
      {children}
    </div>
  );
}
