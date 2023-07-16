import { TIMEOUT_SEC } from "./config";


const settimeout = (s) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('response time is too long'));
        }, s*1000);
    });
}

export const getJSON = async (url) => {
    try {
        const response = fetch(url);
        const result = await Promise.race([response, settimeout(TIMEOUT_SEC)]);
        const data = await result.json();

        if(!result.ok){
            throw new Error(`${data.message} (${result.status})`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export const sendJSON = async (url, uploadData) => {
    try {
        const response = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData)
        });
        const result = await Promise.race([response, settimeout(TIMEOUT_SEC)]);
        const data = await result.json();

        if(!result.ok){
            throw new Error(`${data.message} (${result.status})`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}