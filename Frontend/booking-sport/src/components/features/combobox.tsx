"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboBoxProps {
  title: string;
  fetchOptions: () => Promise<{ value: string; label: string }[]>;
  onSelect: (value: string) => void;
}

export default function ComboBox({ title, fetchOptions, onSelect }: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [options, setOptions] = React.useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const getOptions = async () => {
      setLoading(true);
      try {
        const data = await fetchOptions();
        setOptions(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
      } finally {
        setLoading(false);
      }
    };
    getOptions();
  }, [fetchOptions]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-start">
      <h2 className="text-lg pl-1 font-semibold mb-1 text-gray-900">{title}</h2>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between px-3 py-2 text-sm flex-shrink-0 min-w-[120px] max-w-full truncate"
          >
            {selected
              ? options.find((option) => option.value === selected)?.label
              : loading
              ? "Đang tải..."
              : `Chọn ${title}`}
            <ChevronsUpDown className="opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[140px] p-0">
          <Command>
            <CommandInput placeholder={`Tìm ${title}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>Không tìm thấy</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                    {option.label}
                    <Check
                      className={cn("ml-auto", selected === option.value ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
