import Heading from "@/ui/inc/heading.section";
import Swap from "./swap";

export default function ProductViewPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Product Detail</Heading.Title>
                <Heading.Desc>Info of product</Heading.Desc>
            </Heading>
            <Swap />
        </div>
    )
}