import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Telegram Mini App",
  description: "This is a boilerplate for Telegram Mini App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="main-wrapper flex min-h-screen flex-col p-4">
              <header className="container">
                <div className="flex h-20 items-center justify-between py-6">
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <h1>Telegram Mini App</h1>
                  </div>
                </div>
                <Navbar />
              </header>
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
