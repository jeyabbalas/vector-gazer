import './style.css';
import vectorGazerLogo from '/vector-gazer.svg';
import githubLogo from '/github.svg';


function ui(divID) {
    let divUI = divID ? document.getElementById(divID) : document.createElement('div');

    // <h1 class="text-3xl font-bold underline"> Hello world! </h1>
    divUI.innerHTML = `
<div id="header" class="mx-auto max-w-full px-2 py-0 bg-black" style="height: 75%;">
    <div class="flex items-center justify-between">
        <div class="flex justify-start gap-2 pl-24">
            <div class="flex items-center">
                <img src="${vectorGazerLogo}" class="h-36 w-36 -mb-12 logo vanilla" alt="vector gazer logo" />
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
`;
}


ui('app');