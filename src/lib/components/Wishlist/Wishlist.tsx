import { useEffect, useReducer, useRef, useState } from "react";
import { ConflictError, getItems, reserveItem, WishItem } from "../../../api";
import Wish from "../Wish/Wish";
import framedCloud from "../../../assets/framed-cloud.svg";
import sadCloud from "../../../assets/sad-cloud.svg";
import AddItemDialog, { AddItemDialogHandle } from "../AddItemDialog/AddItemDialog";
import ReserveDialog, { ReserveDialogHandle } from "../ReserveDialog/ReserveDialog";
import {
    initialWishlistState,
    wishlistReducer,
} from "./wishlistReducer";

function Wishlist() {
    const [state, dispatch] = useReducer(wishlistReducer, initialWishlistState);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const addItemDialogRef = useRef<AddItemDialogHandle>(null);
    const reserveDialogRef = useRef<ReserveDialogHandle>(null);

    const handleItemAdded = (item: WishItem) => {
        dispatch({ type: "ADD_ITEM", item });
    };

    // Opens the confirm dialog for a given item.
    const handleReserveRequest = (item: WishItem) => {
        reserveDialogRef.current?.open(item);
    };

    // Performs the actual reserve. Dispatches UPDATE_ITEM on success.
    // On conflict we still sync the item's latest state, then re-throw so the
    // dialog stays open and shows the error.
    const handleReserveConfirm = async (item: WishItem) => {
        try {
            const updated = await reserveItem(item.id);
            dispatch({ type: "UPDATE_ITEM", item: updated });
        } catch (err) {
            if (err instanceof ConflictError) {
                dispatch({ type: "UPDATE_ITEM", item: err.item });
            }
            throw err;
        }
    };

    const loadItems = async () => {
        try {
            const items = await getItems();
            dispatch({ type: "SET_ITEMS", items });
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
            <nav className="bg-surface py-4 px-4 flex gap-4 justify-between">
                <div className="flex gap-4 items-center">
                    <img className="size-12" src={framedCloud} alt="GoWish" />
                    <h1>My Wishlist</h1>
                </div>
                <div>
                    <button title="Add Item" onClick={() => addItemDialogRef.current?.open()}>
                        Add Item
                    </button>
                </div>
            </nav>

            <div className="p-8">
                {isLoading ? (
                    <p>Loading...</p>
                ) : loadingError ? (
                    <div className="flex flex-col items-center text-center">
                        <img className="size-140" src={sadCloud} alt="" />
                        <h1>Something went wrong</h1>
                        <h2>{loadingError}</h2>
                    </div>
                ) : (
                    <ul className="flex flex-row flex-wrap gap-4">
                        {state.items.map((item) => (
                            <li key={item.id}>
                                <Wish item={item} onReserve={handleReserveRequest} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <AddItemDialog ref={addItemDialogRef} onItemAdded={handleItemAdded} />
            <ReserveDialog ref={reserveDialogRef} onConfirm={handleReserveConfirm} />
        </div>
    )
}

export default Wishlist;
