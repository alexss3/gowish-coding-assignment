import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ConflictError, type WishItem } from "../../../api";
import { capitalize } from "../../utils/string";

interface Props {
    // Called when the user confirms. Should perform the async reserve and
    // throw on failure so this dialog can keep itself open and show the error.
    onConfirm: (item: WishItem) => Promise<void>;
}

export interface ReserveDialogHandle {
    open: (item: WishItem) => void;
    close: () => void;
}

const ReserveDialog = forwardRef<ReserveDialogHandle, Props>(function ReserveDialog(
    { onConfirm },
    ref,
) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [item, setItem] = useState<WishItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Terminal state: the item was taken by someone else, so retrying makes no
    // sense. We collapse the footer to a single "Close" button.
    const [isConflict, setIsConflict] = useState(false);

    const handleClose = () => {
        dialogRef.current?.close();
        setItem(null);
        setError(null);
        setIsSubmitting(false);
        setIsConflict(false);
    };

    useImperativeHandle(ref, () => ({
        open: (nextItem: WishItem) => {
            setItem(nextItem);
            setError(null);
            setIsSubmitting(false);
            setIsConflict(false);
            dialogRef.current?.showModal();
        },
        close: handleClose,
    }));

    const handleConfirm = async () => {
        if (!item) return;
        setError(null);
        setIsSubmitting(true);
        try {
            await onConfirm(item);
            handleClose();
        } catch (err) {
            // Keep the dialog open and surface the message.
            if (err instanceof ConflictError && err.item.reservedBy) {
                setError(`Item was reserved by ${capitalize(err.item.reservedBy)}`);
                setIsConflict(true);
            } else {
                setError(err instanceof Error ? err.message : "Failed to reserve item");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="w-[400px] rounded-lg p-6 m-auto backdrop:bg-black/40"
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-xl">Reserve item</h2>
                <p className="text-sm">
                    Do you want to reserve
                    {item ? <strong> {item.title}</strong> : null}?
                </p>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end gap-2">
                    {isConflict ? (
                        <button type="button" onClick={handleClose}>
                            Close
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Reserving..." : "Reserve"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </dialog>
    );
});

export default ReserveDialog;
