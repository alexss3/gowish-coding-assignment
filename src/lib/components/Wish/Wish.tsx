import { WishItem } from "../../../api";

interface Props {
    item: WishItem;
}

function Wish({ item }: Props) {
    return (
        <div>
            <p>id: {item.id}</p>
            <p>title: {item.title}</p>
            <p>priceMinor: {item.priceMinor}</p>
            <p>currency: {item.currency}</p>
            {item.url && <p>url: {item.url}</p>}
            {item.imageUrl && <p>imageUrl: {item.imageUrl}</p>}
            <p>reservedBy: {item.reservedBy ?? 'none'}</p>
        </div>
    )
}

export default Wish;