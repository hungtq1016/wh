
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function ProductsPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">About Book Section</Heading.Title>
                <Heading.Desc>Tùy chỉnh about book, hiển thị trên trang chủ</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}