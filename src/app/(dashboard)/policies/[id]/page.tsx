import Heading from "@/ui/inc/heading.section";
import PolicyFrom from "./form";

export default function PolicyViewPage(){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Policy Detail</Heading.Title>
                <Heading.Desc>Info of policy</Heading.Desc>
            </Heading>
            <PolicyFrom />
        </div>
    )
}