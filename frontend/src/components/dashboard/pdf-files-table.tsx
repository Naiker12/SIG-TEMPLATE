
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { MoreHorizontal, FileText } from "lucide-react"
import { Checkbox } from "../ui/checkbox"

const files = [
  {
    fileName: "contrato_proveedor_nuevo.pdf",
    uploadDate: "10/01/2024",
    status: "Fallido",
  },
  {
    fileName: "minuta_reunion_equipo.pdf",
    uploadDate: "09/01/2024",
    status: "Completo",
  },
   {
    fileName: "especificaciones_producto_v2.pdf",
    uploadDate: "08/01/2024",
    status: "En Espera",
  },
]

export function PdfFilesTable() {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Completo":
        return "default"
      case "En Espera":
        return "secondary"
      case "Fallido":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden md:block">
        <Card className="border-2 border-accent">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Archivos PDF Recientes</CardTitle>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MoreHorizontal />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"><Checkbox /></TableHead>
                    <TableHead>Nombre del Archivo</TableHead>
                    <TableHead>Fecha de Subida</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Opción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell className="font-medium">{file.fileName}</TableCell>
                      <TableCell>{file.uploadDate}</TableCell>
                      <TableCell>
                        <Badge className="text-xs" variant={getBadgeVariant(file.status)}>
                          {file.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Detalle</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <h2 className="text-lg font-semibold mb-4">Archivos PDF Recientes</h2>
        <div className="bg-card rounded-2xl shadow-sm border-2 border-accent">
            <div className="divide-y divide-border">
              {files.map((file, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-medium leading-none truncate">{file.fileName}</p>
                    <p className="text-sm text-muted-foreground">{file.uploadDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge className="text-xs" variant={getBadgeVariant(file.status)}>
                        {file.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Detalle</span>
                      </Button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}
