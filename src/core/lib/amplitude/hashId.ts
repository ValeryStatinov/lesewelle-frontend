export const hashId = async (id: string): Promise<string> => {
  if (!id) return '';

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(id);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.warn('Hashing failed, using fallback:', error);

    return 'hash-unavailable';
  }
};
