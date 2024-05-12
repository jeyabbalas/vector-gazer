class Data {
    constructor(data, fileName) {
        this.data = data;
        this.fileName = fileName;
    }

    static async instantiateFromFileUpload(file, messageContainer) {
        try {
            const data = await Data.parseJsonFile(file);
            Data.validateJsonData(data, messageContainer);
            Data.displaySuccess('Data loaded.', messageContainer)
            return new Data(data, file.name);
        } catch (error) {
            Data.displayError('Error parsing JSON file or validation failed.', messageContainer)
            console.error('Error parsing JSON file or validation failed:', error);
        }
    }

    static async instantiateFromUrl(url, messageContainer) {
        try {
            const data = await Data.fetchJsonData(url);
            Data.validateJsonData(data, messageContainer);
            Data.displaySuccess('Data loaded.', messageContainer);
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            return new Data(data, fileName);
        } catch (error) {
            Data.displayError('Error fetching JSON data from URL or validation failed.', messageContainer);
            console.error('Error fetching JSON data from URL or validation failed:', error);
        }
    }

    containsEmbeddings() {
        return this.data.data[0].hasOwnProperty('embedding')
    }

    containsLabels() {
        return this.data.data[0].hasOwnProperty('label')
    }

    getEmbeddingMethod() {
        return this.data.embeddingMethod;
    }

    getEmbeddingDimension() {
        return this.data.data[0].embedding.length;
    }

    /**
     * Parses a JSON file and returns the data.
     * @param {File} file - The file object.
     * @returns {Promise<Object>} - Parsed JSON data.
     */
    static async parseJsonFile(file) {
        const fileText = await file.text();
        return JSON.parse(fileText);
    }

    /**
     * Fetches JSON data from a URL.
     * @param {string} url - The URL to fetch JSON data from.
     * @returns {Promise<Object>} - Fetched JSON data.
     */
    static async fetchJsonData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.json();
    }

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
     * @param {Object} data - The JSON data to validate.
     * @param {HTMLElement} container - The container element to display validation errors.
     * @throws {Error} - If validation fails.
     */
    static validateJsonData(data, container) {
        if (typeof data !== 'object' || data === null) {
            Data.displayError('JSON data should be an object.', container);
            throw new Error('JSON data should be an object.');
        }

        if (!data.hasOwnProperty('data') || !Array.isArray(data.data)) {
            Data.displayError('JSON object must contain a "data" key with an array value.', container);
            throw new Error('JSON object must contain a "data" key with an array value.');
        }

        const dataArray = data.data;
        let labelRequired = false;
        let embeddingRequired = false;
        let embeddingLength = null;

        dataArray.forEach((item, index) => {
            if (typeof item !== 'object' || item === null) {
                Data.displayError(`Item at index ${index} is not an object.`, container);
                throw new Error(`Item at index ${index} is not an object.`);
            }

            if (!item.hasOwnProperty('text') || typeof item.text !== 'string') {
                Data.displayError(`Item at index ${index} is missing a "text" key or "text" is not a string.`, container);
                throw new Error(`Item at index ${index} is missing a "text" key or "text" is not a string.`);
            }

            if (item.hasOwnProperty('embedding')) {
                if (!Array.isArray(item.embedding) || item.embedding.some(value => typeof value !== 'number')) {
                    Data.displayError(`Item at index ${index} has an "embedding" key that is not an array of numbers.`, container);
                    throw new Error(`Item at index ${index} has an "embedding" key that is not an array of numbers.`);
                }

                if (embeddingLength === null) {
                    embeddingLength = item.embedding.length;
                } else if (embeddingLength !== item.embedding.length) {
                    Data.displayError(`Item at index ${index} has an "embedding" key with a different length than previous embeddings.`, container);
                    throw new Error(`Item at index ${index} has an "embedding" key with a different length than previous embeddings.`);
                }

                if (!embeddingRequired) {
                    embeddingRequired = true;
                }
            }

            if (item.hasOwnProperty('label')) {
                if (typeof item.label !== 'string') {
                    Data.displayError(`Item at index ${index} has a "label" key that is not a string.`, container);
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
                    Data.displayError(`Item at index ${index} is missing a "label" key, which is required since another object contains "label".`, container)
                    throw new Error(`Item at index ${index} is missing a "label" key, which is required since another object contains "label".`);
                }
            });
        }

        if (embeddingRequired) {
            dataArray.forEach((item, index) => {
                if (!item.hasOwnProperty('embedding')) {
                    Data.displayError(`Item at index ${index} is missing an "embedding" key, which is required since another object contains "embedding".`, container);
                    throw new Error(`Item at index ${index} is missing an "embedding" key, which is required since another object contains "embedding".`);
                }
            });

            if (!data.hasOwnProperty('embeddingMethod') || typeof data.embeddingMethod !== 'string') {
                Data.displayError('JSON object must contain an "embeddingMethod" key with a string value when "embedding" is present.', container);
                throw new Error('JSON object must contain an "embeddingMethod" key with a string value when "embedding" is present.');
            }
        }
    };


    /**
     * Displays an error message in the specified container.
     * @param {string} message - The error message to display.
     * @param {HTMLElement} container - The container element to display the message in.
     */
    static displayError(message, container) {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('bg-red-50', 'border', 'border-red-300', 'text-red-800', 'px-2', 'py-1', 'rounded', 'relative', 'text-sm', 'mt-2');
        errorMessage.innerHTML = `<strong class="font-bold">Error:</strong> ${message}`;
        container.appendChild(errorMessage);
    }

    /**
     * Displays a success message in the specified container.
     * @param {string} message - The success message to display.
     * @param {HTMLElement} container - The container element to display the message in.
     */
    static displaySuccess(message, container) {
        const successMessage = document.createElement('div');
        successMessage.classList.add('bg-green-50', 'border', 'border-green-300', 'text-green-800', 'px-2', 'py-1', 'rounded', 'relative', 'text-sm', 'mt-2');
        successMessage.innerHTML = `<strong class="font-bold">Success:</strong> ${message}`;
        container.appendChild(successMessage);
    }

}


export {
    Data
};