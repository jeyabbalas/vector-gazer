import './style.css';
import vectorGazerLogo from '/vector-gazer.svg';
import githubLogo from '/github.svg';

import { manageOpenAIApiKey, Embedding } from "./embedding.js";


function ui(divID) {
    let divUI = divID ? document.getElementById(divID) : document.createElement('div');

    // <h1 class="text-3xl font-bold underline"> Hello world! </h1>
    divUI.innerHTML = `
<!-- Header -->
<div id="header" class="mx-auto max-w-full px-2 py-0 bg-black h-1/10 relative z-10"> <div class="flex items-center justify-between">
        <div class="flex justify-start gap-2 pl-24">
            <div class="flex items-center">
                <img src="${vectorGazerLogo}" class="h-32 w-32 -mb-10 logo vanilla" alt="vector gazer logo" />
            </div>
            <div class="min-w-0 flex-1 flex items-center">
                <h1 class="text-3xl font-bold leading-7 text-white">Vector Gazer</h1>
            </div>
        </div>
        
        <div class="flex md:mt-0 md:ml-4 shrink-0 pr-24">
            <a title="Source code" href="https://github.com/jeyabbalas/vector-gazer">
                <img src="${githubLogo}" class="h-14 w-14 fill-current" alt="github logo" />
            </a>
        </div>
    </div>
</div>

<hr class="border-t-2 border-white mx-auto max-w-full" />

<div class="flex mx-auto max-w-full h-9/10" style="height: calc(100vh - 75px);">
    <!-- Left panel: data, embedding API, embedding model, and projection method -->
    <div class="w-3/12 bg-black p-4 mt-5 flex flex-col h-full">
        <!-- Data upload -->
        <div id="data-panel" class="relative py-2" title="The file should be a JSON array of objects. Each object must contain the 'text' key with a string value representing the text for embedding. Optionally, include: 1) 'embedding': An array of floats for pre-computed embeddings, and 2) 'label': A brief text description for the scatter plot entry.">
            <h2 class="absolute transform left-4 -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Data</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6">
                <!-- File upload -->
                <div class="relative rounded-md rounded-b-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="data-upload" class="block font-medium text-sm text-white">File upload</label>
                    <input type="file" id="data-upload" name="data-upload" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" accept=".json" required>
                </div>
                <!-- or -->
                <div class="relative w-full my-1">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-400"></div>
                    </div>
                    <div class="relative flex justify-center">
                        <span class="bg-black px-2 text-gray-400">or</span>
                    </div>
                </div>
                <!-- URL input -->
                <div class="relative rounded-md rounded-t-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="data-url" class="block font-medium text-sm text-white">URL</label>
                    <input type="url" id="data-url" name="data-url" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" placeholder="Enter URL" required>
                </div>
                <!-- reset and submit buttons -->
                <div class="py-1 mt-1">
                    <div class="flex justify-center gap-2">
                        <button id="reset-data" class="rounded-md border border-white bg-red-800 text-sm text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-white">Reset</button>
                        <button id="submit-data" class="rounded-md border border-white bg-gray-800 text-sm text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white">Submit</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Embeddings API configuration -->
        <div id="config-panel" class="relative py-2">
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Embeddings API</h2>
        
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6">
                <div class="relative rounded-md rounded-b-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="base-url" class="block font-medium text-sm text-white">Base URL</label>
                    <input type="url" id="base-url" name="base-url" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" placeholder="https://api.openai.com/v1" value="https://api.openai.com/v1" required>
                </div>
        
                <div class="relative rounded-md rounded-t-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="api-key" class="block font-medium text-sm text-white">API key</label>
                    <input type="password" id="api-key" name="api-key" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" required>
                </div>
        
                <div id="api-key-message-container"></div>
        
                <div id="submit-api-key-buttons" class="py-1 mt-1">
                    <div class="flex justify-center gap-2">
                        <button id="forget-api-key" class="rounded-md border border-white bg-red-800 text-sm text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-white">Forget API key</button>
                        <button id="submit-api-key" class="rounded-md border border-white bg-gray-800 text-sm text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white">Submit</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Embeddings model selection -->
        <div id="model-panel" class="relative py-2"> 
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Embedding model</h2>
            
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6"> 
                <div class="relative rounded-md rounded-b-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="model" class="block font-medium text-sm text-white">Model</label>
                    <select id="model" name="model" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" required>
                        <option value="" disabled selected>Set URL/API to view models</option>
                    </select>
                </div>
                <!-- Slider titled "Dimension". By default, it is disabled and takes range 0 to 0. It also displays the current value to the right of the slider. -->
                <div class="relative rounded-md rounded-t-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="dimension" class="block font-medium text-sm text-white">Dimension</label>
                    <output for="dimension" class="block text-sm text-white text-center">0</output>
                    <input type="range" id="dimension" name="dimension" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" min="0" max="0" value="0" disabled>
                </div>
            </div>
        </div>
    </div>

    <!-- Vertical line between left panel and scatter plot -->
    <div class="w-px bg-white h-screen"></div>

    <!-- Scatter plot -->
    <div id="scatter-plot" class="w-2/3 p-4 bg-black flex flex-col h-full">
    </div>

    <!-- Vertical line between scatter plot and right Panel -->
    <div class="w-px bg-white h-screen"></div>

    <!-- Right panel: projection method and query -->
    <div class="w-3/12 bg-black p-4 mt-5 flex flex-col h-full">
        <!-- Projection method selection -->
        <div id="projection-panel" class="relative py-2"> 
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Projection method</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6"> 
            </div>
        </div>
        
        <!-- Query -->
        <div id="query-panel" class="relative py-2"> 
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Query</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6"> 
            </div>
        </div>
    </div>
</div>
`;
}


ui('app');

// Load data
const dataUpload = document.getElementById('data-upload');
const dataUrl = document.getElementById('data-url');
const submitDataBtn = document.getElementById('submit-data');
const resetDataBtn = document.getElementById('reset-data');

let jsonData;

const parseJsonFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
};


const fetchJsonData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
};


const updateAppUrl = (url) => {
    const newUrl = `${window.location.origin}${window.location.pathname}?dataUrl=${encodeURIComponent(url)}`;
    window.history.replaceState(null, '', newUrl);
};


// Data submit
submitDataBtn.addEventListener('click', async () => {
    if (dataUpload.files.length > 0) {
        try {
            jsonData = await parseJsonFile(dataUpload.files[0]);
            console.log('JSON data from file:', jsonData);
        } catch (error) {
            console.error('Error parsing JSON file:', error);
        }
    } else if (dataUrl.value) {
        try {
            updateAppUrl(dataUrl.value);
            jsonData = await fetchJsonData(dataUrl.value);
            console.log('JSON data from URL:', jsonData);
        } catch (error) {
            console.error('Error fetching JSON data from URL:', error);
        }
    }
});


// Data reset
resetDataBtn.addEventListener('click', () => {
    dataUpload.value = '';
    dataUrl.value = '';
    jsonData = null;
    window.history.replaceState(null, '', window.location.origin + window.location.pathname);
});


window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataUrlParam = urlParams.get('dataUrl');
    if (dataUrlParam) {
        try {
            dataUrl.value = dataUrlParam;
            jsonData = await fetchJsonData(dataUrlParam);
            console.log('JSON data from URL parameter:', jsonData);
        } catch (error) {
            console.error('Error fetching JSON data from URL parameter:', error);
        }
    }
});


// Check embedding model configuration
let embedding;

const baseURLInput = document.getElementById('base-url');
const apiKeyInput = document.getElementById('api-key');
const forgetApiKeyBtn = document.getElementById('forget-api-key');
const submitApiKeyBtn = document.getElementById('submit-api-key');
const modelsListDropdown = document.getElementById('model');
const apiKeyMessageContainer = document.getElementById('api-key-message-container');


function displayDefaultModelsList() {
    modelsListDropdown.innerHTML = '<option value="" disabled selected>Set URL/API to view models</option>';
}

forgetApiKeyBtn.addEventListener('click', () => {
    apiKeyInput.value = '';
    while (apiKeyMessageContainer.firstChild) {
        apiKeyMessageContainer.removeChild(apiKeyMessageContainer.firstChild);
    }
    displayDefaultModelsList()
    manageOpenAIApiKey.deleteKey();
});


submitApiKeyBtn.addEventListener('click', async () => {
    const baseURL = baseURLInput.value;
    const apiKey = apiKeyInput.value;
    const isValid = await manageOpenAIApiKey.validateOpenAIApiKey(baseURL, apiKey);

    while (apiKeyMessageContainer.firstChild) {
        apiKeyMessageContainer.removeChild(apiKeyMessageContainer.firstChild);
    }

    if (isValid) {  // API key is valid
        // Save the API key
        manageOpenAIApiKey.setKey(apiKey);

        // Populate models list
        embedding = await Embedding.instantiate(baseURL, apiKey);
        const modelsList = embedding.getModelsList();
        modelsListDropdown.innerHTML = '';
        modelsListDropdown.disabled = false;
        modelsList.forEach((model, index) => {
            const option = document.createElement('option');
            option.value = model;
            option.text = model;
            modelsListDropdown.appendChild(option);

            // Default to first model
            if (index === 0) {
                modelsListDropdown.value = model;
                embedding.setModel(model);
            }
        });

        // Display success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('bg-green-50', 'border', 'border-green-300', 'text-green-800', 'px-2', 'py-1', 'rounded', 'relative', 'text-sm', 'mt-2');
        successMessage.innerHTML = '<strong class="font-bold">Success!</strong> API key is valid.';
        apiKeyMessageContainer.appendChild(successMessage);
    } else {  // API key is invalid
        // Display default models list
        displayDefaultModelsList();

        // Display error message
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('bg-red-50', 'border', 'border-red-300', 'text-red-800', 'px-2', 'py-1', 'rounded', 'relative', 'text-sm', 'mt-2');
        errorMessage.innerHTML = '<strong class="font-bold">Error:</strong> Invalid API key.';
        apiKeyMessageContainer.appendChild(errorMessage);
    }
});

(async () => {
    const apiKey = manageOpenAIApiKey.getKey();
    if (apiKey) {
        apiKeyInput.value = apiKey;
        await submitApiKeyBtn.click();
    }
})();