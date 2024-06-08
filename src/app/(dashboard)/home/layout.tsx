'use client'
import { AsideContext } from '@/libs/contexts/AsideContext'
import { useContext, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { CompareArrowsOutlined, ContactEmergencyOutlined, FilterFramesOutlined, InfoOutlined, PanoramaOutlined, RecentActorsOutlined, ShoppingCartCheckout, SlideshowOutlined, ViewCarouselOutlined, ViewColumnOutlined, VrpanoOutlined } from '@mui/icons-material'
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    const { asideDispatch } = useContext(AsideContext)
    const pathname = usePathname()

    const navigationData = useMemo(() => [
        {
            name: 'Hero Section',
            href: '/home/hero',
            icon: VrpanoOutlined,
            value: 'view',
            current: true
        },
        {
            name: 'Cover Section',
            href: '/home/cover',
            icon: ViewColumnOutlined,
            value: 'view',
            current: false
        },
        {
            name: 'About Section',
            href: '/home/about',
            value: 'view',
            icon: ViewCarouselOutlined,
            current: false
        },
        {
            name: 'Special Section',
            href: '/home/special',
            value: 'view',
            icon: SlideshowOutlined,
            current: false
        },
        {
            name: 'Creation Section',
            href: '/home/creation',
            value: 'view',
            icon: RecentActorsOutlined,
            current: false
        },
        {
            name: 'Timeline Section',
            href: '/home/timeline',
            value: 'view',
            icon: PanoramaOutlined,
            current: false
        },
        {
            name: 'Compare Section',
            href: '/home/compare',
            value: 'view',
            icon: CompareArrowsOutlined,
            current: false
        },
        {
            name: 'Frame Section',
            href: '/home/frame',
            value: 'view',
            icon: FilterFramesOutlined,
            current: false
        },
        {
            name: 'Author Section',
            href: '/home/author',
            value: 'view',
            icon: ContactEmergencyOutlined,
            current: false
        },
        {
            name: 'Description Section',
            href: '/home/description',
            value: 'view',
            icon: InfoOutlined,
            current: false
        },
        {
            name: 'Shop Section',
            href: '/home/shop',
            value: 'view',
            icon: ShoppingCartCheckout,
            current: false
        },
        
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
