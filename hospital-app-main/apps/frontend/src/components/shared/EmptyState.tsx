import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="border rounded-lg p-10 text-center flex flex-col items-center gap-3">
      <h3 className="text-lg font-semibold">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      )}

      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
