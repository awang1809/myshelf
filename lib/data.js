import { typeLabel, subtypeLabel } from "./constants";

export function ratingColor(rating) {
    const stops = [
        [0,   0,   65, 50],
        [1,   0,   65, 50],
        [2,  10,   65, 50],
        [3,  20,   70, 50],
        [4,  40,   75, 50],
        [5,  55,   80, 50],
        [6,  85,   70, 48],
        [7, 130,   60, 40],
        [8, 150,   65, 32],
        [9, 220,   65, 48],
        [10,275,   65, 45],
    ];
    const r = Math.max(0, Math.min(10, rating));
    let lo = stops[0], hi = stops[stops.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
        if (r >= stops[i][0] && r <= stops[i + 1][0]) {
            lo = stops[i]; hi = stops[i + 1]; break;
        }
    }
    let t = 0;
    if (lo[0] !== hi[0]) {
        t = (r - lo[0]) / (hi[0] - lo[0]);
    }
    const h = lo[1] + t * (hi[1] - lo[1]);
    const s = lo[2] + t * (hi[2] - lo[2]);
    const l = lo[3] + t * (hi[3] - lo[3]);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function compressImage(dataUrl, maxSize, quality) {
    if (!maxSize) maxSize = 400;
    if (!quality) quality = 0.7;
    return new Promise(function(resolve) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            let w = img.width;
            let h = img.height;
            if (w > h) {
                if (w > maxSize) { h = h * (maxSize / w); w = maxSize; }
            } else {
                if (h > maxSize) { w = w * (maxSize / h); h = maxSize; }
            }
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = dataUrl;
    });
}

export function generateId() {
    return Date.now() + "-" + Math.random().toString(36).slice(2, 9);
}

export function getItemLabel(item) {
    if (item.subtype && subtypeLabel[item.subtype]) {
        return subtypeLabel[item.subtype];
    }
    return typeLabel[item.type];
}

export function formatRating(rating) {
    return rating.toFixed(1);
}

export function migrateItemsArray(items) {
    let changed = false;
    for (let i = 0; i < items.length; i++) {
        if (!items[i].id) {
            items[i].id = generateId();
            changed = true;
        }
        if (items[i].type === "music" && !items[i].subtype) {
            items[i].subtype = "album";
            changed = true;
        }
        if (items[i].type === "tv" && !items[i].subtype) {
            items[i].subtype = "series";
            changed = true;
        }
        if (!items[i].children) {
            items[i].children = [];
            changed = true;
        }
        if (!items[i].parentId) {
            items[i].parentId = null;
            changed = true;
        }
    }
    return { items, changed };
}
