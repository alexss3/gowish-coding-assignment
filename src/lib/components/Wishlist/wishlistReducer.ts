import type { WishItem } from "../../../api";

export interface WishlistState {
    items: WishItem[];
}

export type WishlistAction =
    | { type: "SET_ITEMS"; items: WishItem[] }
    | { type: "ADD_ITEM"; item: WishItem }
    // Replaces a single item in place (e.g. after a successful reserve).
    | { type: "UPDATE_ITEM"; item: WishItem };

export const initialWishlistState: WishlistState = {
    items: [],
};

export function wishlistReducer(
    state: WishlistState,
    action: WishlistAction,
): WishlistState {
    switch (action.type) {
        case "SET_ITEMS":
            return { ...state, items: action.items };

        case "ADD_ITEM":
            return { ...state, items: [...state.items, action.item] };

        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.item.id ? action.item : item,
                ),
            };

        default:
            return state;
    }
}
