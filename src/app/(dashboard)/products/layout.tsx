'use client'
import { AsideContext } from '@/libs/contexts/AsideContext'
import { FolderPlusIcon, PencilSquareIcon, TableCellsIcon } from '@heroicons/react/24/outline'
import { useContext, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    const { asideDispatch } = useContext(AsideContext)
    const pathname = usePathname()

    const navigationData = useMemo(() => [
        {
            name: 'Products',
            href: '/products',
            icon: TableCellsIcon,
            current: true
        },
        {
            name: 'Add Product',
            href: '/products/add',
            icon: FolderPlusIcon,
            current: false
        },
        {
            name: 'Edit Product',
            href: '?',
            icon: PencilSquareIcon,
            current: false
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
        
    }, [asideDispatch, navigationData]);

    return (
        <>
            {children}
        </>
    )
}
