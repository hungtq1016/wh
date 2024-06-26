'use client'
import AsideSection from "@/ui/inc/aside.section";
import HeaderSection from "@/ui/inc/header.section";
import { useContext } from "react";
import { ToastContainer, Flip } from 'react-toastify';
import { AsideContext } from "./AsideContext";

export default function ClientProvider({ children }: { children: React.ReactNode }) {

    const { asideState } = useContext(AsideContext)

    const paddingStyle = {
        paddingLeft: asideState.navigation.length === 0 ? '0px' : '56px'
    }
    return (
        <>
            <AsideSection />
            <div className="flex flex-col min-h-screen"
            style={paddingStyle}
            >
                <HeaderSection />
                <main className="py-14">
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