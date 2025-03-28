"use client";

import * as React from "react";
import ComboBox from "@/components/features/combobox";
import { Button } from "@/components/ui/button"; // Import button từ shadcn/ui

interface FilterBoxProps {
    filters: {
        title: string;
        fetchOptions: () => Promise<{ value: string; label: string }[]>; 
    }[];
    onFilter: (filters: { [key: string]: string }) => void;
}

export default function FilterBox({ filters, onFilter }: FilterBoxProps) {
    const [selectedFilters, setSelectedFilters] = React.useState<{ [key: string]: string }>({});

    const handleSelect = (title: string, value: string) => {
        setSelectedFilters((prev) => ({ ...prev, [title]: value }));
    };

    const handleApplyFilters = () => {
        onFilter(selectedFilters);
    };

    return (
        <div className="w-full flex flex-col gap-4 ml-[150px] md:ml-[350px]">
            {/* Tiêu đề "Bộ lọc" + Underline */}
{/*             <div className="relative w-full text-center">
                <h2 className="text-lg font-semibold text-gray-800">Bộ lọc</h2>
                <div className="absolute left-1/2 top-full w-[80%] h-[2px] bg-gray-300 -translate-x-1/2 mt-2 sm:h-[3px] sm:w-[60%]"></div>
            </div> */}

            {/* Danh sách combobox */}
            <div className="w-full flex flex-wrap gap-4 items-start ">
                {filters.map((filter, index) => (
                    <div key={index} className="w-fit min-w-[160px]">
                        <ComboBox
                            title={filter.title}
                            fetchOptions={filter.fetchOptions}
                            onSelect={(value) => handleSelect(filter.title, value)}
                        />
                    </div>
                ))}
            </div>
                {/* Nút Lọc (căn giữa) */}
            <div className="w-full flex justify-start">
                <Button 
                    variant="default" 
                    onClick={handleApplyFilters} 
                    className="px-6 cursor-pointer bg-gradient-to-r from-gray-800 to-black text-white font-semibold py-3"
                >
                    Lọc
                </Button>
            </div>
            
        </div>
    );
}
