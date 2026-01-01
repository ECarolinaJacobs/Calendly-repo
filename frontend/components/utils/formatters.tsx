export const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
}

export const formatDateTime = (date: string | Date | undefined): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
}

export const renderStars = (rating: number): string => {
    const clampedRating = Math.max(0, Math.min(5, rating));
    const filledStars = "★".repeat(clampedRating);
    const emptyStars = "☆".repeat(5 - clampedRating);
    return filledStars + emptyStars;
};

export function formatEventDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
}
export function formatEventTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}
