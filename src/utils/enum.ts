export function enumToString(enumObject: any, type: number, fallback?: string): string {
    const typeName = enumObject[type];
    if (!typeName) {
        if (fallback) {
            return fallback;
        }

        throw new Error('Unknown type')
    }

    return typeName;
}

export function assertEnumValue(enumObject: any, value: any, error?: Error): void {
    if (enumObject[value] === undefined) {
        throw error ?? new Error('Unknown type');
    }
}