import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ConflictError, getItems, reserveItem, unreserveItem, WishItem } from "../../../api";
import Wish from "../Wish/Wish";
import framedCloud from "../../../assets/framed-cloud.svg";
import sadCloud from "../../../assets/sad-cloud.svg";
import AddItemDialog, { AddItemDialogHandle } from "../AddItemDialog/AddItemDialog";
import ReserveDialog, { ReserveDialogHandle, ReserveMode } from "../ReserveDialog/ReserveDialog";
import {
    initialWishlistState,
    wishlistReducer,
} from "./wishlistReducer";

type SortBy = 'ascending' | 'descending';

function Wishlist() {
    const [state, dispatch] = useReducer(wishlistReducer, initialWishlistState);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const addItemDialogRef = useRef<AddItemDialogHandle>(null);
    const reserveDialogRef = useRef<ReserveDialogHandle>(null);
    const [onlyUnreserved, setOnlyUnreserved] = useState(false);
    const [sortBy, setSortBy] = useState<SortBy | null>(null);

    // Derived view of the items: filter (O(n)) then optionally sort (O(n log n)).
    // Memoized so it only recomputes when the items or the filter/sort change,
    // not on every render. We filter first so sorting only touches items we keep,
    // and we sort a copy so the reducer's state is never mutated.
    const visibleItems = useMemo(() => {
        const filtered = onlyUnreserved
            ? state.items.filter((item) => item.reservedBy === null)
            : state.items;

        if (sortBy === null) return filtered;

        const sorted = [...filtered];
        sorted.sort((a, b) =>
            sortBy === "ascending"
                ? a.priceMinor - b.priceMinor
                : b.priceMinor - a.priceMinor,
        );
        return sorted;
    }, [state.items, onlyUnreserved, sortBy]);

    const handleItemAdded = (item: WishItem) => {
        dispatch({ type: "ADD_ITEM", item });
    };

    // Opens the confirm dialog in the appropriate mode.
    const handleReserveRequest = (item: WishItem) => {
        reserveDialogRef.current?.open(item, "reserve");
    };

    const handleUnreserveRequest = (item: WishItem) => {
        reserveDialogRef.current?.open(item, "unreserve");
    };

    // Performs the actual reserve/unreserve. Dispatches UPDATE_ITEM on success.
    // On conflict we still sync the item's latest state, then re-throw so the
    // dialog stays open and shows the error.
    const handleReserveConfirm = async (item: WishItem, mode: ReserveMode) => {
        try {
            const updated =
                mode === "reserve"
                    ? await reserveItem(item.id)
                    : await unreserveItem(item.id);
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

            <div className="px-8 pb-8 pt-2">
                {isLoading ? (
                    <p>Loading...</p>
                ) : loadingError ? (
                    <div className="flex flex-col items-center text-center">
                        <img className="size-140" src={sadCloud} alt="" />
                        <h1>Something went wrong</h1>
                        <h2>{loadingError}</h2>
                    </div>
                ) : (
                    <div>
                        <div className="flex w-full items-end justify-end gap-4 pb-4">
                            <div className="text-sm">
                                <span>Filter by: </span>
                                <button
                                    type="button"
                                    className="link text-sm!"
                                    onClick={() => setOnlyUnreserved((prev) => !prev)}
                                >
                                    {onlyUnreserved ? 'All' : 'Unreserved Only'}
                                </button>
                            </div>
                            <div className="text-sm">
                                <span>Sort by: </span>
                                <select
                                    id="sort-by"
                                    title="Sort by"
                                    value={sortBy ?? ''}
                                    onChange={(e) =>
                                        setSortBy(
                                            e.target.value === ''
                                                ? null
                                                : (e.target.value as SortBy),
                                        )
                                    }
                                >
                                    <option value="">Default</option>
                                    <option value="ascending">Price Asc.</option>
                                    <option value="descending">Price Desc.</option>
                                </select>
                            </div>
                        </div>
                        <ul className="flex flex-row flex-wrap gap-4">
                            {visibleItems.map((item) => (
                                <li key={item.id}>
                                    <Wish
                                        item={item}
                                        onReserve={handleReserveRequest}
                                        onUnreserve={handleUnreserveRequest}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <AddItemDialog ref={addItemDialogRef} onItemAdded={handleItemAdded} />
            <ReserveDialog ref={reserveDialogRef} onConfirm={handleReserveConfirm} />
        </div>
    )
}

export default Wishlist;
