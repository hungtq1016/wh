
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function PoliciesPage(){

    return (
        <div>
            <Heading href="/policies/add">
                <Heading.Title className="mb-1">Policies</Heading.Title>
                <Heading.Desc>Manage your policies</Heading.Desc>
            </Heading>
            <DataTable/>
        </div>
    )
}