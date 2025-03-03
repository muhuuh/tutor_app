import { InfoTooltip } from "../UI/InfoTooltip";
import { useTranslation } from "react-i18next";

interface Suggestion {
  title: string;
  content: string;
  prompt?: string;
}

interface ChatSuggestionsProps {
  isLoadingSuggestions: boolean;
  suggestions: Suggestion[];
  messages: any[];
  handleSuggestionClick: (prompt: string) => void;
  DEFAULT_SUGGESTIONS: Suggestion[];
}

export function ChatSuggestions({
  isLoadingSuggestions,
  suggestions,
  messages,
  handleSuggestionClick,
  DEFAULT_SUGGESTIONS,
}: ChatSuggestionsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-100 shadow-lg">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-blue-900">
            {t("chatSuggestions.title")}
          </h3>
          <InfoTooltip content={t("chatSuggestions.tooltipInfo")} />
        </div>
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-2">
          {t("chatSuggestions.subtitle")}
        </p>
      </div>
      {isLoadingSuggestions ? (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div
          className="space-y-2 flex-1"
          style={{ maxHeight: messages.length > 0 ? "424px" : "auto" }}
        >
          <div className="grid grid-cols-1 gap-2 w-full relative">
            {(
              (messages.length > 0 &&
                typeof messages[messages.length - 1].content !== "string" &&
                (messages[messages.length - 1].content as any).suggestions) ||
              (messages.length === 0
                ? DEFAULT_SUGGESTIONS
                : suggestions || DEFAULT_SUGGESTIONS)
            ).map((suggestion: Suggestion, index: number) => (
              <div key={index} className="relative group w-full">
                <button
                  onClick={() =>
                    handleSuggestionClick(
                      suggestion.content || suggestion.prompt || ""
                    )
                  }
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 bg-gray-50/50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all hover:border-gray-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span>{suggestion.title}</span>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {suggestion.content || suggestion.prompt || ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
