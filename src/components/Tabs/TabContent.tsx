import React from 'react';

interface TabContentProps {
  items?: string[];
  title?: string;
  children?: React.ReactNode;
}

export function TabContent({ items = [], title, children }: TabContentProps) {
  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
      {items && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="p-3 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No items available</p>
      )}
    </div>
  );
}