import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface STTModelOption {
    name: string;
    value: string;
    features?: string;
}

interface STTModelDropdownProps {
    options: STTModelOption[];
    selectedOption: string;
    setOption: React.Dispatch<React.SetStateAction<string>>;
    loading?: boolean;
}

const STTModelDropdown: React.FC<STTModelDropdownProps> = ({options, selectedOption, setOption, loading}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedOptionData = options.find(option => option.value === selectedOption);

    const handleOptionSelect = (value: string) => {
        setOption(value);
        setIsOpen(false);
    };

    const handleToggleDropdown = () => {
        if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 320; // max-h-80 = 20rem = 320px

            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
            {/* Selected Option Display */}
            <button
                type="button"
                className='p-1.5 rounded-lg w-full text-sm bg-gray-100 border border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none flex justify-between items-center'
                onClick={handleToggleDropdown}
            >
                <span className="truncate">
                    {selectedOptionData?.name || 'Select a model'}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 ml-2 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                )}
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div 
                    className={`absolute z-[9999] w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto ${
                        dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}
                    style={{ 
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#6b7280 #f3f4f6'
                    }}
                >
                    <div className="py-1">
                        {options.length > 0 ? (
                            options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors duration-150 ${
                                        selectedOption === option.value ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                                    }`}
                                    onClick={() => handleOptionSelect(option.value)}
                                >
                                    <div className="flex flex-col gap-2">
                                        {/* Model Name */}
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {option.name}
                                        </span>
                                        
                                        {/* Features as Tags */}
                                        {option.features && (
                                            <div className="flex flex-wrap gap-1">
                                                                                        {option.features.split(',').map((feature, featureIdx) => (
                                            <span
                                                key={featureIdx}
                                                className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-full whitespace-nowrap"
                                            >
                                                {feature.trim()}
                                            </span>
                                        ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
                                No models available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default STTModelDropdown; 