import './style.css';
import vectorGazerLogo from '/vector-gazer.svg';
import githubLogo from '/github.svg';


function ui(divID) {
    let divUI = divID ? document.getElementById(divID) : document.createElement('div');

    // <h1 class="text-3xl font-bold underline"> Hello world! </h1>
    divUI.innerHTML = `
<!-- Header -->
<div id="header" class="mx-auto max-w-full px-2 py-0 bg-black h-1/10 relative z-10"> <div class="flex items-center justify-between">
        <div class="flex justify-start gap-2 pl-24">
            <div class="flex items-center">
                <img src="${vectorGazerLogo}" class="h-36 w-36 -mb-10 logo vanilla" alt="vector gazer logo" />
            </div>
            <div class="min-w-0 flex-1 flex items-center">
                <h1 class="text-4xl font-bold leading-7 text-white">Vector Gazer</h1>
            </div>
        </div>
        
        <div class="flex md:mt-0 md:ml-4 shrink-0 pr-24">
            <a title="Source code" href="https://github.com/jeyabbalas/vector-gazer">
                <img src="${githubLogo}" class="h-16 w-16 fill-current" alt="github logo" />
            </a>
        </div>
    </div>
</div>

<hr class="border-t-2 border-white mx-auto max-w-full" />

<div class="flex mx-auto max-w-full h-9/10" style="height: calc(100vh - 75px);">
    <!-- Left panel: data, embedding API, embedding model, and projection method -->
    <div class="w-3/12 bg-black p-4 mt-8 flex flex-col h-full">
        <!-- Data upload -->
        <div id="data-panel" class="relative py-2">
            <h2 class="absolute transform left-4 -translate-y-1/2 bg-black px-2 text-lg font-bold text-white whitespace-nowrap">Data</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6">
                <!-- File upload -->
                <div class="relative rounded-md rounded-b-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="data-upload" class="block font-medium text-white">File upload</label>
                    <input type="file" id="data-upload" name="data-upload" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" accept=".json" required>
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
                    <label for="data-url" class="block font-medium text-white">URL</label>
                    <input type="url" id="data-url" name="data-url" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" placeholder="Enter URL" required>
                </div>
            </div>
        </div>

        <!-- Embeddings API configuration -->
        <div id="config-panel" class="relative py-2">
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 text-lg font-bold text-white whitespace-nowrap">Embeddings API</h2>
        
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6">
                <div class="relative rounded-md rounded-b-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="base-url" class="block font-medium text-white">Base URL</label>
                    <input type="url" id="base-url" name="base-url" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" placeholder="https://api.openai.com" value="https://api.openai.com" required>
                </div>
        
                <div class="relative rounded-md rounded-t-none px-1.5 pb-1.5 pt-1.5 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="api-key" class="block font-medium text-white">API key</label>
                    <input type="password" id="api-key" name="api-key" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" required>
                </div>
        
                <div id="api-key-message-container"></div>
        
                <div id="submit-api-key-buttons" class="py-2 mt-2">
                    <div class="flex justify-center gap-2">
                        <button id="forget-api-key" class="rounded-md border border-white bg-red-800 text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-white">Forget API key</button>
                        <button id="submit-api-key" class="rounded-md border border-white bg-gray-800 text-white py-0.5 px-1.5 font-medium shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-white">Submit</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Embeddings model selection -->
        <div id="model-panel" class="relative py-2"> 
            <h2 class="absolute left-4 transform -translate-y-1/2 bg-black px-2 text-lg font-bold text-white whitespace-nowrap">Embedding model</h2>
            <div class="rounded-md border border-white mb-4 p-2 flex flex-col items-center pt-6"> 
                <div class="relative rounded-md px-1.5 pb-1.5 pt-1.5 mb-4 w-full ring-1 ring-inset ring-gray-400 focus-within:z-10 focus-within:ring-2 focus-within:ring-white">
                    <label for="model" class="block font-medium text-white">Model</label>
                    <select id="model" name="model" class="block rounded-sm w-full border-0 p-1 mb-1 bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-0" required>
                        <option value="" disabled selected>Set URL/API to view models</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Projection method selection -->
        <h2 class="text-xl font-bold text-white mb-4">Projection method</h2>
        <div id="projection-panel" class="rounded-md border border-white p-2 flex-grow">
            <ul class="flex border-b border-gray-300 text-white mb-2">
                <li class="-mb-px mr-1">
                    <a class="rounded-t-md bg-gray-800 inline-block py-2 px-4 text-white" href="#pca">PCA</a>
                </li>
                <li class="mr-1">
                    <a class="rounded-t-md bg-gray-900 inline-block py-2 px-4 text-white" href="#umap">UMAP</a>
                </li>
            </ul>
        </div>
    </div>

    <!-- Vertical line between left panel and scatter plot -->
    <div class="w-px bg-white"></div>

    <!-- Scatter plot -->
    <div id="scatter-plot" class="w-2/3 p-4 bg-black flex flex-col h-full">
    </div>

    <!-- Vertical line between scatter plot and right Panel -->
    <div class="w-px bg-white"></div>

    <!-- Right panel: query -->
    <div class="w-3/12 bg-black p-4 mt-4 flex flex-col h-full">
        <h2 class="text-xl font-bold text-white mb-4">Query</h2>
        <div id="query-panel" class="rounded-md border border-white p-2 flex-grow">
            <!-- Placeholder content for Query section -->
            <p class="text-white">Query section content</p>
        </div>
    </div>
</div>
`;
}


ui('app');