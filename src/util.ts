export function botRequest(options: { [key: string]: any }) {
    const baseURL = 'https://order.tradao.xyz/';

    const defaultHeaders = {
        ...options.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
    };

    let url = baseURL + options.url;
    let config = {
        method: options.method,
        headers: defaultHeaders,
        body: options.data,
    };

    if (
        options.method === 'get' ||
        options.method === 'GET' ||
        options.method === 'delete' ||
        options.method === 'DELETE'
    ) {
        const params = new URLSearchParams(options.data).toString();
        url += '?' + params;
    }

    return new Promise((resolve, reject) => {
        fetch(url, config)
            .then((response) => {
                if (response.status !== 200) {
                    reject(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                throw new Error(`fetch tradao data error: ${JSON.stringify(err)}`)
                // reject(err);
            });
    });
}