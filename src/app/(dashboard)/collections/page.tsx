
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function CollectionsPage(){

    return (
        <div>
            <Heading href="/collections/add">
                <Heading.Title className="mb-1">Bộ Sưu Tập</Heading.Title>
                <Heading.Desc>Quản lý bộ sưu tập</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}