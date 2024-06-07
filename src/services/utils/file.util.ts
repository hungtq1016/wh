//convert url or file to base64 string and return it with callback function

export const toBase64Async = (file: Blob | string, callback?: (base64: string) => void) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file as Blob);
        reader.onload = () => resolve(reader.result as string);
        reader.onloadend = () => {
            if (callback) {
                callback(reader.result as string);
            }
        };
        reader.onerror = (error) => reject(error);
    });
    


//convert url image to base64 string and return '' if it is not an image
export const toBase64Image = async (url: string | URL | Request) => {

    const res = await fetch(url);
    const buff = await res.blob();

    return buff.type.startsWith('image/') ? await toBase64Async(buff) : '';

}