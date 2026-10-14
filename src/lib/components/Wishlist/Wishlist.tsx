import { useEffect, useState } from "react";
import { getItems, WishItem } from "../../../api";
import Wish from "../Wish/Wish";
import framedCloud from "../../../assets/framed-cloud.svg";

function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    const loadItems = async () => {
        try {
            const items = await getItems();

            setWishlistItems(items);
        } catch (error) {
            // handle this later
            setLoadingError('Error loading products');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="bg-surface py-4 px-4 flex gap-4">
                <img className="size-12" src={framedCloud} alt="GoWish" />
                <h1>My Wishlist</h1>
            </div>

            <div className="p-8">
                {isLoading ? (
                    <p>Loading...</p>
                ) : loadingError ? (
                    <p style={{ color: 'red' }}>{loadingError}</p>
                ) : (
                    <ul className="flex flex-row flex-wrap gap-4">
                        {wishlistItems.map((item) => (
                            <li key={item.id}>
                                <Wish item={item} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
        </div>
    )
}

export default Wishlist;