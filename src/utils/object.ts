export function serializeObject(obj: any): string {
    const isValidIdentifier = (key: string): boolean => /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(key);

    const serialize = (value: any): string => {
        if (Array.isArray(value)) {
            return `[${value.map(serialize).join(", ")}]`;
        } else if (typeof value === 'object' && value !== null) {
            const entries = Object.entries(value).map(([key, val]) => {
                const serializedKey = isValidIdentifier(key) ? key : `'${key}'`;
                return `${serializedKey}: ${serialize(val)}`;
            });
            return `{${entries.join(", ")}}`;
        } else if (typeof value === 'string') {
            return `'${value.replace(/'/g, '\\\'')}'`;
        } else {
            return String(value);
        }
    };

    return serialize(obj);
}