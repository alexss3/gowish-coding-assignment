import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { addItem, WishItem } from "../../../api";

interface Props {
    onItemAdded: (item: WishItem) => void;
}

export interface AddItemDialogHandle {
    open: () => void;
    close: () => void;
}

/**
 * Normalizes a user-entered URL: ensures it starts with "http://",
 * but never duplicates an existing http:// (or https://) prefix.
 */
function normalizeUrl(raw: string): string {
    const trimmed = raw.trim();
    if (trimmed === "") return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `http://${trimmed}`;
}

const AddItemDialog = forwardRef<AddItemDialogHandle, Props>(function AddItemDialog(
    { onItemAdded },
    ref,
) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setTitle("");
        setPrice("");
        setUrl("");
        setError(null);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        dialogRef.current?.close();
        resetForm();
    };

    useImperativeHandle(ref, () => ({
        open: () => {
            resetForm();
            dialogRef.current?.showModal();
        },
        close: handleClose,
    }));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // Price is entered in major units (e.g. "449.00") -> convert to minor (cents).
        const priceMinor = Math.round(parseFloat(price) * 100);

        try {
            const newItem = await addItem({
                title: title.trim(),
                priceMinor,
                url: url.trim() === "" ? undefined : normalizeUrl(url),
            });
            onItemAdded(newItem);
            handleClose();
        } catch (err) {
            // log the error from the API
            console.error(err instanceof Error ? err.message : "Failed to add item");
            // display a user friendly error
            setError("Failed to add item");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="w-[400px] h-[400px] rounded-lg p-6 m-auto backdrop:bg-black/40"
        >
            <form className="flex flex-col h-full gap-4" onSubmit={handleSubmit}>
                <h2 className="text-xl">Add Item</h2>

                <label className="flex flex-col gap-1 text-sm">
                    Title
                    <input
                        className="border border-gray-300 rounded px-2 py-1"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                    Price
                    <input
                        className="border border-gray-300 rounded px-2 py-1"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                    URL
                    <input
                        className="border border-gray-300 rounded px-2 py-1"
                        type="text"
                        placeholder="example.com/item"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="mt-auto flex justify-end gap-2">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Item"}
                    </button>
                </div>
            </form>
        </dialog>
    );
});

export default AddItemDialog;
