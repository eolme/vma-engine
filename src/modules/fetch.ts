export declare interface UnaxiosResponse {
  data?: any,
  status: number,
  request: XMLHttpRequest
}

export declare interface UnaxiosError<T = any> extends Error {
  request: XMLHttpRequest,
  response?: T
}

export declare type UnaxiosMethod =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';

export declare interface UnaxiosConfig {
  baseURL?: string,
  method?: UnaxiosMethod,
  headers?: {
    [key: string]: string
  }
}

export declare interface UnaxiosOptions extends UnaxiosConfig {
  url?: string,
  body?: Blob | FormData | URLSearchParams | string | null
}

export declare interface Unaxios {
  (options: UnaxiosOptions): Promise<UnaxiosResponse>,
  config: UnaxiosConfig,
  get(url?: string): Promise<UnaxiosResponse>,
  post(url?: string, body?: object | any[]): Promise<UnaxiosResponse>
}

const isAbsoluteURL = (url: string) => {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

const combineURLs = (baseURL: string, relativeURL?: string) => {
  return relativeURL ?
    baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') :
    baseURL;
};

const buildFullPath = (baseURL?: string, requestedURL: string = '') => {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

const unaxios: Unaxios = (options) => {
  return new Promise((resolve, reject) => {
    const method = options.method ?? unaxios.config.method;
    const url = buildFullPath(options.baseURL ?? unaxios.config.baseURL, options.url);

    const request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open(method, url, true);

    const abort = () => {
      const error = new Error('NetworkError') as UnaxiosError;
      error.request = request;
      error.response = request.response;
      reject(error);
    };
    request.onerror = abort;
    request.onabort = abort;
    request.ontimeout = abort;

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        const status = request.status;
        if (status >= 200 && status < 300) {
          resolve({
            data: request.response,
            status: request.status,
            request
          });
        } else {
          abort();
        }
      }
    };

    const headers = { ...unaxios.config.headers, ...options.headers };
    for (const i in headers) {
      request.setRequestHeader(i, headers[i]);
    }

    request.send(options.body || null);
  });
};

unaxios.config = {
  method: 'get',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

unaxios.get = (url) => unaxios({
  url,
  method: 'get'
});

unaxios.post = (url, body) => unaxios({
  url,
  method: 'post',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json'
  }
});

export {
  unaxios,
  unaxios as default
};
