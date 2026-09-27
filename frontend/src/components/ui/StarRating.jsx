import { useState } from "react";

export default function StarRating({ rating, onChange }) {
    const [hoverRating, setHoverRating] = useState(null);
    const visibleRating = hoverRating ?? rating;

    return (
        <div
            className="flex gap-1"
            onMouseLeave={() => setHoverRating(null)}
            role="group"
            aria-label="Choose a rating from 1 to 5 stars"
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} out of 5 stars`}
                    aria-pressed={rating === star}
                    className="min-h-11 min-w-11 text-3xl leading-none text-accent transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                >
                    {visibleRating >= star ? "★" : "☆"}
                </button>
            ))}
        </div>
    );
}