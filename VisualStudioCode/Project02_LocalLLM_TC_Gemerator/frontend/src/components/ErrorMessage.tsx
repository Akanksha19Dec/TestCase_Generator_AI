import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <div className="flex items-start gap-3 flex-1">
        <span className="text-xl">⚠️</span>
        <p className="text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 text-danger-600 hover:text-danger-800 font-semibold"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};
