import { replaceSpecialStrings } from "./mensaService";

/**
 * Set live to true to use the real API. Otherwise a random kanye quote is used.
 */
export async function sendMessage(msg: string, live: boolean): Promise<string> {
    if (live) {
        return sendMessageLive(msg)
    }
    return sendMessageDummy()
}

export async function sendMessageDummy(): Promise<string> {
    try {
        const resp = await fetch("https://api.kanye.rest/");
        const respBody: { quote: string } = await resp.json();
        return respBody.quote;
    } catch (e) {
        console.log(e);
        return "error"
    }
}

/**
 * Sends a request to the chatbot backend.
 * @param msg
 */
export async function sendMessageLive(msg: string): Promise<string> {
    try {
        const resp = await fetch("http://localhost:8000/get_answer/", {
            body: JSON.stringify({frage: msg}),
            method: 'POST',
            headers: {"content-type": "application/json"}
        });
        const respBody: BotResponse = await resp.json();
        return replaceSpecialStrings(respBody.antwort);
    } catch (e) {
        console.log(e);
        return "error"
    }
}

interface BotResponse {
    antwort: string
}
