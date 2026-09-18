import * as React from "react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SimpleCardProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

function SimpleCard({
  title,
  description,
  actions,
  footer,
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: SimpleCardProps) {
  const hasHeader = title || description || actions
  const hasFooter = Boolean(footer)

  return (
    <Card className={className} data-slot="simple-card">
      {hasHeader ? (
        <CardHeader
          className={cn(
            "gap-1 sm:grid sm:auto-cols-[1fr_auto] sm:grid-flow-col sm:items-start sm:gap-4",
            headerClassName
          )}
        >
          <div className="space-y-1">
            {title ? (
              <CardTitle className="text-base font-semibold leading-tight">
                {title}
              </CardTitle>
            ) : null}
            {description ? (
              <CardDescription className="text-sm text-muted-foreground">
                {description}
              </CardDescription>
            ) : null}
          </div>

          {actions ? (
            <CardAction className="flex items-center gap-2">
              {actions}
            </CardAction>
          ) : null}
        </CardHeader>
      ) : null}

      {children ? (
        <CardContent className={cn("text-sm", contentClassName)}>
          {children}
        </CardContent>
      ) : null}

      {hasFooter ? (
        <CardFooter
          className={cn("text-sm text-muted-foreground", footerClassName)}
        >
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  )
}

export { SimpleCard }

