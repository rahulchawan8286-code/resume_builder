import React, { forwardRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './Input';

export const SearchBar = forwardRef(({ className, placeholder = "Search...", ...props }, ref) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        className="pl-9"
        {...props}
      />
    </div>
  );
});
SearchBar.displayName = "SearchBar";