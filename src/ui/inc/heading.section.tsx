/* eslint-disable react/display-name */
import Link from "next/link";
import H1 from "../base/h1";
import P from "../base/p";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Heading({children, ...props}:{children: React.ReactNode, className?:string, href?:string}){
    
    return(
        <div className={`flex justify-between items-center border-b pb-2 ${props.className}`}>
            <div>
                {children}
            </div>
            {
                props.href && (
                    <Link 
                        className="inline-flex items-center gap-2 bg-gray-950 text-gray-50 px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
                        href={props.href}>
                            <PlusIcon className="size-5 text-gray-50"/>
                            <span>Thêm Mới</span>
                    </Link>
                )
            }
        </div>
    )
}

Heading.Title = ({children,...props}:{children: React.ReactNode, className?:string}) => <H1 className={props.className} >{children}</H1>
Heading.Desc = ({children,...props}:{children: React.ReactNode, className?:string}) => <P className={`!text-gray-600 !font-medium text-sm ${props.className}`} >{children}</P>