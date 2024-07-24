export const isValidMetadata = (expectedKeys: string[], parsedMetadata: any): boolean => {
    // Check if parsedMetadata is an object and not null
    if (typeof parsedMetadata !== "object" || parsedMetadata === null) {
        return false;
    }

    // Check if parsedMetadata contains all expected keys
    const hasExpectedKeys = expectedKeys.every(key => key in parsedMetadata);

    // Check if parsedMetadata contains any additional keys
    const hasAdditionalKeys = Object.keys(parsedMetadata).length > expectedKeys.length;
    return hasExpectedKeys && !hasAdditionalKeys;
};