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
        this.model = '';
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
}


export {
    manageOpenAIApiKey, Embedding
};