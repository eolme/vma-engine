import { useRequest } from 'ahooks';
import type { BaseResult, BaseOptions } from '@ahooksjs/use-request/lib/types';
import fetch from '../modules/fetch';

const useFetch = () => {
  return fetch;
};

const useStateFetch = <R = any, P extends any[] = any>(url: string, options: BaseOptions<R, P> = {}) => {
  return useRequest(() => {
    return fetch.get(url).then((response) => response.data);
  }, options as any) as any as BaseResult<R, P>;
};

export {
  useFetch,
  useStateFetch,
  useRequest
};
