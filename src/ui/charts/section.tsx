import H1 from "../base/h1";

export default function ChartSection({children}:{children:React.ReactNode}){
    return(
        <section className="px-4">
            {children}
        </section>
    )
}

// eslint-disable-next-line react/display-name
ChartSection.Title = ({children,...props}:{children: React.ReactNode, className?:string}) => <H1 className={`py-3 ${props.className}`}>{children}</H1>;