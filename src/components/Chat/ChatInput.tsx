import React, { forwardRef } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  initialValue?: string;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ onSend, disabled, initialValue }, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const input = form.elements.namedItem('message') as HTMLInputElement;
      const message = input.value.trim();
      
      if (message) {
        onSend(message);
        form.reset();
      }
    };

    return (
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            name="message"
            ref={ref}
            disabled={disabled}
            defaultValue={initialValue}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={disabled}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </form>
    );
  }
);