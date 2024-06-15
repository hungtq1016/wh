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
    return String(value)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
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