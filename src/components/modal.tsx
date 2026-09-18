// components/ui/modal.tsx
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  /* DialogClose, */
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "xxl";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;
  children?: ReactNode;

  loading?: boolean;
  showClose?: boolean;

  /** Footer actions */
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
    destructive?: boolean;
  };

  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };

  size?: ModalSize;
  className?: string;
}

const sizeMap: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-5xl",
  xxl: "sm:max-w-7xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,

  loading = false,
  showClose = true,

  primaryAction,
  secondaryAction,

  size = "md",
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showClose}
        className={cn(
          sizeMap[size],
          "p-6 max-h-[90vh] overflow-y-auto",
          className
        )}
        onInteractOutside={(e) => e.preventDefault()} //EVITA QUE SE CIERRE
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="py-2 overflow-y-auto">{children}</div>

        {(primaryAction || secondaryAction) && (
          <DialogFooter>
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled || loading}
              >
                {secondaryAction.label}
              </Button>
            )}

            {primaryAction && (
              <Button
                variant={primaryAction.destructive ? "destructive" : "default"}
                onClick={primaryAction.onClick}
                disabled={loading || primaryAction.loading}
              >
                {loading || primaryAction.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {primaryAction.label}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
