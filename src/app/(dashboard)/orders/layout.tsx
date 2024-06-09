'use client'
import { AsideContext } from '@/libs/contexts/AsideContext'
import { FolderPlusIcon, PencilSquareIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { useContext, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    const { asideDispatch } = useContext(AsideContext)
    const pathname = usePathname()

    const navigationData = useMemo(() => [
        {
            name: 'Orders',
            href: '/orders',
            icon: TableCellsIcon,
            value: 'view',
            current: true
        }
    ], []); 

    useEffect(() => {
        asideDispatch({
            type: 'SET_NAVIGATION',
            payload: navigationData
        });

        asideDispatch({
            type: 'UPDATE_ACTIVE',
            payload: pathname
        });
        
    }, [asideDispatch, navigationData, pathname]);

    return (
        <>
            {children}
        </>
    )
}
