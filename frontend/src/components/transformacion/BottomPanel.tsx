
'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PanelBottom, Table, TerminalSquare, Download, ChevronDown, X } from "lucide-react";
import { DataTable } from "../limpieza-de-datos/data-table";
import { Textarea } from "../ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";

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
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-5 right-5 z-10"
          >
            <Button
              variant="secondary"
              className="rounded-full h-12 w-12 p-0 shadow-lg border-2 border-border"
              onClick={() => setIsOpen(true)}
            >
              <PanelBottom className="h-6 w-6" />
              <span className="sr-only">Abrir Panel de Resultados</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-4 left-4 right-4 h-[60vh] max-h-[700px] z-20 bg-card/95 backdrop-blur-sm border rounded-2xl shadow-2xl flex flex-col p-4"
          >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 h-7 w-7"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar Panel</span>
            </Button>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto">
                {/* Data Output Section */}
                <div className="flex flex-col h-full bg-background rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-muted-foreground"><Table /> OUTPUT</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Download className="mr-2 h-4 w-4"/>
                                    Exportar
                                    <ChevronDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Exportar como CSV</DropdownMenuItem>
                                <DropdownMenuItem>Exportar como Excel</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <DataTable columns={mockColumns} data={mockData} />
                    </div>
                </div>
                
                {/* Logs Section */}
                <div className="flex flex-col h-full bg-background rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-muted-foreground"><TerminalSquare /> LOGS</h3>
                    <Textarea
                        readOnly
                        value={mockLogs}
                        className="h-full bg-muted/50 font-mono text-xs resize-none"
                    />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
