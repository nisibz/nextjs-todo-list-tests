import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Styledroot } from "./Styledroot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nextjs-todo-list-tests",
  description:
    "A basic Todo app using Next.js that demonstrates CRUD operations and state management. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0 }}
      >
        <AppRouterCacheProvider>
          <Styledroot>{children}</Styledroot>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
