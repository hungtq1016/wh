import Heading from "@/ui/inc/heading.section";
import ProductFrom from "./form";

export default function AddProductPage(){
    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Create Product</Heading.Title>
                <Heading.Desc>Add new product</Heading.Desc>
            </Heading>
            <ProductFrom />
        </div>
    )
}