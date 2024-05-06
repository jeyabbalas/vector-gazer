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
    <!-- Left panel: data, embedding, and projection -->
    <div class="w-1/6 bg-black p-4 mt-4 flex flex-col h-full">
        <h2 class="text-xl font-bold text-white mb-4">Data</h2>
        <div id="data-panel" class="border border-white mb-4 p-2 flex-grow">
            <!-- Placeholder content for Data section -->
            <p class="text-white">Data section content</p>
        </div>

        <h2 class="text-xl font-bold text-white mb-4">Embeddings API config</h2>
        <div id="config-panel" class="border border-white mb-4 p-2 flex-grow">
            <!-- Placeholder content for API config -->
            <p class="text-white">API config content</p>
        </div>

        <h2 class="text-xl font-bold text-white mb-4">Projection method</h2>
        <div id="projection-panel" class="border border-white p-2 flex-grow">
            <ul class="flex border-b border-gray-300 text-white mb-2">
                <li class="-mb-px mr-1">
                    <a class="bg-gray-900 inline-block py-2 px-4 text-white" href="#pca">PCA</a>
                </li>
                <li class="mr-1">
                    <a class="bg-gray-800 inline-block py-2 px-4 text-white" href="#umap">UMAP</a>
                </li>
            </ul>
            <!-- Placeholder content for Projection Method -->
            <p class="text-white">Projection method content</p>
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
    <div class="w-1/6 bg-black p-4 mt-4 flex flex-col h-full">
        <h2 class="text-xl font-bold text-white mb-4">Query</h2>
        <div id="query-panel" class="border border-white p-2 flex-grow">
            <!-- Placeholder content for Query section -->
            <p class="text-white">Query section content</p>
        </div>
    </div>
</div>
`;
}


ui('app');