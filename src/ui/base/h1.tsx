export default function H1({children, ...props}:{children: React.ReactNode, className?: string}){
    return (
        <h1
        className={`text-2xl font-semibold text-gray-900 dark:text-gray-50 ${props.className}`}
        >
            {children}
        </h1>
    )
}