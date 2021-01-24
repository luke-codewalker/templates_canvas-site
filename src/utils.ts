export const uuid = (digits = 8) => {
    if (digits > 16) {
        throw new Error(`uuid: Requested digit count of ${digits} was too high. A maximum of 16 digits are supported.`);
    }

    return Math.random().toString().split('.')[1].slice(-digits);
};


export const random = (start = 0, end = 1) => start + Math.floor(Math.random() * (end - start));