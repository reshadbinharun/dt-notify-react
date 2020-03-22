const makeCall = async (payload, api, method) => {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    fetch(`${BACKEND}${api}`, {
        method: method,
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(payload)
    }).then(async res => {
        let resolvedRes = await res;
        return new Promise((resolve, reject) => {
            if (resolvedRes.status == 200) {
                resJson = await resolvedRes.json()
                return resolve(resJson);
            } else {
                return reject({
                    error: resolvedRes.error || `Error completing ${api}`,
                    status: resolvedRes.status
                });
            }
        });
    });
}