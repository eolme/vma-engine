import originalBridge, {
  VKBridge,
  ErrorData,
  AnyRequestMethodName,
  AnyReceiveMethodName,
  RequestProps,
  RequestIdProp,
  ReceiveData,
  ReceiveDataMap
} from '@vkontakte/vk-bridge';

type EnhancedReceiveDataMap = {
  [M in keyof ReceiveDataMap]: Omit<ReceiveDataMap[M], 'result'> & {
    result: boolean;
  };
};
type EnhancedReceiveData<M extends AnyReceiveMethodName> = EnhancedReceiveDataMap[M];

type EnhancedVKBridgeSend =
  <K extends AnyRequestMethodName>(method: K, props?: RequestProps<K> & RequestIdProp | {}) =>
    Promise<K extends AnyReceiveMethodName ? EnhancedReceiveData<K> : never>;
type PartialEnhancedVKBridgeSend =
  <K extends AnyRequestMethodName>(method: K, props?: RequestProps<K> & RequestIdProp | {}) =>
    Promise<K extends AnyReceiveMethodName ? Partial<EnhancedReceiveData<K>> : never>;

export interface EnhancedVKBridge extends Omit<VKBridge, 'send' | 'sendPromise'> {
  /**
  * Sends an event to the runtime env and returns the Promise object with
  * response data. In the case of Android/iOS application env is the
  * application itself. In the case of the browser, the parent frame in which
  * the event handlers is located.
  *
  * @param method The method (event) name to send.
  * @param [props] Method properties.
  * @returns The Promise object with response data.
  */
  send: EnhancedVKBridgeSend;
}

const USER_DENIED: ErrorData = {
  error_type: 'client_error',
  error_data: {
    error_code: 4,
    error_reason: 'User denied'
  }
};

const UNSUPPORTED_PLATFORM: ErrorData = {
  error_type: 'client_error',
  error_data: {
    error_code: 6,
    error_reason: 'Unsupported platform'
  }
};

const enhancedIsWebView = originalBridge.isWebView.bind(originalBridge);

const enhancedSubscribe = originalBridge.subscribe.bind(originalBridge);
const enhancedUnsubscribe = originalBridge.unsubscribe.bind(originalBridge);

const enhancedSend = originalBridge.send.bind(originalBridge) as PartialEnhancedVKBridgeSend;

const bridge: EnhancedVKBridge = {
  isWebView: enhancedIsWebView,

  subscribe: enhancedSubscribe,
  unsubscribe: enhancedUnsubscribe,

  send: (name, props = {}) => {
    if (!bridge.supports(name)) {
      return Promise.reject(UNSUPPORTED_PLATFORM);
    }

    return enhancedSend(name, props as any).then((data) => {
      if (name === 'VKWebAppGetAuthToken') {
        const params = props as Partial<RequestProps<'VKWebAppGetAuthToken'>>;
        const payload = data as Partial<ReceiveData<'VKWebAppGetAuthToken'>>;

        if ('scope' in props && 'scope' in payload) {
          if (params.scope !== payload.scope) {
            throw USER_DENIED;
          }
        }
      }

      if (!('result' in data)) {
        data.result = true;
      }

      return data as any;
    }).catch((error) => {
      if (error && error.error_data) {
        const code = Number(error.error_data.error_code ?? error.error_data.error);

        if (code === 4 || code === 9) {
          if ('request_id' in error) {
            return { result: false, request_id: error.request_id };
          }
          return { result: false };
        }
      }

      throw error;
    });
  },

  supports: (method) => {
    if (!originalBridge.isWebView() && (window.parent === window)) {
      return false;
    }
    return originalBridge.supports(method);
  }
};

export {
  bridge,
  bridge as default
};
