export type ClerkError = {
    clerkError: boolean;
    errors: {
        code: string;
        message: string;
    }[];
};

export function isClerkError(x: unknown): x is ClerkError {
    return Boolean(
        typeof x === "object" &&
            x &&
            "clerkError" in x &&
            typeof x.clerkError === "boolean"
    );
}
