
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function OrdersPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Orders</Heading.Title>
                <Heading.Desc>Manage your orders</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}