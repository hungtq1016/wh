import Heading from "@/ui/inc/heading.section";
import PolicyFrom from "./form";

export default function AddPolicyPage(){
    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Create Policy</Heading.Title>
                <Heading.Desc>Add new policy</Heading.Desc>
            </Heading>
            <PolicyFrom />
        </div>
    )
}