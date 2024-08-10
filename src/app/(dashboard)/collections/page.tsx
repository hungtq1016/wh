
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function CollectionsPage(){

    return (
        <div>
            <Heading href="/collections/add">
                <Heading.Title className="mb-1">Triển Lãm</Heading.Title>
                <Heading.Desc>Quản lý Triển Lãm</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}