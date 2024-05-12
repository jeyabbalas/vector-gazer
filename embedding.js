import {OpenAI} from 'https://cdn.skypack.dev/openai@4.38.5?min';


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
        this.openai = openai;
        this.modelsList = modelsList;
        this.model = null;
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
        this.dimension = this.model ? this.modelDimensionDefaults[this.model] : 0;
    }

    static async instantiate(baseURL, apiKey) {
        const openai = new OpenAI({
            baseURL: baseURL,
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });
        const modelsList = (await openai.models.list()).data
            .map((d) => d.id)
            .filter((s) => s.includes("embedding"))
            .sort();

        return new Embedding(openai, modelsList);
    }

    async embed(texts) {
        const embedding = await this.openai.embeddings.create({
            model: this.model,
            input: texts,
            dimensions: this.dimension,
            encoding_format: "float"
        });

        return embedding.data.map((d) => d.embedding);
    }

    getModelsList() {
        return this.modelsList;
    }

    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
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
}


export {
    manageOpenAIApiKey, Embedding
};