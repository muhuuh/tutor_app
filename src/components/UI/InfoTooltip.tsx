import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <div className="relative group">
      <InformationCircleIcon className="w-5 h-5 text-indigo-400 hover:text-indigo-500 cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        {content}
      </div>
    </div>
  );
}
