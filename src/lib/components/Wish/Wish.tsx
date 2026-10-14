import { CURRENT_USER, WishItem } from "../../../api";
import placeholder from "../../../assets/placeholder-item.jpg";
import { formatPrice } from "../../utils/currency";
import { capitalize } from "../../utils/string";


interface Props {
    item: WishItem;
    onReserve: (item: WishItem) => void;
    onUnreserve: (item: WishItem) => void;
}

function Wish({ item, onReserve, onUnreserve }: Props) {
    const isReserved = item.reservedBy !== null;
    const isReservedByMe = item.reservedBy === CURRENT_USER;

    return (
        <div className="flex flex-col p-4 gap-2 bg-surface rounded-md" data-id={item.id}>
            <div className="relative flex items-center justify-center">
                <img className="max-w-48" src={item.imageUrl ?? placeholder} alt={item.title} title={item.title} />
            </div>
            <div className="flex flex-col items-start">
                <p className="text-sm"><strong>{item.title}</strong></p>
                <p className="text-sm">{formatPrice(item.priceMinor, item.currency)}</p>
                {isReservedByMe ? (
                    <button
                        type="button"
                        className="link text-xs!"
                        onClick={() => onUnreserve(item)}
                    >
                        Unreserve Item
                    </button>
                ) : isReserved ? (
                    <p className="text-xs text-gray-500">Reserved by {capitalize(item.reservedBy ?? "")}</p>
                ) : (
                    <button
                        type="button"
                        className="link text-xs!"
                        onClick={() => onReserve(item)}
                    >
                        Reserve item
                    </button>
                )}
            </div>
        </div>
    )
}

export default Wish;
