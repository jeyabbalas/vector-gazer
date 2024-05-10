/**
 * Parses a JSON file and returns the data.
 * @param {File} file - The file object.
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
 * Validates that the JSON data follows the following expected structure.
 * 1. The JSON data should be an object with "data" key. It's value should be an array of objects.
 *     1.1. Each object should have a "text" key with a string value.
 *     1.2. Each object can have an optional "embedding" key with an array of floats value. If the JSON data contains
 *          embeddings, then every object should have an "embedding" key.
 *     1.3. Each object can have an optional "label" key with a string value. If the JSON data contains labels, then
 *          every object should have a "label" key.
 * 2. If the JSON data contains embeddings, then the parent object should contain "embeddingMethod" key with a string
 *    value. This is in addition to the "data" key.
 * @param {Object} jsonData - The JSON data to validate.
 * @param {HTMLElement} container - The container element to display validation errors.
 * @throws {Error} - If validation fails.
 */
const validateJsonData = (jsonData, container) => {
    if (typeof jsonData !== 'object' || jsonData === null) {
        displayError('JSON data should be an object.', container);
        throw new Error('JSON data should be an object.');
    }

    if (!jsonData.hasOwnProperty('data') || !Array.isArray(jsonData.data)) {
        displayError('JSON object must contain a "data" key with an array value.', container);
        throw new Error('JSON object must contain a "data" key with an array value.');
    }

    const dataArray = jsonData.data;
    let labelRequired = false;
    let embeddingRequired = false;
    let embeddingLength = null;

    dataArray.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) {
            displayError(`Item at index ${index} is not an object.`, container);
            throw new Error(`Item at index ${index} is not an object.`);
        }

        if (!item.hasOwnProperty('text') || typeof item.text !== 'string') {
            displayError(`Item at index ${index} is missing a "text" key or "text" is not a string.`, container);
            throw new Error(`Item at index ${index} is missing a "text" key or "text" is not a string.`);
        }

        if (item.hasOwnProperty('embedding')) {
            if (!Array.isArray(item.embedding) || item.embedding.some(value => typeof value !== 'number')) {
                displayError(`Item at index ${index} has an "embedding" key that is not an array of numbers.`, container);
                throw new Error(`Item at index ${index} has an "embedding" key that is not an array of numbers.`);
            }

            if (embeddingLength === null) {
                embeddingLength = item.embedding.length;
            } else if (embeddingLength !== item.embedding.length) {
                displayError(`Item at index ${index} has an "embedding" key with a different length than previous embeddings.`, container);
                throw new Error(`Item at index ${index} has an "embedding" key with a different length than previous embeddings.`);
            }

            if (!embeddingRequired) {
                embeddingRequired = true;
            }
        }

        if (item.hasOwnProperty('label')) {
            if (typeof item.label !== 'string') {
                displayError(`Item at index ${index} has a "label" key that is not a string.`, container);
                throw new Error(`Item at index ${index} has a "label" key that is not a string.`);
            }

            if (!labelRequired) {
                labelRequired = true;
            }
        }
    });

    if (labelRequired) {
        dataArray.forEach((item, index) => {
            if (!item.hasOwnProperty('label')) {
                displayError(`Item at index ${index} is missing a "label" key, which is required since another object contains "label".`, container)
                throw new Error(`Item at index ${index} is missing a "label" key, which is required since another object contains "label".`);
            }
        });
    }

    if (embeddingRequired) {
        dataArray.forEach((item, index) => {
            if (!item.hasOwnProperty('embedding')) {
                displayError(`Item at index ${index} is missing an "embedding" key, which is required since another object contains "embedding".`, container);
                throw new Error(`Item at index ${index} is missing an "embedding" key, which is required since another object contains "embedding".`);
            }
        });

        if (!jsonData.hasOwnProperty('embeddingMethod') || typeof jsonData.embeddingMethod !== 'string') {
            displayError('JSON object must contain an "embeddingMethod" key with a string value when "embedding" is present.', container);
            throw new Error('JSON object must contain an "embeddingMethod" key with a string value when "embedding" is present.');
        }
    }
};


/**
 * Displays an error message in the specified container.
 * @param {string} message - The error message to display.
 * @param {HTMLElement} container - The container element to display the message in.
 */
const displayError = (message, container) => {
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('bg-red-50', 'border', 'border-red-300', 'text-red-800', 'px-2', 'py-1', 'rounded', 'relative', 'text-sm', 'mt-2');
    errorMessage.innerHTML = `<strong class="font-bold">Error:</strong> ${message}`;
    container.appendChild(errorMessage);
}


const jsonDataContainsEmbeddings = (jsonData) => {
    return jsonData.data[0].hasOwnProperty('embedding');
}


export {
    parseJsonFile,
    fetchJsonData,
    validateJsonData,
    jsonDataContainsEmbeddings
};