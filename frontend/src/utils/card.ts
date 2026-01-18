export function initials(name: string) {
    const names = name.trim().split(/\s+/).slice(0, 2);
    return names.map(n => n[0].toUpperCase()).join('');
}