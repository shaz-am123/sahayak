import "./globals.css";
import type { Metadata } from "next";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";


export const metadata: Metadata = {
  title: "Sahayak",
  description: "A Personal-finance management application  ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="indie-flower-regular">
        {children}
      </body>
    </html>
  );
}
