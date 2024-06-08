
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function ProductsPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Special Section</Heading.Title>
                <Heading.Desc>Tùy chỉnh special, hiển thị</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}