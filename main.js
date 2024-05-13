import 'https://cdn.plot.ly/plotly-2.32.0.min.js';

import './style.css';
import vectorGazerLogo from '/vector-gazer.svg';
import githubLogo from '/github.svg';

import {Data} from './data.js';
import {Embedding, manageOpenAIApiKey} from "./embedding.js";
import {Projector} from "./projector.js";


function ui(divID) {
    let divUI = divID ? document.getElementById(divID) : document.createElement('div');

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
        <div id="data-panel" class="relative py-2" title="Expected JSON format:
{
    'data': [
        {
            'text': ' (Required) A string representing the text to be embedded',
            'label': '(Optional) A concise string representing the text, to be displayed in the scatter plot for the text item',
            'embedding': [(Optional) An array of floats embedding, if pre-computed]
        }
    ],
    'embeddingMethod': '(Optional) A string describing the embedding method in the API. Required if embeddings are included in data.'
}">
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
                    <label for="data-url" class="block font-medium text-sm text-white">File URL</label>
                    <input type="url" id="data-url" name="data-url" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" placeholder="Enter URL" required>
                </div>
                
                <!-- error message container -->
                <div id="data-error-message-container"></div>
                
                <!-- reset and submit buttons -->
                <div class="py-1 mt-1">
                    <div class="flex justify-center gap-2">
                        <button id="reset-data" class="rounded-md border border-white bg-red-800 text-sm text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-white">Reset</button>
                        <button id="submit-data" class="rounded-md border border-white bg-gray-800 text-sm text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white">Load</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Embeddings API configuration -->
        <div id="config-panel" class="relative py-2">
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Embeddings API</h2>
        
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6">
                <div class="relative rounded-md rounded-b-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="embed-base-url" class="block font-medium text-sm text-white">Base URL</label>
                    <input type="url" id="embed-base-url" name="embed-base-url" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" placeholder="https://api.openai.com/v1" value="https://api.openai.com/v1" required>
                </div>
        
                <div class="relative rounded-md rounded-t-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="embed-api-key" class="block font-medium text-sm text-white">API key</label>
                    <input type="password" id="embed-api-key" name="embed-api-key" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" required>
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
                    <label for="embed-model" class="block font-medium text-sm text-white">Model</label>
                    <select id="embed-model" name="embed-model" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" required>
                        <option value="" disabled selected>Set URL/API to view models</option>
                    </select>
                </div>
                
                <div class="relative rounded-md rounded-t-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="embed-dimension" class="block font-medium text-sm text-white">Dimension: <span id="embed-dimension-output" class="text-white">0</span></label>
                    <input type="range" id="embed-dimension" name="embed-dimension" class="w-full h-2 rounded-lg cursor-pointer" min="0" max="0" value="0" disabled>
                </div>
                
                <div class="py-1 mt-1">
                    <div class="flex justify-center gap-2">
                        <button id="submit-embed-model" class="rounded-md border border-white bg-gray-800 text-sm text-white py-0.5 px-3 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white" disabled>Embed data</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Vertical line between left panel and scatter plot -->
    <div class="w-px bg-white min-h-screen"></div>

    <!-- Scatter plot -->
    <div id="scatter-plot" class="w-6/12 bg-black h-full">
    </div>

    <!-- Vertical line between scatter plot and right Panel -->
    <div class="w-px bg-white min-h-screen"></div>

    <!-- Right panel: projection method, query, and download data -->
    <div class="w-3/12 bg-black p-4 mt-5 flex flex-col h-full">
        <!-- Projector method selection -->
        <div id="projection-panel" class="relative py-2"> 
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Projection method</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6">
                <div class="w-full">
                    <div class="sm:hidden">
                        <label for="projection-tabs" class="sr-only">Select a tab</label>
                        <select id="projection-tabs" name="projection-tabs" class="block w-full rounded-md border-white focus:border-white focus:ring-white">
                            <option selected>PCA</option>
                            <option>UMAP</option>
                        </select>
                    </div>
                    <div class="hidden sm:block">
                        <nav class="flex space-x-2" aria-label="Tabs">
                            <a href="#" class="bg-gray-800 text-white px-3 py-2 font-medium text-sm rounded-t-md border-b-2 border border-white hover:bg-gray-700" aria-current="page" data-projection-tab="pca">PCA (SVD)</a>
                            <a href="#" class="text-gray-400 hover:text-white px-3 py-2 font-medium text-sm rounded-t-md border-b-2 border border-transparent hover:border-white hover:bg-gray-800" data-projection-tab="umap">UMAP</a>
                        </nav>
                    </div>
                </div>
                <div class="w-full border-t border-white"></div>
                <div id="projection-params" class="w-full rounded-b-md border border-white p-2">
                    <div id="pca-params">
                        <!-- PCA parameters -->
                        <!-- Dimension -->
                         <div class="flex items-center justify-start mb-2">
                            <label for="pca-dimension" class="text-sm font-medium text-white mr-2">Dimension:</label>
                            <div class="inline-flex items-center space-x-2">
                                <span class="text-sm text-white">2D</span>
                                <div class="relative inline-block w-12 align-middle select-none">
                                    <input type="checkbox" id="pca-dimension" class="absolute block w-6 h-6 rounded-full bg-gray-500 border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-6 checked:bg-gray-700" checked />
                                    <label for="pca-dimension" class="block overflow-hidden h-6 rounded-full bg-gray-500 cursor-pointer"></label>
                                </div>
                                <span class="text-sm text-white">3D</span>
                            </div>
                        </div>
                        
                        <!-- Explained variance -->
                        <div class="mb-2">
                            <label for="pca-explained-variance" class="block text-sm font-medium text-white">Explained variance: <span id="pca-explained-variance-value" class="text-white">0%</span></label>
                        </div>
                    </div>
                    <div id="umap-params" class="hidden">
                        <!-- UMAP parameters -->
                        <!-- Dimension -->
                        <div class="flex items-center justify-start mb-2">
                            <label for="umap-dimension" class="text-sm font-medium text-white mr-2">Dimension:</label>
                            <div class="inline-flex items-center space-x-2">
                                <span class="text-sm text-white">2D</span>
                                <div class="relative inline-block w-12 align-middle select-none">
                                    <input type="checkbox" id="umap-dimension" class="absolute block w-6 h-6 rounded-full bg-gray-500 border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-6 checked:bg-gray-700" checked />
                                    <label for="umap-dimension" class="block overflow-hidden h-6 rounded-full bg-gray-500 cursor-pointer"></label>
                                </div>
                                <span class="text-sm text-white">3D</span>
                            </div>
                        </div>
                        
                        <!-- Number of epochs -->
                        <div class="flex items-center justify-start mb-2">
                            <label for="umap-epochs" class="text-sm font-medium text-white mr-2">Number of epochs:</label>
                            <input type="number" id="umap-epochs" name="umap-epochs" class="block px-2 bg-gray-800 text-white rounded-md border-white shadow-sm focus:border-white focus:ring-white w-24" min="1" value="400">
                        </div>
                        
                        <!-- Number of neighbors -->
                        <div class="mb-2">
                            <label for="umap-neighbors" class="block text-sm font-medium text-white">Number of neighbors: <span id="umap-neighbors-value" class="text-white">15</span></label>
                            <input type="range" id="umap-neighbors" name="umap-neighbors" class="w-full h-2 rounded-lg cursor-pointer" min="2" max="100" value="15">
                        </div>
                        
                        <!-- Minimum distance -->
                        <div class="mb-2">
                            <label for="umap-min-dist" class="block text-sm font-medium text-white">Minimum distance: <span id="umap-min-dist-value" class="text-white">0.1</span></label>
                            <input type="range" id="umap-min-dist" name="umap-min-dist" class="w-full h-2 rounded-lg cursor-pointer" min="0.001" max="0.5" step="0.001" value="0.1">
                        </div>
                        
                        <!-- Spread -->
                        <div class="flex items-center justify-start">
                            <label for="umap-spread" class="text-sm font-medium text-white mr-2">Spread:</label>
                            <input type="number" id="umap-spread" name="umap-spread" class="block px-2 bg-gray-800 text-white rounded-md border-white shadow-sm focus:border-white focus:ring-white w-24" min="0" value="1.0" step="0.1">
                        </div>
                    </div>
                </div>
                
                <!-- Project data button -->
                <div class="py-1 mt-1">
                    <div class="flex justify-center gap-2">
                        <button id="project-data" class="rounded-md border border-white bg-gray-800 text-sm text-white py-0.5 px-3 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white" disabled>Project data</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Query -->
        <div id="query-panel" class="relative py-2"> 
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Query</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col pt-6"> 
                <!-- Query input -->
                <div class="relative rounded-md rounded-b-none px-1.5 pb-1.5 pt-1.5 mb-2 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="query" class="block font-medium text-sm text-white">Query text</label>
                    <textarea id="query" name="query" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0 resize-y" rows="10" required></textarea>
                </div>
                
                <!-- Nearest neighbors -->
                <div class="mb-2">
                    <label for="query-neighbors" class="block text-sm font-medium text-white">Number of nearest neighbors: <span id="neighbors-value" class="text-white">5</span></label>
                    <input type="range" id="query-neighbors" name="query-neighbors" class="w-full h-2 rounded-lg cursor-pointer" min="1" max="50" value="5">
                </div>
                
                <!-- Project query button -->
                <div class="py-1 mt-1">
                    <div class="flex justify-center gap-2">
                        <button id="clear-query" class="rounded-md border border-white bg-red-800 text-sm text-white py-0.5 px-3 font-medium shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-white">Clear</button>
                        <button id="project-query" class="rounded-md border border-white bg-gray-800 text-sm text-white py-0.5 px-3 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white" title="Upload data, configure API key, and embed data to enable this." disabled>Project query</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Download embedding data -->
        <div id="query-panel" class="relative py-2"> 
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 font-bold text-white whitespace-nowrap">Download data</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6"> 
                <div class="py-1 mt-1">
                    <div class="flex justify-center gap-2">
                        <button id="download-data" class="rounded-md border border-white bg-gray-800 text-sm text-white py-0.5 px-3 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white" disabled>Download data</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
}


ui('app');


// Data setup
const dataUpload = document.getElementById('data-upload');
const dataUrl = document.getElementById('data-url');
const dataErrorMessageContainer = document.getElementById('data-error-message-container');
const dataSubmitButton = document.getElementById('submit-data');
const dataResetButton = document.getElementById('reset-data');
const dataDownloadButton = document.getElementById('download-data');

let data;

// Embedding model configuration
const embedBaseURLInput = document.getElementById('embed-base-url');
const embedApiKeyInput = document.getElementById('embed-api-key');
const embedApiKeyMessageContainer = document.getElementById('api-key-message-container');
const forgetApiKeyBtn = document.getElementById('forget-api-key');
const submitApiKeyBtn = document.getElementById('submit-api-key');
const embedModelsDropdown = document.getElementById('embed-model');
const embedDimensionSlider = document.getElementById('embed-dimension');
const embedDimensionOutput = document.getElementById('embed-dimension-output');
const submitEmbedModelButton = document.getElementById('submit-embed-model');

let embedding;

// Projector method configuration
const projectionTabs = document.querySelectorAll('[data-projection-tab]');
const pcaParamsPanel = document.getElementById('pca-params');
const umapParamsPanel = document.getElementById('umap-params');
const pcaDimensionInput = document.getElementById('pca-dimension');
const pcaExplainedVarianceValue = document.getElementById('pca-explained-variance-value');
const umapDimensionInput = document.getElementById('umap-dimension');
const umapEpochsInput = document.getElementById('umap-epochs');
const umapNeighborsInput = document.getElementById('umap-neighbors');
const umapNeighborsValue = document.getElementById('umap-neighbors-value');
const umapMinDistInput = document.getElementById('umap-min-dist');
const umapMinDistValue = document.getElementById('umap-min-dist-value');
const umapSpreadInput = document.getElementById('umap-spread');
const projectDataButton = document.getElementById('project-data');

let projector;

// Query setup
const queryInput = document.getElementById('query');
const queryNeighborsInput = document.getElementById('query-neighbors');
const queryNeighborsValue = document.getElementById('neighbors-value');
const projectQueryButton = document.getElementById('project-query');
const clearQueryButton = document.getElementById('clear-query');

// Scatter plot setup
const scatterPlotContainer = document.getElementById('scatter-plot');


const updateAppUrl = (url) => {
    const newUrl = `${window.location.origin}${window.location.pathname}?dataUrl=${encodeURIComponent(url)}`;
    window.history.replaceState(null, '', newUrl);
};


// Data submit
dataSubmitButton.addEventListener('click', async () => {
    data = null;
    dataDownloadButton.disabled = true;

    while (dataErrorMessageContainer.firstChild) {
        dataErrorMessageContainer.removeChild(dataErrorMessageContainer.firstChild);
    }

    if (dataUrl.value) {
        dataUpload.value = '';
        updateAppUrl(dataUrl.value);
        data = await Data.instantiateFromUrl(dataUrl.value, dataErrorMessageContainer);
    } else if (dataUpload.files.length > 0) {
        data = await Data.instantiateFromFileUpload(dataUpload.files[0], dataErrorMessageContainer);
    }

    if (data) {
        dataDownloadButton.disabled = false;

        if (embedding) {
            submitEmbedModelButton.disabled = false;
        }

        if (data.containsEmbeddings()) {
            if (embedding) {
                setModelAndDimensionFromData();
                enableProjectQueryButton();
            } else {
                disableProjectQueryButton();
            }

            projectDataButton.disabled = false;
            projectDataButton.click();
        }
    }
});


const disableProjectQueryButton = () => {
    projectQueryButton.disabled = true;
    projectQueryButton.title = "Upload data, configure API key, and embed data to enable this.";
};

const enableProjectQueryButton = () => {
    projectQueryButton.disabled = false;
    projectQueryButton.title = "";
}


dataUpload.addEventListener('change', () => {
    dataUrl.value = '';
    window.history.replaceState(null, '', window.location.origin + window.location.pathname);
    dataSubmitButton.click();
});


// Data reset
dataResetButton.addEventListener('click', () => {
    while (dataErrorMessageContainer.firstChild) {
        dataErrorMessageContainer.removeChild(dataErrorMessageContainer.firstChild);
    }

    dataUpload.value = '';
    dataUrl.value = '';
    data = null;
    dataDownloadButton.disabled = true;
    submitEmbedModelButton.disabled = true;
    projectDataButton.disabled = true;
    projectQueryButton.disabled = true;
    scatterPlotContainer.innerHTML = '';
    window.history.replaceState(null, '', window.location.origin + window.location.pathname);
});


// App loaded with dataUrl parameter
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataUrlParam = urlParams.get('dataUrl');
    if (dataUrlParam) {
        dataUrl.value = dataUrlParam;
        await dataSubmitButton.click();
    }
});


// Data download
dataDownloadButton.addEventListener('click', () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data.data, null, 2))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', data.fileName);
    document.body.appendChild(downloadAnchorNode);  // for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});


embedDimensionSlider.addEventListener('input', function () {
    embedDimensionOutput.textContent = this.value;
});


const updateEmbeddingDimensionDisplay = (min, max, value, disabled) => {
    embedDimensionSlider.min = min;
    embedDimensionSlider.max = max;
    embedDimensionSlider.value = value;
    embedDimensionSlider.disabled = disabled;
    embedDimensionOutput.textContent = value;
};


const displayDefaultModelsList = () => {
    embedModelsDropdown.innerHTML = '<option value="" disabled selected>Set URL/API to view models</option>';
    updateEmbeddingDimensionDisplay(0, 0, 0, true);
};


forgetApiKeyBtn.addEventListener('click', () => {
    embedApiKeyInput.value = '';

    while (embedApiKeyMessageContainer.firstChild) {
        embedApiKeyMessageContainer.removeChild(embedApiKeyMessageContainer.firstChild);
    }

    displayDefaultModelsList();
    submitEmbedModelButton.disabled = true;
    disableProjectQueryButton();
    manageOpenAIApiKey.deleteKey();
});


submitApiKeyBtn.addEventListener('click', async () => {
    while (embedApiKeyMessageContainer.firstChild) {
        embedApiKeyMessageContainer.removeChild(embedApiKeyMessageContainer.firstChild);
    }

    const baseURL = embedBaseURLInput.value;
    const apiKey = embedApiKeyInput.value;
    const isValid = await manageOpenAIApiKey.validateOpenAIApiKey(baseURL, apiKey);

    if (isValid) {  // API key is valid
        // Save the API key
        manageOpenAIApiKey.setKey(apiKey);

        // Populate models list
        embedding = await Embedding.instantiate(baseURL, apiKey);
        const modelsList = embedding.getModelsList();
        embedModelsDropdown.innerHTML = '';
        embedModelsDropdown.disabled = false;
        modelsList.forEach((model, index) => {
            const option = document.createElement('option');
            option.value = model;
            option.text = model;
            embedModelsDropdown.appendChild(option);

            // Default to first model
            if (index === 0) {
                embedModelsDropdown.value = model;
                embedding.setModel(model);
                const dimensionRangeValues = embedding.getModelDimensionRanges(model);
                updateEmbeddingDimensionDisplay(dimensionRangeValues[0], dimensionRangeValues[1],
                    embedding.getModelDimensionDefaults(model), false);
                embedding.setDimension(embedding.getModelDimensionDefaults(model));
            }
        });


        if (data) {
            submitEmbedModelButton.disabled = false;

            if (data.containsEmbeddings()) {
                setModelAndDimensionFromData();
                projectDataButton.disabled = false;
                projectDataButton.click();
                enableProjectQueryButton();
            }
        }

        // Display success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('bg-green-50', 'border', 'border-green-300', 'text-green-800', 'px-2', 'py-1', 'rounded', 'relative', 'text-sm', 'mt-2');
        successMessage.innerHTML = '<strong class="font-bold">Success!</strong> API key is valid.';
        embedApiKeyMessageContainer.appendChild(successMessage);
    } else {  // API key is invalid
        displayDefaultModelsList();

        // Display error message
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('bg-red-50', 'border', 'border-red-300', 'text-red-800', 'px-2', 'py-1', 'rounded', 'relative', 'text-sm', 'mt-2');
        errorMessage.innerHTML = '<strong class="font-bold">Error:</strong> Invalid API key.';
        embedApiKeyMessageContainer.appendChild(errorMessage);
    }
});


const setModelAndDimensionFromData = () => {
    const embeddingMethod = data.getEmbeddingMethod();
    if (embedding.getModelsList().includes(embeddingMethod)) {
        embedModelsDropdown.value = embeddingMethod;
        embedding.setModel(embeddingMethod);
        const dimension = data.getEmbeddingDimension();
        embedding.setDimension(dimension);
        const dimensionRangeValues = embedding.getModelDimensionRanges(embeddingMethod);
        updateEmbeddingDimensionDisplay(dimensionRangeValues[0], dimensionRangeValues[1], dimension, false);
    }
};


(async () => {
    const apiKey = manageOpenAIApiKey.getKey();
    if (apiKey) {
        embedApiKeyInput.value = apiKey;
        await submitApiKeyBtn.click();
    }
})();


embedModelsDropdown.addEventListener('change', () => {
    const model = embedModelsDropdown.value;
    embedding.setModel(model);
    const dimensionRangeValues = embedding.getModelDimensionRanges(model);
    updateEmbeddingDimensionDisplay(dimensionRangeValues[0], dimensionRangeValues[1],
        embedding.getModelDimensionDefaults(model), false);
});


submitEmbedModelButton.addEventListener('click', async () => {
    const originalHTML = submitEmbedModelButton.innerHTML;
    submitEmbedModelButton.innerHTML = `
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Embedding data...
            `;
    submitEmbedModelButton.disabled = true;

    embedding.setModel(embedModelsDropdown.value);
    embedding.setDimension(parseInt(embedDimensionSlider.value));

    // Calculate embeddings and insert them into data
    const embeddedTexts = await embedding.embed(data.getTexts());
    data.data.embeddingMethod = embedding.getModel();
    embeddedTexts.forEach((embedding, index) => {
        data.data.data[index].embedding = embedding;
    });

    submitEmbedModelButton.innerHTML = originalHTML;
    submitEmbedModelButton.disabled = false;

    projectDataButton.disabled = false;
    projectDataButton.click();
    enableProjectQueryButton();
});


projectionTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = tab.getAttribute('data-projection-tab');

        projectionTabs.forEach(t => {
            t.classList.remove('bg-gray-800', 'text-white', 'border-white');
            t.classList.add('text-gray-400', 'border-transparent');
        });

        tab.classList.remove('text-gray-400', 'border-transparent');
        tab.classList.add('bg-gray-800', 'text-white', 'border-white');

        if (tabId === 'pca') {
            pcaParamsPanel.classList.remove('hidden');
            umapParamsPanel.classList.add('hidden');
        } else {
            pcaParamsPanel.classList.add('hidden');
            umapParamsPanel.classList.remove('hidden');
        }
    });
});


umapNeighborsInput.addEventListener('input', function () {
    umapNeighborsValue.textContent = this.value;
});


umapMinDistInput.addEventListener('input', function () {
    umapMinDistValue.textContent = this.value;
});


queryNeighborsInput.addEventListener('input', function () {
    queryNeighborsValue.textContent = this.value;
});


const instantiateProjector = () => {
    const pcaParams = {
        nComponents: pcaDimensionInput.checked ? 3 : 2
    };

    const umapParams = {
        nEpochs: parseInt(umapEpochsInput.value),
        nComponents: umapDimensionInput.checked ? 3 : 2,
        nNeighbors: parseInt(umapNeighborsInput.value),
        minDist: parseFloat(umapMinDistInput.value),
        spread: parseFloat(umapSpreadInput.value)
    };

    return new Projector(pcaParams, umapParams);
}


const getActiveTabByVisibility = () => {
    if (!pcaParamsPanel.classList.contains('hidden')) {
        return 'pca';
    } else if (!umapParamsPanel.classList.contains('hidden')) {
        return 'umap';
    } else {
        return null;
    }
}


const projectData = () => {
    projector = instantiateProjector();

    const projectionMethod = getActiveTabByVisibility();
    const dimension = projectionMethod === 'umap' ? projector.umapParams.nComponents : projector.pcaParams.nComponents;
    const projectedData = projectionMethod === 'umap' ? projector.fitUMAP(data.getEmbeddings()) : projector.fitPCA(data.getEmbeddings());

    if (projectionMethod === 'pca') {
        pcaExplainedVarianceValue.textContent = `${(projector.getPcaExplainedVariance() * 100.0).toFixed(2)}%`;
    } else {
        pcaExplainedVarianceValue.textContent = '0%';
    }

    projector.setProjectionMethod(projectionMethod);

    const labels = data.containsLabels() ? data.getLabels() : data.getTexts();
    plotData(projectedData, labels, dimension);
};


projectDataButton.addEventListener('click', () => {
    const originalHTML = projectDataButton.innerHTML;
    projectDataButton.innerHTML = `
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Projecting data...
            `;
    projectDataButton.disabled = true;

    projectData();

    projectDataButton.innerHTML = originalHTML;
    projectDataButton.disabled = false;
});


const plotData = (projectedData, labels, dimension) => {
    projector.setNumPoints(projectedData.length);

    const trace = {
        x: projectedData.map(item => item[0]),
        y: projectedData.map(item => item[1]),
        z: dimension === 3 ? projectedData.map(item => item[2]) : null,
        text: labels,
        mode: 'markers',
        marker: {...Projector.plainMarkerStyle(projector.getNumPoints(), projector.getMarkerSize())},
        hoverinfo: 'text',
        type: dimension === 2 ? 'scatter' : 'scatter3d',
        showlegend: false
    };
    projector.setTrace(trace);

    Plotly.newPlot('scatter-plot', [trace], Projector.layout());
};


const highlightMarkers = (indices) => {
    const updatedMarker = {...projector.getTrace().marker};

    updatedMarker.color = [...projector.getTrace().marker.color];
    updatedMarker.symbol = [...projector.getTrace().marker.symbol];

    indices.forEach(index => {
        updatedMarker.color[index] = 'RGB(57, 255, 20)';
        updatedMarker.symbol[index] = 'x';
    });

    Plotly.restyle("scatter-plot", {marker: updatedMarker}, [0]);
};


const resetMarkers = () => {
    Plotly.restyle("scatter-plot", {marker: Projector.plainMarkerStyle(projector.getNumPoints(), projector.getMarkerSize())});
};


const plotQuery = (projectedQuery, label, neighborIndices, dimension) => {
    // Delete existing query traces and its neighbors
    if (scatterPlotContainer.data.length > 1) {
        for (let i = scatterPlotContainer.data.length - 1; i > 0; i--) {
            Plotly.deleteTraces('scatter-plot', i);
        }
    }

    resetMarkers();

    // Ripple traces
    const numRipples = 4;
    const initialOpacity = 0.45;
    const initialSize = projector.getMarkerSize() / 3;
    const scaleFactor = dimension === 2 ? 2.5 : 1;

    const rippleTraces = [];

    for (let i = 0; i < numRipples; i++) {
        const opacity = 0.95 - i * ((0.95 - initialOpacity) / numRipples);
        const size = initialSize + i * ((projector.getMarkerSize() - initialSize) / numRipples) * scaleFactor;
        const conditionalLabel = i === 0 ? label : null;

        rippleTraces.push({
            x: [projectedQuery[0]],
            y: [projectedQuery[1]],
            z: dimension === 3 ? [projectedQuery[2]] : null,
            text: [conditionalLabel],
            mode: 'markers',
            marker: {
                size: size,
                color: `RGBA(255, 105, 180, ${opacity})`,
                symbol: 'circle'
            },
            hoverinfo: 'text',
            type: dimension === 2 ? 'scatter' : 'scatter3d',
            showlegend: false
        });
    }

    Plotly.addTraces('scatter-plot', [...rippleTraces]);
    highlightMarkers(neighborIndices);
};


projectQueryButton.addEventListener('click', async () => {
    const query = queryInput.value;

    if (!query) {
        return;
    }

    projectQueryButton.disabled = true;
    clearQueryButton.disabled = true;

    const originalHTML = projectQueryButton.innerHTML;
    projectQueryButton.innerHTML = `
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Projecting query...
            `;

    const numNeighbors = parseInt(queryNeighborsInput.value);
    const embeddedQuery = await embedding.embed([query]);
    const nearestNeighborIndices = findIndicesOfNearestNeighbors(embeddedQuery[0], data.getEmbeddings(), numNeighbors);

    const projectionMethod = projector.getProjectionMethod();
    console.log(projectionMethod);
    console.log(projector.projectWithUMAP(embeddedQuery));
    const projectedQuery = projectionMethod === 'umap' ? projector.projectWithUMAP(embeddedQuery)[0] : projector.projectWithPCA(embeddedQuery)[0];
    const dimension = projectionMethod === 'umap' ? projector.umapParams.nComponents : projector.pcaParams.nComponents;
    console.log(dimension);
    plotQuery(projectedQuery, 'Query', nearestNeighborIndices, dimension);

    projectQueryButton.innerHTML = originalHTML;
    projectQueryButton.disabled = false;
    clearQueryButton.disabled = false;
});


clearQueryButton.addEventListener('click', () => {
    clearQueryButton.disabled = true;
    projectQueryButton.disabled = true;

    if (scatterPlotContainer.data.length > 1) {
        for (let i = scatterPlotContainer.data.length - 1; i > 0; i--) {
            Plotly.deleteTraces('scatter-plot', i);
        }
    }

    resetMarkers();

    clearQueryButton.disabled = false;
    projectQueryButton.disabled = false;
});


const cosineSimilarity = (vector, listOfVectors) => {
    const dotProduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    const magnitude = (v) => Math.sqrt(v.map((x, i) => v[i] * v[i]).reduce((m, n) => m + n));

    if (!Array.isArray(listOfVectors) || listOfVectors.length === 0) {
        throw new Error('The list of vectors must be a non-empty array.');
    }

    if (listOfVectors.some(v => v.length !== vector.length)) {
        throw new Error('All vectors must be of equal length.');
    }

    const magnitudeA = magnitude(vector);

    return listOfVectors.map(b => {
        const prod = dotProduct(vector, b);
        const magnitudeB = magnitude(b);

        if (magnitudeA === 0 || magnitudeB === 0) {
            throw new Error('Vectors must be non-zero.');
        }

        return prod / (magnitudeA * magnitudeB);
    });
}


const findIndicesOfNearestNeighbors = (vector, listOfVectors, numNeighbors) => {
    const similarities = cosineSimilarity(vector, listOfVectors);
    return similarities.map((similarity, index) => ({similarity, index}))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, numNeighbors)
        .map(item => item.index);
};