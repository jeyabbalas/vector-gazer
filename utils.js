/**
 * Parses a JSON file and returns the data.
 * @param file - The file object.
 * @returns {Promise<Object>} - Parsed JSON data.
 */
const parseJsonFile = async (file) => {
    const fileText = await file.text();
    return JSON.parse(fileText);
};


/**
 * Fetches JSON data from a URL.
 * @param {string} url - The URL to fetch JSON data from.
 * @returns {Promise<Object>} - Fetched JSON data.
 */
const fetchJsonData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
};


/**
 * Validates that the JSON data is an array of objects meeting specific criteria.
 * @param {Object[]} jsonData - The JSON data to validate.
 * @throws {Error} - If validation fails.
 */
const validateJsonData = (jsonData) => {
    if (!Array.isArray(jsonData)) {
        throw new Error('The Input JSON data should be an array.');
    }

    jsonData.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) {
            throw new Error(`Item at index ${index} is not an object.`);
        }

        if (!item.hasOwnProperty('text') || typeof item.text !== 'string') {
            throw new Error(`Item at index ${index} is missing a 'text' key or 'text' is not a string.`);
        }

        if (item.hasOwnProperty('embedding') && !Array.isArray(item.embedding)) {
            throw new Error(`Item at index ${index} has an 'embedding' key, but it is not an array.`);
        }

        if (item.hasOwnProperty('label') && typeof item.label !== 'string') {
            throw new Error(`Item at index ${index} has a 'label' key, but it is not a string.`);
        }
    });
};


export {
    parseJsonFile,
    fetchJsonData,
    validateJsonData
};