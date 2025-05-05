export const setCache = (key: string, value: unknown, ttl: number) => {
  const expiration = Date.now() + ttl * 1000;
  const cacheEntry = { value, expiration };
  localStorage.setItem(key, JSON.stringify(cacheEntry));
};

export const getCache = (key: string): unknown => {
  const cacheEntry = localStorage.getItem(key);
  if (!cacheEntry) return null;

  const { value, expiration } = JSON.parse(cacheEntry);
  if (Date.now() > expiration) {
    localStorage.removeItem(key);
    return null;
  }
  return value;
};

export const generateCacheKey = (
  url: string,
  method: string,
  body?: unknown
) => {
  return `cookie:${method}:${url}:${body ? JSON.stringify(body) : ""}`;
};

export const removeCache = () => {
    console.log("Removing cache");
    const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith("cookie:"));
  
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
};
