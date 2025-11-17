export function clearNonSupabaseStorage() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      // Preserve Supabase auth/session keys (sb- prefix)
      if (key.startsWith("sb-")) continue;
      keysToRemove.push(key);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // Ignore storage errors
  }
}
