 export function cloudinaryUrl(url: string, width = 800) {
    return url.replace(
      "/image/upload/",
      `/image/upload/w_${width},f_auto,q_auto/`,
    );
  }