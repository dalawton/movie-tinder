import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Tinder",
  description: "Swipe to find your next movie!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
