import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';


import { AsideProvider } from "@/libs/contexts/AsideContext";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ReactQueryClientContext from "@/libs/contexts/ReactQueryClientContext";

import { Metadata } from "next";
import ClientProvider from "@/libs/contexts/ClientProvider";

export const metadata: Metadata = {
  title: "CMS | Lược sử thế giới",
  description: "CMS | Lược sử thế giới",
};

export default function RootLayout({ children }: { children: Readonly<React.ReactNode> }) {

  return (
    <html lang="en">
      <body>
        <ReactQueryClientContext>
          <div>
            <AppRouterCacheProvider>
              <AsideProvider>
                <ClientProvider>
                  {children}
                </ClientProvider>
              </AsideProvider>
            </AppRouterCacheProvider>
          </div>
        </ReactQueryClientContext>
      </body>
    </html>
  )
}

