import {OpenAI} from 'https://cdn.skypack.dev/openai@4.38.5?min';
import {PCA} from 'https://esm.sh/ml-pca@4.1.1';
import {UMAP} from 'https://esm.sh/umap-js@1.3.3';


const manageOpenAIApiKey = {
    async validateOpenAIApiKey(baseURL, apiKey) {
        try {
            const openai = new OpenAI({
                baseURL: baseURL,
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            });
            await openai.models.list();
            return true;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Invalid API key:', error);
                return false;
            } else {
                console.error('Error checking API key:', error);
                return false;
            }
        }
    },

    setKey(apiKey)  {
        localStorage.setItem('openai-api-key', apiKey);
    },

    getKey() {
        return localStorage.getItem('openai-api-key');
    },

    deleteKey() {
        localStorage.removeItem('openai-api-key');
    }
};


class Embedding {
    constructor(openai, modelsList) {
        // Embedding model
        this.openai = openai;
        this.modelsList = modelsList;
        this.model = '';
        this.modelDimensionRanges = {
            'text-embedding-ada-002': [1536, 1536],
            'text-embedding-3-small': [2, 1536],
            'text-embedding-3-large': [2, 3072]
        };
        this.modelDimensionDefaults = {
            'text-embedding-ada-002': 1536,
            'text-embedding-3-small': 1536,
            'text-embedding-3-large': 3072
        };
        this.dimension = this.model === '' ? 0 : this.modelDimensionDefaults[this.model];

        // Data
        this.data = [];

        // Projection method
        this.projectionMethods = ['PCA', 'UMAP'];
        this.projectionMethod = 'PCA';
    }

    static async instantiate(baseURL, apiKey) {
        const openai = new OpenAI({
            baseURL: baseURL,
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
        const modelsList = (await openai.models.list()).data.map((d) => d.id).filter((s) => s.includes("embedding")).sort();
        return new Embedding(openai, modelsList);
    }

    getModelsList() {
        return this.modelsList;
    }

    setModel(model) {
        this.model = model;
    }

    getModel() {
        return this.model;
    }

    getModelDimensionRanges(modelName) {
        return this.modelDimensionRanges[modelName];
    }

    getModelDimensionDefaults(modelName) {
        return this.modelDimensionDefaults[modelName];
    }

    getDimension() {
        return this.dimension;
    }

    setDimension(dimension) {
        this.dimension = dimension;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        this.data = data;
    }
}


export {
    manageOpenAIApiKey, Embedding
};