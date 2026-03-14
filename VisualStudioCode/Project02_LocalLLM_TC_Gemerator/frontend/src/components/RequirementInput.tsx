import React from 'react';

interface RequirementInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const RequirementInput: React.FC<RequirementInputProps> = ({
  value,
  onChange,
}) => {
  const charCount = value.length;
  const maxChars = 5000;
  const isNearLimit = charCount > maxChars * 0.9;

  return (
    <div>
      <label htmlFor="requirement" className="label label-required">
        Enter Your Test Requirement
      </label>
      <textarea
        id="requirement"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your test requirement here... (e.g., 'User should be able to login with email and password')"
        className="input-base"
        rows={8}
        maxLength={maxChars}
      />
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          {charCount} / {maxChars} characters
        </p>
        {isNearLimit && (
          <p className="text-xs text-warning-600">
            Approaching character limit
          </p>
        )}
      </div>
    </div>
  );
};
