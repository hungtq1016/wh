'use client'
import { useRouter } from "next/navigation";

export default function ProductsPage(){
    const router = useRouter()
    router.push('/home/hero')
    return (
        <>
        </>
    )
}