
'use client';

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelBottom, Table, TerminalSquare, Download, ChevronDown } from "lucide-react";
import { DataTable } from "../limpieza-de-datos/data-table";
import { Textarea } from "../ui/textarea";

// Mock data for demonstration
const mockData = [
  { country: "Afghanistan", population: 36400000, "life expectancy": 58.7, income: 1870 },
  { country: "Albania", population: 2930000, "life expectancy": 78.0, income: 12400 },
  { country: "Algeria", population: 42000000, "life expectancy": 77.9, income: 13700 },
  { country: "Andorra", population: 77000, "life expectancy": null, income: 51500 },
  { country: "Angola", population: 30800000, "life expectancy": 65.2, income: 5850 },
];
const mockColumns = [
  { accessorKey: "country", header: "Country" },
  { accessorKey: "population", header: "Population" },
  { accessorKey: "life expectancy", header: "Life Expectancy" },
  { accessorKey: "income", header: "Income" },
];
const mockLogs = `[INFO] This is just a demo! To use all features login or create an account.
[INFO] ${new Date().toLocaleTimeString()}: Flow started.
[INFO] ${new Date().toLocaleTimeString()}: Loading node 'LOAD_CSV'.
[SUCCESS] ${new Date().toLocaleTimeString()}: Node 'LOAD_CSV' executed. 150 rows loaded.
[INFO] ${new Date().toLocaleTimeString()}: Executing node 'filterRows'.
[WARNING] ${new Date().toLocaleTimeString()}: 5 rows did not meet the condition and will be removed.
[SUCCESS] ${new Date().toLocaleTimeString()}: Flow completed successfully.
`;

export function BottomPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          className="absolute bottom-5 right-5 z-10 rounded-full h-12 w-12 p-0 shadow-lg border-2 border-border"
        >
          <PanelBottom className="h-6 w-6" />
          <span className="sr-only">Abrir Panel de Resultados</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[60vh] max-h-[800px] p-0 flex flex-col bg-card"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-auto">
            {/* Data Output Section */}
            <div className="flex flex-col h-full bg-background rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-muted-foreground"><Table /> OUTPUT</h3>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4"/>
                        Export
                        <ChevronDown className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
                <div className="flex-1 overflow-auto">
                    <DataTable columns={mockColumns} data={mockData} />
                </div>
            </div>
            
            {/* Logs Section */}
            <div className="flex flex-col h-full bg-background rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-muted-foreground"><TerminalSquare /> LOGS</h3>
                <Textarea
                    readOnly
                    value={mockLogs}
                    className="h-full bg-muted/50 font-mono text-xs resize-none"
                />
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
