import { useState } from "react";
interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (content: string, rating: number) => Promise<boolean | void>;
}

interface ReviewFormData {
    content: string;
    rating: number;
}
/**
 * modal component for submitting event reviews
 */
export function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
    const [review, setReview] = useState<ReviewFormData>({ content: "", rating: 5 });
    if (!isOpen) return null;
    const handleSubmit = async () => {
        const success = await onSubmit(review.content, review.rating);
        if (success) {
            setReview({ content: "", rating: 5 });
            onClose();
        }
    };
    const handleClose = () => {
        setReview({ content: "", rating: 5 });
        onClose();
    };
    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Add your review</h3>
                <textarea
                    value={review.content}
                    onChange={(e) => setReview({ ...review, content: e.target.value })}
                    placeholder="Share your thoughts on this event..."
                    rows={5}
                />
                <div className="rating-selector">
                    <label>Rating:</label>
                    <select
                        value={review.rating}
                        onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num} ⭐
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-buttons">
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit Review
                    </button>
                    <button className="cancel-button" onClick={handleClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div >
    );

}
