/**
 * Function for getting values from the local storage.
 * 
 * @param key local storage key
 * @param defaultValue default value if the key is not found
 * @returns the retrieved value or the default value
 */
export const getLocalStorage = <V>(key: string, defaultValue?: string | V): V => {

    if (typeof defaultValue === "string") {

        return JSON.parse(localStorage.getItem(key) ?? defaultValue);

    }

    return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue));

};

/**
 * Function for setting values in the local storage.
 * 
 * @param key local storage key
 * @param value obvious
 */
export const setLocalStorage = <V>(key: string, value: V): void => {

    localStorage.setItem(key, JSON.stringify(value));

};
