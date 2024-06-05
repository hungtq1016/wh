export default function P({children, ...props}:{children: React.ReactNode, className?: string}){
    return (
        <p
        className={`text-sm text-gray-900 dark:text-gray-50 ${props.className}`}
        >
            {children}
        </p>
    )
}