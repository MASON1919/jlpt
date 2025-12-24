import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import AuthProvider from "@/components/SessionProvider";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "JLPT Master",
  description: "Master JLPT with precision learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <header>
              <Navbar />
            </header>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

