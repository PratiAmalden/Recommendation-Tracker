import { useEffect, useState } from "react";
import StarRating from "../ui/StarRating";

export default function CompletionForm({
    itemName,
    onComplete,
    onClose,
    initialRating = null,
    initialReview = ""
}) {
    const [rating, setRating] = useState(initialRating);
    const [review, setReview] = useState(initialReview);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const isEditing = initialRating !== null || initialReview !== "";

    useEffect(() => {
        setRating(initialRating);
        setReview(initialReview);
    }, [initialRating, initialReview]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !submitting) onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, submitting]);

    const submitCompletion = async (selectedRating) => {
        setSubmitting(true);
        setError("");

        try {
            await onComplete({ rating: selectedRating, review: review.trim() });
            onClose();
        } catch (submitError) {
            setError(submitError.message || "Could not complete this recommendation.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !submitting) onClose();
            }}
        >
            <section
                aria-labelledby="completion-title"
                aria-modal="true"
                className="w-full max-w-md rounded-lg border border-primary bg-neutral p-6 text-base-content shadow-2xl"
                role="dialog"
            >
                <h2 id="completion-title" className="font-jersey text-3xl text-primary">
                    {isEditing ? "Edit review" : "Complete recommendation"}
                </h2>
                <p className="mt-4 text-lg font-semibold">{itemName}</p>

                <fieldset className="mt-6">
                    <legend className="mb-2 text-sm font-semibold text-accent">
                        How did you find it?
                    </legend>
                    <StarRating rating={rating} onChange={setRating} />
                </fieldset>

                <div className="mt-6">
                    <label htmlFor="completion-review" className="mb-2 block text-sm font-semibold text-accent">
                        Review (optional)
                    </label>
                    <textarea
                        id="completion-review"
                        className="textarea textarea-bordered min-h-24 w-full border-primary bg-black/40 text-base-content"
                        maxLength={2000}
                        value={review}
                        onChange={(event) => setReview(event.target.value)}
                    />
                </div>

                {error && <p className="mt-3 text-sm text-error" role="alert">{error}</p>}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        className="btn btn-ghost text-accent"
                        disabled={submitting}
                        onClick={() => (isEditing ? onClose() : submitCompletion(null))}
                    >
                        {isEditing ? "Cancel" : "Skip rating"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={submitting}
                        onClick={() => submitCompletion(rating)}
                    >
                        {submitting
                        ? "Completing..." : isEditing ? "Save Changes" : "Complete"}
                    </button>
                </div>
            </section>
        </div>
    );
}
