
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
import { MoreHorizontal, FileText, Inbox } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { type File } from "@/services/fileService";

type RecentFilesTableProps = {
  files: File[];
};

export function RecentFilesTable({ files }: RecentFilesTableProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "PENDING":
        return "secondary"
      case "FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div>
      <Card className="border-2 border-accent">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Archivos Recientes</CardTitle>
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Opción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length > 0 ? (
                  files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        {file.filename}
                      </TableCell>
                      <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{formatBytes(file.size)}</TableCell>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center">
                       <div className="flex flex-col items-center gap-4">
                        <Inbox className="h-16 w-16 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No hay archivos recientes</h3>
                        <p className="text-muted-foreground">Sube o procesa un archivo para verlo aquí.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
