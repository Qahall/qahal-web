import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface UITabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
}

export function UITabs({
  tabs,
  defaultValue,
  value,
  className,
  onChange,
  fullWidth = true,
}: UITabsProps) {
  const firstTab = defaultValue ?? tabs[0]?.value;
  const colClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    }[tabs.length] ?? "grid-cols-3";

  return (
    <Tabs
      defaultValue={firstTab}
      value={value}
      onValueChange={onChange}
      className={cn("w-full", className)}
    >
      <TabsList className={cn(fullWidth ? `w-full grid ${colClass}` : "w-fit")}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
          >
            {tab.icon ? <span className="mr-1">{tab.icon}</span> : null}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
