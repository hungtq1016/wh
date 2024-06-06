
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";

export default function ImagesPage(){

    return (
        <div className="flex flex-col gap-32">
            <div>
                <Heading>
                    <Heading.Title className="mb-1">Images Dont Use</Heading.Title>
                    <Heading.Desc>Manage your images </Heading.Desc>
                </Heading>
                <DataTable query={["allnull"]}/>
            </div>
            <div>
                <Heading>
                    <Heading.Title className="mb-1">Product Image</Heading.Title>
                    <Heading.Desc>Manage your images </Heading.Desc>
                </Heading>
                <DataTable query={["product"]}/>
            </div>
            <div>
                <Heading>
                    <Heading.Title className="mb-1">User Image</Heading.Title>
                    <Heading.Desc>Manage your images </Heading.Desc>
                </Heading>
                <DataTable query={["user"]}/>
            </div>
        </div>
    )
}