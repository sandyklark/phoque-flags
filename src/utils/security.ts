// Basic obfuscation utilities for client-side data protection
// Note: This is security through obscurity and can be bypassed by determined users

export const obfuscate = (data: string): string => {
  // Simple base64 encoding with some character substitution
  const base64 = btoa(data);
  return base64
    .split('')
    .map(char => String.fromCharCode(char.charCodeAt(0) + 3))
    .join('');
};

export const deobfuscate = (obfuscated: string): string => {
  try {
    const base64 = obfuscated
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0) - 3))
      .join('');
    return atob(base64);
  } catch {
    return '';
  }
};

export const obfuscateFlag = (flag: any) => {
  return {
    ...flag,
    name: obfuscate(flag.name),
    _obfuscated: true
  };
};

export const deobfuscateFlag = (flag: any) => {
  if (!flag._obfuscated) return flag;
  
  return {
    ...flag,
    name: deobfuscate(flag.name),
    _obfuscated: false
  };
};