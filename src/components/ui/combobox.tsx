"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface ComboboxOption {
  value: string
  label: string
  searchLabel?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  name?: string
  className?: string
}

export function Combobox({
  options,
  value,
  defaultValue = "",
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  name,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState(defaultValue)
  const [searchQuery, setSearchQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedValue = value !== undefined ? value : localValue

  // Focus search input when opened
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchQuery("")
    }
  }

  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.value === selectedValue)
  }, [options, selectedValue])

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    const query = searchQuery.toLowerCase().trim()
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(query)
      const matchValue = opt.value.toLowerCase().includes(query)
      const matchSearch = opt.searchLabel ? opt.searchLabel.toLowerCase().includes(query) : false
      return matchLabel || matchValue || matchSearch
    })
  }, [options, searchQuery])

  const handleSelect = (val: string) => {
    if (value === undefined) {
      setLocalValue(val)
    }
    onChange?.(val)
    setOpen(false)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      {/* Hidden input for HTML form submissions */}
      {name && <input type="hidden" name={name} value={selectedValue} />}

      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls="combobox-options"
          className={cn(
            "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-lg border border-border/60 bg-secondary/60 px-3.5 py-2 text-sm text-foreground hover:bg-secondary/80 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer transition-colors",
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon className="h-4 w-4 opacity-50 shrink-0 ml-2" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] min-w-[12rem] overflow-hidden rounded-lg border border-border/40 bg-popover/95 backdrop-blur-md text-popover-foreground shadow-xl ring-1 ring-foreground/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {/* Search bar */}
          <div className="p-2 border-b border-border/40 flex items-center">
            <div className="relative w-full flex items-center">
              <SearchIcon className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-border/50 rounded-md py-1.5 pl-8 pr-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Options list container */}
          <div id="combobox-options" className="max-h-60 overflow-y-auto p-1 space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === selectedValue
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-3.5 pr-8 text-sm text-left outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors",
                      isSelected && "text-primary font-medium"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <span className="absolute right-2.5 flex h-3.5 w-3.5 items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-primary" />
                      </span>
                    )}
                  </button>
                )
              })
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
