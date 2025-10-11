
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthModalProvider } from '@/components/auth-modal';
import { PageLoader } from '@/components/ui/page-loader';
import { cn } from '@/lib/utils';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { MainContentWrapper } from '@/components/main-content-wrapper';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SIG',
  description: 'Un panel de control para SIG',
  icons: {
    icon: [
      { url: '/mobile/favicon.ico', sizes: 'any' },
      { url: '/mobile/icon.svg', type: 'image/svg+xml' },
      { url: '/mobile/android-36.png', type: 'image/png', sizes: '36x36' },
      { url: '/mobile/android-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/mobile/android-72.png', type: 'image/png', sizes: '72x72' },
      { url: '/mobile/android-96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/mobile/apple-touch-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthModalProvider />
          <PageLoader />
          <DashboardSidebar />
          <MainContentWrapper>
            {children}
          </MainContentWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
