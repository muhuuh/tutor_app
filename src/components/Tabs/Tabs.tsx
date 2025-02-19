import React from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "full-width";
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
}: TabsProps) {
  return (
    <div
      className={`flex ${
        variant === "full-width"
          ? "w-full border-b border-gray-200"
          : "space-x-8"
      }`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            group flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
            ${variant === "full-width" ? "flex-1" : ""}
            ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
        >
          {tab.icon && (
            <span
              className={`
                transition-colors
                ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                }
              `}
            >
              {tab.icon}
            </span>
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
