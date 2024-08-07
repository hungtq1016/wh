import Heading from "@/ui/inc/heading.section";
import Swap from "./swap";

export default function Page({params}:{params:{id:string}}){

    return (
        <div>
            <Heading>
                <Heading.Title className="mb-1">Chi Tiết Về Bộ Sưu Tập</Heading.Title>
                <Heading.Desc>Thông tin thêm</Heading.Desc>
            </Heading>
            <Swap collectionId={params.id}/>
        </div>
    )
}