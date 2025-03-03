import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  content: string;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    const updateTooltipPosition = () => {
      const rect = icon.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--tooltip-x",
        `${rect.left + rect.width / 2}px`
      );
      document.documentElement.style.setProperty(
        "--tooltip-y",
        `${rect.top}px`
      );
    };

    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);
    window.addEventListener("scroll", updateTooltipPosition, true);

    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
      window.removeEventListener("scroll", updateTooltipPosition, true);
    };
  }, []);

  useEffect(() => {
    // Update position when hover state changes
    if (isHovered) {
      const icon = iconRef.current;
      if (icon) {
        const rect = icon.getBoundingClientRect();
        document.documentElement.style.setProperty(
          "--tooltip-x",
          `${rect.left + rect.width / 2}px`
        );
        document.documentElement.style.setProperty(
          "--tooltip-y",
          `${rect.top}px`
        );
      }
    }
  }, [isHovered]);

  return (
    <div
      ref={iconRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <InformationCircleIcon className="w-5 h-5 text-indigo-400 hover:text-indigo-500 cursor-help transition-colors" />
      {createPortal(
        <div
          className={`fixed transition-opacity duration-200 pointer-events-none ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            top: "var(--tooltip-y)",
            left: "var(--tooltip-x)",
            transform: "translate(-50%, -100%) translateY(-8px)",
            zIndex: 9999,
          }}
        >
          <div className="w-64 p-3 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-xl shadow-xl">
            {content}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
