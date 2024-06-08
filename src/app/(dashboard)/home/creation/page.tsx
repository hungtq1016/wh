
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function ProductsPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Creation Section</Heading.Title>
                <Heading.Desc>Tùy chỉnh banner, hiển thị</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}