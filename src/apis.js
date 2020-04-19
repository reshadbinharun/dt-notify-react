import { BACKEND } from "./App";

export const makeCall = async (payload, api, method) => {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    fetch(`${BACKEND}${api}`, {
        method: method,
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(payload)
    })
    let resolvedRes = await response;
    if (resolvedRes.status === 200) {
        const resJson = await resolvedRes.json()
        return resJson;
    } else {
        return({
            error: resolvedRes.error || `Error completing ${api}`,
            status: resolvedRes.status
        });
    }
}