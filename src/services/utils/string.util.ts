export const Base64UrlEncode = (value: string) => {
    return Buffer.from(value).toString('base64url').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export const isFieldValid = (field: string) => {
    // Check if the field is not undefined, null, or empty 
    return field !== undefined && field !== null && field !== '' && field.trim().length > 0;
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