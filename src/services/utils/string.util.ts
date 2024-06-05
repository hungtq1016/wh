export const Base64UrlEncode = (value: string) => {
    return Buffer.from(value).toString('base64url').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const isFieldValid = (field: string) => {
    // Check if the field is not undefined, null, or empty 
    return field !== undefined && field !== null && field !== '' ;
}

export const pushFieldToFields = (fields: { [key: string]: string }) => {
    // Check if all the fields are valid
    const array: { field: string, message: string }[] = []

    Object.values(fields).forEach((field) => {
        if (!isFieldValid(field)) array.push({
            field: field,
            message: `${field} is required`
        })
    })

    return array;
}

export const slugify = (value: string) => {
    return value
        .toLowerCase() 
        .trim() 
        .replace(/[^a-z0-9 -]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/-+/g, '-'); 
}

export const convertBigIntToString = (obj: any): any => {
    if (typeof obj === 'bigint') {
        return obj.toString();
    } else if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToString(item));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)])
        );
    } else {
        return obj;
    }
};