import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Chivo } from "next/font/google";
import "../styles/globals.scss";

const chivo = Chivo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToDoApp",
  description:
    "ToDoApp is a task management application created with Next.js and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={chivo.className}>
        <div className="container">
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
