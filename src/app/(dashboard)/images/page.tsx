
import P from "@/ui/base/p";
import DataTable from "./table";
import Heading from "@/ui/inc/heading.section";
import H1 from "@/ui/base/h1";

export default function ImagesPage(){

    return (
        <div className="flex flex-col gap-32">
            <div>
                <Heading>
                    <Heading.Title className="mb-1">Images</Heading.Title>
                    <Heading.Desc>Manage your images </Heading.Desc>
                </Heading>
                <H1>Images by users</H1>
                <DataTable 
                    query={{
                        filterBy : 'userId'
                    }} 
                    route="users"/>
            </div>
            <div>
                <H1>Images base on products</H1>
                <DataTable 
                    query={{
                        filterBy : 'productId'
                    }} 
                    route="products"/>
            </div>
            <div>
                <H1>Images base on products</H1>
                <DataTable 
                    query={{
                        filterBy : 'billBoardId'
                    }} 
                    />
            </div>
            <div>
                <H1>Images don&apos;t use</H1>
                <DataTable
                     query={{
                        filterBy : ['productId', 'userId','billBoardId']
                     }}
                />
            </div>
        </div>
    )
}