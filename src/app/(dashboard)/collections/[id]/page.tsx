import Heading from "@/ui/inc/heading.section";
import Swap from "./swap";

export default function CollectionViewPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Collection Detail</Heading.Title>
                <Heading.Desc>Info of collection</Heading.Desc>
            </Heading>
            <Swap />
        </div>
    )
}