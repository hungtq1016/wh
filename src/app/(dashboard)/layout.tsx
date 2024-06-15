import type { Metadata } from "next";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import AsideSection from "@/ui/inc/aside.section";
import HeaderSection from "@/ui/inc/header.section";
import { AsideProvider } from "@/libs/contexts/AsideContext";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ToastContainer, Flip } from 'react-toastify';
import ReactQueryClientContext from "@/libs/contexts/ReactQueryClientContext";

export default function RootLayout({ children }: { children: Readonly<React.ReactNode> }) {


  return (
    <html lang="en">
      <body>
        <ReactQueryClientContext>
          <div>
            <AppRouterCacheProvider>
              <AsideProvider>
                <AsideSection />
                <div className="lg:pl-14">
                  <HeaderSection />
                  <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                  </main>
                </div>
              </AsideProvider>
            </AppRouterCacheProvider>
          </div>
        </ReactQueryClientContext>
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Flip}
        />

      </body>

    </html>
  )
}

export const metadata: Metadata = {
  title: "CMS | Lược sử thế giới",
  description: "CMS | Lược sử thế giới",
};