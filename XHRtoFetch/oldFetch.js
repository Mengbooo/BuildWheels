function oldFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', url) //隐式地默认为异步

        //自定义一下请求头,下面是jsinfo的一个示例代码，我们应该循环设置
        // xhr.setRequestHeader('Content-Type', 'application/json');
        if (options.headers) {
            for (const key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
        };

        //发送请求体
        if (options.body) {
            xhr.send(JSON.stringify(options.body));
        } else {
            xhr.send();
        };

        //处理
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({
                    ok: true,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    json: () => Promise.resolve(JSON.parse(xhr.responseText)),
                    text: () => Promise.resolve(xhr.responseText),
                    blob: () => Promise.resolve(new Blob([xhr.response])),// 应该是这么写
                    arrayBuffer: () => Promise.resolve(xhr.response),
                });
            } else {
                reject({
                    ok: false,
                    status: xhr.status,
                    statusText: xhr.statusText,
                });
            }
        };

        // 错误处理
        xhr.onerror = () => {
            reject({
                ok: false,
                status: xhr.status, //应该是undefined，这里的错误处理是请求错误，未发生而导致的一个错误
                statusText: xhr.statusText,
            });
        };
    })
};

//这里是的随便写的一个url，实际上会导致CORS问题，因为目前还是file协议，之后学了node之后再启动一下http

oldFetch('./api/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: {
        name: 'Mengbooo',
        age: 114514,
    },
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });