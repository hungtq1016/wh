'use client'
import AsideSection from "@/ui/inc/aside.section";
import HeaderSection from "@/ui/inc/header.section";
import { useContext } from "react";
import { ToastContainer, Flip } from 'react-toastify';
import { AsideContext } from "./AsideContext";

export default function ClientProvider({ children }: { children: React.ReactNode }) {

  const { asideState } = useContext(AsideContext)

    return (
        <>
            <AsideSection />
            <div className={
                asideState.navigation.length === 0
                ? 'lg:pl-0'
                : 'lg:pl-14'
            }>
                <HeaderSection />
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
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
        </>
    )
}