"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

type SortOption = {
    label: string;
    value: string;
};

const sortOptions: SortOption[] = [
    { label: "Most relevant", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
];

interface JobSortingProps {
    onSortChange: (sortValue: string) => void;
    selectedOption: string;
}

export default function JobSorting({
    onSortChange,
    selectedOption,
}: JobSortingProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Find the current selected option object
    const currentOption =
        sortOptions.find((option) => option.value === selectedOption) ||
        sortOptions[0];

    const handleOptionClick = (option: SortOption) => {
        setIsOpen(false);
        onSortChange(option.value);
    };

    return (
        <div className="relative  inline-block text-left ">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-between items-center w-50 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Sort: {currentOption.label}
                    <FiChevronDown
                        className="ml-2 -mr-1 h-5 w-5"
                        aria-hidden="true"
                    />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                className={`${
                                    selectedOption === option.value
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700"
                                } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                                role="menuitem"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
