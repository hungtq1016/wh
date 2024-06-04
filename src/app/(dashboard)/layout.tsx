import type { Metadata } from "next";
import "./globals.css";

import AsideSection from "@/ui/inc/aside.section";
import HeaderSection from "@/ui/inc/header.section";


export default function RootLayout({children}:{children:Readonly<React.ReactNode>}) {
  return (
    <html lang="en">
      <body>
      <div>
        <AsideSection/>

        <div className="lg:pl-14">
          <HeaderSection/>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
      </body>
      
    </html>
  )
}

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};