import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function ProductsPage(){
   
    return (
        <div>
            <Heading href="/products/add">
                <Heading.Title className="mb-1">Products</Heading.Title>
                <Heading.Desc>Manage your products</Heading.Desc>
            </Heading>
            <DataTable />
        </div>
    )
}