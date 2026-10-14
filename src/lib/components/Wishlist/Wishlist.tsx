import { useEffect, useState } from "react";
import { getItems, WishItem } from "../../../api";
import Wish from "../Wish/Wish";

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
        <div>
            <h1>My Wishlist</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : loadingError ? (
                <p style={{ color: 'red' }}>{loadingError}</p>
            ) : (
                <ul>
                    {wishlistItems.map((item) => (
                        <li key={item.id}>
                            <Wish item={item} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Wishlist;