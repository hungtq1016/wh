import Heading from "@/ui/inc/heading.section";
import CollectionFrom from "./form";

export default function AddCollectionPage(){
    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Tạo Triển Lãm</Heading.Title>
                <Heading.Desc>Tạo mới</Heading.Desc>
            </Heading>
            <CollectionFrom />
        </div>
    )
}