
'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useChartConfigStore } from '@/hooks/use-chart-config-store';
import { Button } from '../ui/button';
import { ListFilter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';

export function CategoryFilter() {
  const { allCategories, selectedCategories, setSelectedCategories, pieChartConfig } = useChartConfigStore();

  const handleSelectAll = (checked: boolean) => {
    setSelectedCategories(checked ? allCategories : []);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };
  
  const isAllSelected = allCategories.length > 0 && selectedCategories.length === allCategories.length;
  const isIndeterminate = selectedCategories.length > 0 && selectedCategories.length < allCategories.length;

  return (
     <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ListFilter className="mr-2 h-4 w-4" />
          Filtrar Categorías ({selectedCategories.length}/{allCategories.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="p-4 border-b">
          <h4 className="font-medium">Filtrar por <span className="text-primary">{pieChartConfig.labelKey}</span></h4>
        </div>
        <ScrollArea className="h-64">
           <div className="p-4 space-y-2">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all"
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Seleccionar todo"
                    />
                    <label htmlFor="select-all" className="font-medium">Seleccionar todo</label>
                </div>
                {allCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                        />
                        <label htmlFor={category} className="font-normal text-sm text-muted-foreground truncate">{category}</label>
                    </div>
                ))}
           </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
