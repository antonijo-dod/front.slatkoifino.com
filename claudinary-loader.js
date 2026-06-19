// claudinary-loader.js
export default function cloudinaryLoader({ src, width, quality }) {
  // Keep local/static assets unchanged.
  if (src.startsWith("/")) return src;

  const marker = "/image/upload/";
  const idx = src.indexOf(marker);
  if (idx === -1) return src;

  const q = typeof quality === "number" ? `q_${quality}` : "q_auto";
  const transform = `w_${width},${q},f_auto`;

  const before = src.slice(0, idx + marker.length);
  const after = src.slice(idx + marker.length);
  const slash = after.indexOf("/");
  if (slash === -1) return `${before}${transform}/${after}`;

  const firstSegment = after.slice(0, slash);
  const rest = after.slice(slash + 1);

  // If the URL already has a Cloudinary transformation segment (commas are typical there),
  // replace it instead of chaining transformations (which could cause unwanted upscaling).
  const hasExistingTransform = firstSegment.includes(",");
  return hasExistingTransform
    ? `${before}${transform}/${rest}`
    : `${before}${transform}/${after}`;
}