
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function ImagesPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Images</Heading.Title>
                <Heading.Desc>Manage your images</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}