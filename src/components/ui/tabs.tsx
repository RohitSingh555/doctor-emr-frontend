import * as React from "react";

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
  defaultIndex?: number;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0, className }) => {
  const [active, setActive] = React.useState(defaultIndex);
  return (
    <div className={className}>
      <div className="flex border-b border-muted mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`px-4 py-2 font-medium transition-colors duration-150 focus:outline-none ${
              i === active
                ? "border-b-2 border-primary text-primary bg-background"
                : "text-muted-foreground hover:text-primary"
            }`}
            onClick={() => setActive(i)}
            aria-selected={i === active}
            role="tab"
            tabIndex={i === active ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-2">
        {tabs[active].content}
      </div>
    </div>
  );
}; 