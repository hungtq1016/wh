import { useState } from "react";
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default async function ProductsPage(){
    const response = await fetch('http://localhost:3000/api/v1/products', { cache: 'no-store' })
    const data = await response.json()
    const rows = data.data    
    return (
        <div>
            <Heading href="/products/add">
                <Heading.Title className="mb-1">Products</Heading.Title>
                <Heading.Desc>Manage your products</Heading.Desc>
            </Heading>
            <DataTable rows={rows}/>
        </div>
    )
}