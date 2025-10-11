
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { KeyRound, Shield, Bell, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function ApiSettings({ api }: { api: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield /> Control de Acceso</CardTitle>
          <CardDescription>Define si tu API requiere autenticación o es de acceso público.</CardDescription>
        </CardHeader>
        <CardContent>
            <RadioGroup defaultValue={api.access.toLowerCase()} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <RadioGroupItem value="privado" id="privado" className="peer sr-only" />
                    <Label htmlFor="privado" className="flex flex-col items-start rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">
                        <span className="font-semibold mb-1">🔒 Privado</span>
                        <span className="text-sm font-normal text-muted-foreground">Requiere un token de API para autenticar las peticiones. Recomendado para datos sensibles.</span>
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="público" id="publico" className="peer sr-only" />
                    <Label htmlFor="publico" className="flex flex-col items-start rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors">
                        <span className="font-semibold mb-1">🌍 Público</span>
                        <span className="text-sm font-normal text-muted-foreground">Cualquiera puede acceder a la API sin autenticación. Usar con precaución.</span>
                    </Label>
                </div>
            </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound /> Tokens y Límites de Uso</CardTitle>
          <CardDescription>Gestiona las credenciales de acceso y los límites para proteger tu API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="api-token">Token de Acceso (API Key)</Label>
                <div className="flex items-center gap-2">
                    <Input id="api-token" type="password" readOnly value="sk_abc123def456ghi789jkl012mno" className="font-mono"/>
                    <Button variant="outline"><RefreshCw className="mr-2" />Regenerar</Button>
                </div>
            </div>
            
            <Separator />

            <div className="space-y-4">
                <Label>Límites de Peticiones</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="daily-limit" className="text-sm font-normal text-muted-foreground">Límite Diario (requests/día)</Label>
                        <Input id="daily-limit" type="number" defaultValue="1000" />
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="minute-limit" className="text-sm font-normal text-muted-foreground">Límite por Minuto (requests/min)</Label>
                        <Input id="minute-limit" type="number" defaultValue="60" />
                     </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell /> Notificaciones</CardTitle>
                <CardDescription>Configura las alertas que quieres recibir sobre el uso de esta API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                    <Label htmlFor='limit-alerts'>Alertas por límite alcanzado</Label>
                    <p className="text-sm text-muted-foreground">Recibe un correo cuando el uso se acerque al 80%, 90% y 100%.</p>
                </div>
                <Switch id='limit-alerts' defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                    <Label htmlFor='weekly-report'>Reporte semanal de uso</Label>
                     <p className="text-sm text-muted-foreground">Recibe un resumen del uso y rendimiento de la API cada lunes.</p>
                </div>
                <Switch id='weekly-report' defaultChecked />
            </div>
          </CardContent>
      </Card>
      
       <div className="flex justify-end pt-6 border-t">
          <Button size="lg">Guardar Cambios</Button>
      </div>
    </div>
  );
}
