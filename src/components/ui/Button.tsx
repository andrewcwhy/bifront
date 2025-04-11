type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'danger' | 'success' | 'warning'
}

export default function Button({
    children,
    variant = 'primary',
    className = '',
    ...props
}: ButtonProps) {
    const base = 'px-3 py-1 rounded text-white transition'
    const color = {
        primary: 'bg-blue-600 hover:bg-blue-700',
        danger: 'bg-red-600 hover:bg-red-700',
        success: 'bg-green-600 hover:bg-green-700',
        warning: 'bg-yellow-500 hover:bg-yellow-600',
    }[variant]

    return (
        <button className={`${base} ${color} ${className}`} {...props}>
            {children}
        </button>
    )
}
