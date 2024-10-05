import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import { RightSIdeBar } from "@/components/shared/RightSIdeBar";
import BottomBar from "@/components/shared/BottomBar";



const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Threads",
  description: "Threads Application",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Topbar/>
        <main className="flex -flex-row">
          <LeftSideBar/>
          <section className="main-container">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </section>
          
          <RightSIdeBar/>
        </main>
        <BottomBar/>
        </body>
    </html>
    </ClerkProvider>
  );
}
