const embeddableCache = new Map();

function normalizeYoutubeId(youtubeId) {
    return String(youtubeId || "").trim();
}

export function isValidYouTubeIdFormat(youtubeId) {
    const normalized = normalizeYoutubeId(youtubeId);
    return /^[A-Za-z0-9_-]{11}$/.test(normalized);
}

export async function isYouTubeEmbeddable(youtubeId) {
    const normalized = normalizeYoutubeId(youtubeId);

if (!normalized) {
    return false;
}

if (embeddableCache.has(normalized)) {
    return embeddableCache.get(normalized);
}

if (!isValidYouTubeIdFormat(normalized)) {
    embeddableCache.set(normalized, false);
    return false;
}

const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(normalized)}&format=json`;

try {
    const response = await fetch(oembedUrl, { method: "GET" });
    const isEmbeddable = response.ok;
    embeddableCache.set(normalized, isEmbeddable);
    return isEmbeddable;
} catch {
    embeddableCache.set(normalized, false);
return false;
    }
}
