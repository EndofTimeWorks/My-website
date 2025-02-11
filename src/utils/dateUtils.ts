export function calculatePreciseAge(birthDate: Date): number {
    const today = new Date();
    const diffTime = today.getTime() - birthDate.getTime();
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Number(diffYears.toFixed(8));
}