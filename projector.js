import {PCA} from 'https://esm.sh/ml-pca@4.1.1';
import {UMAP} from 'https://esm.sh/umap-js@1.3.3';


let seed = 1234;

function mulberry32(seed) {
    return function () {
        var t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}


class Projector {
    constructor(pcaParams = {}, umapParams = {}) {
        this.projectionMethod = null;

        // PCA
        const pcaDefaults = {
            nComponents: 3
        };
        this.pcaParams = {...pcaDefaults, ...pcaParams};
        this.pca = null;

        // UMAP
        const umapDefaults = {
            nEpochs: 400,
            nComponents: 3,
            nNeighbors: 15,
            minDist: 0.1,
            spread: 1.0,
            random: mulberry32(seed)
        };
        this.umapParams = {...umapDefaults, ...umapParams};
        this.umap = null;

        // Plotly utilities
        this.numPoints = 0;
        this.markerSize = 5;
        this.trace = null;
    }

    fitPCA(data) {
        this.pca = new PCA(data);
        return this.pca.predict(data, this.pcaParams).data;
    }

    projectWithPCA(data) {
        return this.pca.predict(data, this.pcaParams).data;
    }

    getPcaExplainedVariance() {
        return this.pca.getExplainedVariance()
            .slice(0, this.pcaParams.nComponents)
            .reduce((acc, item) => acc + item, 0)
    }

    fitUMAP(data) {
        this.umap = new UMAP(this.umapParams);
        return this.umap.fit(data);
    }

    projectWithUMAP(data) {
        return this.umap.transform(data);
    }

    static plainMarkerStyle = (numMarkers, markerSize) => {
        return {
            color: Array(numMarkers).fill("white"),
            size: Array(numMarkers).fill(markerSize),
            symbol: Array(numMarkers).fill("circle"),
            line: {
                color: "white",
                width: 1
            },
            opacity: 0.8
        }
    }

    static layout = () => {
        return {
            plot_bgcolor: 'black',
            paper_bgcolor: 'black',
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            }
        };
    }

    setTrace(trace) {
        this.trace = trace;
    }

    getTrace() {
        return this.trace;
    }

    getNumPoints() {
        return this.numPoints;
    }

    setNumPoints(numPoints) {
        this.numPoints = numPoints;
        this.markerSize = Math.max(2, 20 - Math.log2(numPoints));
    }

    getMarkerSize() {
        return this.markerSize;
    }

    setProjectionMethod(projectionMethod) {
        this.projectionMethod = projectionMethod;
    }

    getProjectionMethod() {
        return this.projectionMethod;
    }
}


export {
    Projector
};