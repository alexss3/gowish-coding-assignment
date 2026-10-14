import { WishItem } from "../../../api";
import placeholder from "../../../assets/placeholder-item.jpg";
import { formatPrice } from "../../utils/currency";


interface Props {
    item: WishItem;
}

function Wish({ item }: Props) {
    return (
        <div className="flex flex-col p-4 gap-2 bg-surface rounded-md" data-id={item.id}>
            <div className="flex items-center justify-center">
                <img className="max-w-48" src={item.imageUrl ?? placeholder} alt={item.title} title={item.title} />
            </div>
            <div className="flex flex-col items-start">
                <p className="text-sm"><strong>{item.title}</strong></p>
                <p className="text-sm">{formatPrice(item.priceMinor, item.currency)}</p>
            </div>
        </div>
    )
}

export default Wish;