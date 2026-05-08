import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { TourProvider } from "@/lib/tour-context";
import { DemoDisclaimer } from "@/components/demo-disclaimer";
import { OnboardingTour } from "@/components/onboarding-tour";
import { TourInvitation } from "@/components/tour-invitation";
import { TourRestartChip } from "@/components/tour-restart-chip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dockwize Werkmap, conceptdemo",
  description: "Conceptdemo van het werkmap-platform voor Dockwize. Geen werkend product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <AuthProvider>
          <TourProvider>
            {children}
            <OnboardingTour />
            <TourInvitation />
            <TourRestartChip />
          </TourProvider>
        </AuthProvider>
        <DemoDisclaimer />
      </body>
    </html>
  );
}
