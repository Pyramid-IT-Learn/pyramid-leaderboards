// CustomDropdown.tsx
import React from 'react';

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, placeholder }) => {
  return (
    <div className="relative w-full sm:w-64">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-3 px-4 bg-dark-800 text-dark-300 border border-primary-600 rounded-lg shadow-lg shadow-primary-800 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-700 transition-all duration-300"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default CustomDropdown;