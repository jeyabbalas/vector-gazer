var _=Object.defineProperty;var ee=(i,e,t)=>e in i?_(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var D=(i,e,t)=>(ee(i,typeof e!="symbol"?e+"":e,t),t);import"https://cdn.plot.ly/plotly-2.32.0.min.js";import{OpenAI as $}from"https://cdn.skypack.dev/openai@4.38.5?min";import{PCA as te}from"https://esm.sh/ml-pca@4.1.1";import{UMAP as ie}from"https://esm.sh/umap-js@1.3.3";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const m of s.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&n(m)}).observe(document,{childList:!0,subtree:!0});function t(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(a){if(a.ep)return;a.ep=!0;const s=t(a);fetch(a.href,s)}})();const ne="/vector-gazer/vector-gazer.svg",ae="/vector-gazer/github.svg";class l{constructor(e,t){this.data=e,this.fileName=t}static async instantiateFromFileUpload(e,t){try{const n=await l.parseJsonFile(e);return l.validateJsonData(n,t),l.displaySuccess("Data loaded.",t),new l(n,e.name)}catch(n){l.displayError("Error parsing JSON file or validation failed.",t),console.error("Error parsing JSON file or validation failed:",n)}}static async instantiateFromUrl(e,t){try{const n=await l.fetchJsonData(e);l.validateJsonData(n,t),l.displaySuccess("Data loaded.",t);const a=e.split("/"),s=a[a.length-1];return new l(n,s)}catch(n){l.displayError("Error fetching JSON data from URL or validation failed.",t),console.error("Error fetching JSON data from URL or validation failed:",n)}}containsEmbeddings(){return this.data.data[0].hasOwnProperty("embedding")}containsLabels(){return this.data.data[0].hasOwnProperty("label")}getEmbeddings(){return this.data.data.map(e=>e.embedding)}getLabels(){return this.data.data.map(e=>e.label)}getTexts(){return this.data.data.map(e=>e.text)}getData(){return this.data.data}getEmbeddingMethod(){return this.data.embeddingMethod}getEmbeddingDimension(){return this.data.data[0].embedding.length}static async parseJsonFile(e){const t=await e.text();return JSON.parse(t)}static async fetchJsonData(e){const t=await fetch(e);if(!t.ok)throw new Error(`Network response was not ok: ${t.statusText}`);return await t.json()}static validateJsonData(e,t){if(typeof e!="object"||e===null)throw l.displayError("JSON data should be an object.",t),new Error("JSON data should be an object.");if(!e.hasOwnProperty("data")||!Array.isArray(e.data))throw l.displayError('JSON object must contain a "data" key with an array value.',t),new Error('JSON object must contain a "data" key with an array value.');const n=e.data;let a=!1,s=!1,m=null;if(n.forEach((r,o)=>{if(typeof r!="object"||r===null)throw l.displayError(`Item at index ${o} is not an object.`,t),new Error(`Item at index ${o} is not an object.`);if(!r.hasOwnProperty("text")||typeof r.text!="string")throw l.displayError(`Item at index ${o} is missing a "text" key or "text" is not a string.`,t),new Error(`Item at index ${o} is missing a "text" key or "text" is not a string.`);if(r.hasOwnProperty("embedding")){if(!Array.isArray(r.embedding)||r.embedding.some(h=>typeof h!="number"))throw l.displayError(`Item at index ${o} has an "embedding" key that is not an array of numbers.`,t),new Error(`Item at index ${o} has an "embedding" key that is not an array of numbers.`);if(m===null)m=r.embedding.length;else if(m!==r.embedding.length)throw l.displayError(`Item at index ${o} has an "embedding" key with a different length than previous embeddings.`,t),new Error(`Item at index ${o} has an "embedding" key with a different length than previous embeddings.`);s||(s=!0)}if(r.hasOwnProperty("label")){if(typeof r.label!="string")throw l.displayError(`Item at index ${o} has a "label" key that is not a string.`,t),new Error(`Item at index ${o} has a "label" key that is not a string.`);a||(a=!0)}}),a&&n.forEach((r,o)=>{if(!r.hasOwnProperty("label"))throw l.displayError(`Item at index ${o} is missing a "label" key, which is required since another object contains "label".`,t),new Error(`Item at index ${o} is missing a "label" key, which is required since another object contains "label".`)}),s&&(n.forEach((r,o)=>{if(!r.hasOwnProperty("embedding"))throw l.displayError(`Item at index ${o} is missing an "embedding" key, which is required since another object contains "embedding".`,t),new Error(`Item at index ${o} is missing an "embedding" key, which is required since another object contains "embedding".`)}),!e.hasOwnProperty("embeddingMethod")||typeof e.embeddingMethod!="string"))throw l.displayError('JSON object must contain an "embeddingMethod" key with a string value when "embedding" is present.',t),new Error('JSON object must contain an "embeddingMethod" key with a string value when "embedding" is present.')}static displayError(e,t){const n=document.createElement("div");n.classList.add("bg-red-50","border","border-red-300","text-red-800","px-2","py-1","rounded","relative","text-sm","mt-2"),n.innerHTML=`<strong class="font-bold">Error:</strong> ${e}`,t.appendChild(n)}static displaySuccess(e,t){const n=document.createElement("div");n.classList.add("bg-green-50","border","border-green-300","text-green-800","px-2","py-1","rounded","relative","text-sm","mt-2"),n.innerHTML=`<strong class="font-bold">Success:</strong> ${e}`,t.appendChild(n)}}const I={async validateOpenAIApiKey(i,e){try{return await new $({baseURL:i,apiKey:e,dangerouslyAllowBrowser:!0}).models.list(),!0}catch(t){return t.response&&t.response.status===401?(console.error("Invalid API key:",t),!1):(console.error("Error checking API key:",t),!1)}},setKey(i){localStorage.setItem("openai-api-key",i)},getKey(){return localStorage.getItem("openai-api-key")},deleteKey(){localStorage.removeItem("openai-api-key")}};class N{constructor(e,t){this.openai=e,this.modelsList=t,this.model=null,this.modelDimensionRanges={"text-embedding-ada-002":[1536,1536],"text-embedding-3-small":[2,1536],"text-embedding-3-large":[2,3072]},this.modelDimensionDefaults={"text-embedding-ada-002":1536,"text-embedding-3-small":1536,"text-embedding-3-large":3072},this.dimension=this.model?this.modelDimensionDefaults[this.model]:0}static async instantiate(e,t){const n=new $({baseURL:e,apiKey:t,dangerouslyAllowBrowser:!0}),a=(await n.models.list()).data.map(s=>s.id).filter(s=>s.includes("embedding")).sort();return new N(n,a)}async embed(e){return(await this.openai.embeddings.create({model:this.model,input:e,dimensions:this.dimension,encoding_format:"float"})).data.map(n=>n.embedding)}getModelsList(){return this.modelsList}getModel(){return this.model}setModel(e){this.model=e}getModelDimensionRanges(e){return this.modelDimensionRanges[e]}getModelDimensionDefaults(e){return this.modelDimensionDefaults[e]}getDimension(){return this.dimension}setDimension(e){this.dimension=e}}let se=1234;function re(i){return function(){var e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}class k{constructor(e={},t={}){this.projectionMethod=null;const n={nComponents:3};this.pcaParams={...n,...e},this.pca=null;const a={nEpochs:400,nComponents:3,nNeighbors:15,minDist:.1,spread:1,random:re(se)};this.umapParams={...a,...t},this.umap=null,this.numPoints=0,this.markerSize=5,this.trace=null}fitPCA(e){return this.pca=new te(e),this.pca.predict(e,this.pcaParams).data}projectWithPCA(e){return this.pca.predict(e,this.pcaParams).data}getPcaExplainedVariance(){return this.pca.getExplainedVariance().slice(0,this.pcaParams.nComponents).reduce((e,t)=>e+t,0)}fitUMAP(e){return this.umap=new ie(this.umapParams),this.umap.fit(e)}projectWithUMAP(e,t){return[[]]}setTrace(e){this.trace=e}getTrace(){return this.trace}getNumPoints(){return this.numPoints}setNumPoints(e){this.numPoints=e,this.markerSize=Math.max(2,20-Math.log2(e))}getMarkerSize(){return this.markerSize}setProjectionMethod(e){this.projectionMethod=e}getProjectionMethod(){return this.projectionMethod}}D(k,"plainMarkerStyle",(e,t)=>({color:Array(e).fill("white"),size:Array(e).fill(t),symbol:Array(e).fill("circle"),line:{color:"white",width:1},opacity:.8})),D(k,"layout",()=>({plot_bgcolor:"black",paper_bgcolor:"black",margin:{l:0,r:0,b:0,t:0}}));function oe(i){let e=document.getElementById(i);e.innerHTML=`
<!-- Header -->
<div id="header" class="mx-auto max-w-full px-2 py-0 bg-black h-1/10 relative z-10"> <div class="flex items-center justify-between">
        <div class="flex justify-start gap-2 pl-24">
            <div class="flex items-center">
                <img src="${ne}" class="h-32 w-32 -mb-10 logo vanilla" alt="vector gazer logo" />
            </div>
            <div class="min-w-0 flex-1 flex items-center">
                <h1 class="text-3xl font-bold leading-7 text-white">Vector Gazer</h1>
            </div>
        </div>
        
        <div class="flex md:mt-0 md:ml-4 shrink-0 pr-24">
            <a title="Source code" href="https://github.com/jeyabbalas/vector-gazer">
                <img src="${ae}" class="h-14 w-14 fill-current" alt="github logo" />
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
                    <label for="query-neighbors" class="block text-sm font-medium text-white">Number of nearest neighbors: <span id="query-neighbors-value" class="text-white">5</span></label>
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
`}oe("app");const M=document.getElementById("data-upload"),E=document.getElementById("data-url"),w=document.getElementById("data-error-message-container"),T=document.getElementById("submit-data"),de=document.getElementById("reset-data"),L=document.getElementById("download-data");let d;const le=document.getElementById("embed-base-url"),U=document.getElementById("embed-api-key"),v=document.getElementById("api-key-message-container"),ce=document.getElementById("forget-api-key"),H=document.getElementById("submit-api-key"),y=document.getElementById("embed-model"),x=document.getElementById("embed-dimension"),J=document.getElementById("embed-dimension-output"),g=document.getElementById("submit-embed-model");let u;const R=document.querySelectorAll("[data-projection-tab]"),S=document.getElementById("pca-params"),q=document.getElementById("umap-params"),me=document.getElementById("pca-dimension"),j=document.getElementById("pca-explained-variance-value"),ue=document.getElementById("umap-dimension"),pe=document.getElementById("umap-epochs"),F=document.getElementById("umap-neighbors"),be=document.getElementById("umap-neighbors-value"),K=document.getElementById("umap-min-dist"),he=document.getElementById("umap-min-dist-value"),ge=document.getElementById("umap-spread"),p=document.getElementById("project-data");let c;const fe=document.getElementById("query"),f=document.getElementById("query-neighbors"),V=document.getElementById("query-neighbors-value"),b=document.getElementById("project-query"),P=document.getElementById("clear-query"),C=document.getElementById("scatter-plot"),ye=i=>{const e=`${window.location.origin}${window.location.pathname}?dataUrl=${encodeURIComponent(i)}`;window.history.replaceState(null,"",e)};T.addEventListener("click",async()=>{for(;w.firstChild;)w.removeChild(w.firstChild);d=null,L.disabled=!0,g.disabled=!0,p.disabled=!0,A(),j.textContent="0%",C.innerHTML="",E.value?(M.value="",ye(E.value),d=await l.instantiateFromUrl(E.value,w)):M.files.length>0&&(d=await l.instantiateFromFileUpload(M.files[0],w)),d&&(L.disabled=!1,u&&(g.disabled=!1),d.containsEmbeddings()&&(u?(Z(),O()):A(),p.disabled=!1,p.click()))});const A=()=>{b.disabled=!0,b.title="Upload data, configure API key, and embed data to enable this."},O=()=>{b.disabled=!1,b.title="",f.max=f.max>d.getData().length?d.getData().length:f.max,f.value=f.value>d.getData().length?d.getData().length:f.value,V.textContent=f.value};M.addEventListener("change",()=>{E.value="",window.history.replaceState(null,"",window.location.origin+window.location.pathname),T.click()});de.addEventListener("click",()=>{for(;w.firstChild;)w.removeChild(w.firstChild);M.value="",E.value="",d=null,L.disabled=!0,g.disabled=!0,p.disabled=!0,A(),j.textContent="0%",C.innerHTML="",window.history.replaceState(null,"",window.location.origin+window.location.pathname)});window.addEventListener("DOMContentLoaded",async()=>{const e=new URLSearchParams(window.location.search).get("dataUrl");e&&(E.value=e,await T.click())});L.addEventListener("click",()=>{const i=`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(d.data,null,2))}`,e=document.createElement("a");e.setAttribute("href",i),e.setAttribute("download",d.fileName),document.body.appendChild(e),e.click(),e.remove()});x.addEventListener("input",function(){J.textContent=this.value});const B=(i,e,t,n)=>{x.min=i,x.max=e,x.value=t,x.disabled=n,J.textContent=t},Q=()=>{y.innerHTML='<option value="" disabled selected>Set URL/API to view models</option>',B(0,0,0,!0)};ce.addEventListener("click",()=>{for(U.value="";v.firstChild;)v.removeChild(v.firstChild);Q(),g.disabled=!0,A(),I.deleteKey()});H.addEventListener("click",async()=>{for(;v.firstChild;)v.removeChild(v.firstChild);const i=le.value,e=U.value;if(await I.validateOpenAIApiKey(i,e)){I.setKey(e),u=await N.instantiate(i,e);const n=u.getModelsList();y.innerHTML="",y.disabled=!1,n.forEach((s,m)=>{const r=document.createElement("option");if(r.value=s,r.text=s,y.appendChild(r),m===0){y.value=s,u.setModel(s);const o=u.getModelDimensionRanges(s);B(o[0],o[1],u.getModelDimensionDefaults(s),!1),u.setDimension(u.getModelDimensionDefaults(s))}}),d&&(g.disabled=!1,d.containsEmbeddings()&&(Z(),p.disabled=!1,p.click(),O()));const a=document.createElement("div");a.classList.add("bg-green-50","border","border-green-300","text-green-800","px-2","py-1","rounded","relative","text-sm","mt-2"),a.innerHTML='<strong class="font-bold">Success!</strong> API key is valid.',v.appendChild(a)}else{Q();const n=document.createElement("div");n.classList.add("bg-red-50","border","border-red-300","text-red-800","px-2","py-1","rounded","relative","text-sm","mt-2"),n.innerHTML='<strong class="font-bold">Error:</strong> Invalid API key.',v.appendChild(n)}});const Z=()=>{const i=d.getEmbeddingMethod();if(u.getModelsList().includes(i)){y.value=i,u.setModel(i);const e=d.getEmbeddingDimension();u.setDimension(e);const t=u.getModelDimensionRanges(i);B(t[0],t[1],e,!1)}};(async()=>{const i=I.getKey();i&&(U.value=i,await H.click())})();y.addEventListener("change",()=>{const i=y.value;u.setModel(i);const e=u.getModelDimensionRanges(i);B(e[0],e[1],u.getModelDimensionDefaults(i),!1)});g.addEventListener("click",async()=>{const i=g.innerHTML;g.innerHTML=`
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Embedding data...
            `,g.disabled=!0,u.setModel(y.value),u.setDimension(parseInt(x.value));const e=await u.embed(d.getTexts());d.data.embeddingMethod=u.getModel(),e.forEach((t,n)=>{d.data.data[n].embedding=t}),g.innerHTML=i,g.disabled=!1,p.disabled=!1,p.click(),O()});R.forEach(i=>{i.addEventListener("click",e=>{e.preventDefault();const t=i.getAttribute("data-projection-tab");R.forEach(n=>{n.classList.remove("bg-gray-800","text-white","border-white"),n.classList.add("text-gray-400","border-transparent")}),i.classList.remove("text-gray-400","border-transparent"),i.classList.add("bg-gray-800","text-white","border-white"),t==="pca"?(S.classList.remove("hidden"),q.classList.add("hidden")):(S.classList.add("hidden"),q.classList.remove("hidden"))})});F.addEventListener("input",function(){be.textContent=this.value});K.addEventListener("input",function(){he.textContent=this.value});f.addEventListener("input",function(){V.textContent=this.value});const we=()=>{const i={nComponents:me.checked?3:2},e={nEpochs:parseInt(pe.value),nComponents:ue.checked?3:2,nNeighbors:parseInt(F.value),minDist:parseFloat(K.value),spread:parseFloat(ge.value)};return new k(i,e)},ve=()=>S.classList.contains("hidden")?q.classList.contains("hidden")?null:"umap":"pca",xe=()=>{c=we();const i=ve(),e=i==="umap"?c.umapParams.nComponents:c.pcaParams.nComponents,t=i==="umap"?c.fitUMAP(d.getEmbeddings()):c.fitPCA(d.getEmbeddings());i==="pca"?j.textContent=`${(c.getPcaExplainedVariance()*100).toFixed(2)}%`:j.textContent="0%",c.setProjectionMethod(i);const n=d.containsLabels()?d.getLabels():d.getTexts();Ee(t,n,e)};p.addEventListener("click",()=>{const i=p.innerHTML;p.innerHTML=`
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Projecting data...
            `,p.disabled=!0,xe(),p.innerHTML=i,p.disabled=!1});const Ee=(i,e,t)=>{c.setNumPoints(i.length);const n={x:i.map(a=>a[0]),y:i.map(a=>a[1]),z:t===3?i.map(a=>a[2]):null,text:e,mode:"markers",marker:{...k.plainMarkerStyle(c.getNumPoints(),c.getMarkerSize())},hoverinfo:"text",type:t===2?"scatter":"scatter3d",showlegend:!1};c.setTrace(n),Plotly.newPlot("scatter-plot",[n],k.layout())},z=i=>{const e={...c.getTrace().marker};e.color=[...c.getTrace().marker.color],e.symbol=[...c.getTrace().marker.symbol],i.forEach(t=>{e.color[t]="RGB(57, 255, 20)",e.symbol[t]="x"}),Plotly.restyle("scatter-plot",{marker:e},[0])},G=()=>{Plotly.restyle("scatter-plot",{marker:k.plainMarkerStyle(c.getNumPoints(),c.getMarkerSize())})},ke=(i,e,t,n)=>{if(C.data.length>1)for(let h=C.data.length-1;h>0;h--)Plotly.deleteTraces("scatter-plot",h);if(G(),i.length===0){z(t);return}const a=4,s=.45,m=c.getMarkerSize()/3,r=n===2?2.5:1,o=[];for(let h=0;h<a;h++){const W=.95-h*((.95-s)/a),X=m+h*((c.getMarkerSize()-m)/a)*r,Y=h===a-1?e:null;o.push({x:[i[0]],y:[i[1]],z:n===3?[i[2]]:null,text:[Y],mode:"markers",marker:{size:X,color:`RGBA(255, 105, 180, ${W})`,symbol:"circle"},hoverinfo:"text",type:n===2?"scatter":"scatter3d",showlegend:!1})}Plotly.addTraces("scatter-plot",[...o]),z(t)};b.addEventListener("click",async()=>{const i=fe.value;if(!i)return;b.disabled=!0,P.disabled=!0;const e=b.innerHTML;b.innerHTML=`
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Projecting query...
            `;const t=parseInt(f.value),n=await u.embed([i]),a=Me(n[0],d.getEmbeddings(),t),s=c.getProjectionMethod();let m=s==="umap"?c.projectWithUMAP(n):c.projectWithPCA(n)[0];const r=s==="umap"?c.umapParams.nComponents:c.pcaParams.nComponents;ke(m,"Query",a,r),b.innerHTML=e,b.disabled=!1,P.disabled=!1});P.addEventListener("click",()=>{if(P.disabled=!0,b.disabled=!0,C.data.length>1)for(let i=C.data.length-1;i>0;i--)Plotly.deleteTraces("scatter-plot",i);G(),P.disabled=!1,b.disabled=!1});const Ce=(i,e)=>{const t=(s,m)=>s.map((r,o)=>s[o]*m[o]).reduce((r,o)=>r+o),n=s=>Math.sqrt(s.map((m,r)=>s[r]*s[r]).reduce((m,r)=>m+r));if(!Array.isArray(e)||e.length===0)throw new Error("The list of vectors must be a non-empty array.");if(e.some(s=>s.length!==i.length))throw new Error("All vectors must be of equal length.");const a=n(i);return e.map(s=>{const m=t(i,s),r=n(s);if(a===0||r===0)throw new Error("Vectors must be non-zero.");return m/(a*r)})},Me=(i,e,t)=>Ce(i,e).map((a,s)=>({similarity:a,index:s})).sort((a,s)=>s.similarity-a.similarity).slice(0,t).map(a=>a.index);
