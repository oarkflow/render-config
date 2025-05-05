export default function timeInFuture(date: string) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return "Invalid date";
    }

    const seconds = Math.floor((parsedDate.getTime() - Date.now()) / 1000);
    if (seconds <= 0) {
        return "now";
    }

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        return interval + " year" + (interval === 1 ? "" : "s") + " remaining";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " month" + (interval === 1 ? "" : "s") + " remaining";
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " day" + (interval === 1 ? "" : "s") + " remaining";
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " hour" + (interval === 1 ? "" : "s") + " remaining";
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " minute" + (interval === 1 ? "" : "s") + " remaining";
    }

    return "just now";
}
