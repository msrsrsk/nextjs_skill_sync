interface InfoRowProps {
    label: string;
    value: string;
}

const InfoRow = ({
    label,
    value,
}: InfoRowProps) => {
    return (
        <div className="flex gap-1">
            <dt className="cart-exp-dt">{label}</dt>
            <dd>{value}</dd>
        </div>
    )
}

export default InfoRow