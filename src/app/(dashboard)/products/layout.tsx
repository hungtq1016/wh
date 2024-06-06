'use client'
import { useAside } from '@/libs/contexts/AsideContext'
import { TableCellsIcon } from '@heroicons/react/24/outline'

export default function ProductsLayout({children}:{children:React.ReactNode}) {


    const {  } = useAside()

  

    return(
        <>
            {children}
        </>
    )
}
