import {
  CommonKeys,
  ExtractorMethodReturnType,
  IExtractor,
  IExtractorAsync,
  IJoinExtractor,
  IJoinExtractorAsync,
  ObjectLiteral,
  IResult,
} from './IExtractor';
import { ITransformer } from './ITransformer';

export class JqlOptions {
  httpService!: (url: string) => Promise<any>;
  constructor() {}
}

class _jQl<T>
  implements
    IExtractor<T>,
    ITransformer<T>,
    IExtractorAsync<T>,
    IJoinExtractor<T>,
    IJoinExtractorAsync<T>
{
  /**
   *
   */
  private _options: JqlOptions = new JqlOptions();
  private _data: any[] = [];
  private _pristineData: T[] = [];

  private get _global() {
    try {
      return window;
    } catch (error) {
      return {};
    }
  }

  constructor(options?: JqlOptions) {
    Object.assign(this._options, options);
  }

  setOptions(options: JqlOptions): ExtractorMethodReturnType<T> {
    Object.assign(this._options, options);
    return this;
  }

  get Result(): T {
    return this.Results[0];
  }
  get Results(): T[] {
    return Array.from(this._data);
  }
  async JoinAsync<Tinner>(
    inner: string,
    predicate: (outer: T, inner: Tinner) => boolean
  ): Promise<ExtractorMethodReturnType<T>> {
    const innerData = await FromAsync<Tinner>(inner, this._options);
    return this.Join<Tinner>(innerData.Results, predicate);
  }

  Join<Tinner>(
    inner: Array<Tinner>,
    predicate: (outer: T, inner: Tinner) => boolean
  ): ExtractorMethodReturnType<T> {
    const rightQuery = From(inner);
    const rightResults = rightQuery.Results;
    const leftResults = this.Results;
    const isLeftSmaller = leftResults.length < rightResults.length;
    const result: (T & Tinner)[] = [];

    if (isLeftSmaller) {
      leftResults.forEach((l: T) => {
        rightResults.forEach((r: Tinner) => {
          if (predicate(l, r)) {
            result.push(Object.assign({}, l, r));
          }
        });
      });
    } else {
      rightResults.forEach((r) => {
        leftResults.forEach((l) => {
          if (predicate(l, r)) {
            result.push(Object.assign({}, l, r));
          }
        });
      });
    }

    this._data = result;
    return this;
  }

  private static getProxyHandler = (...args: any[]) => {
    return {
      get(target: any, prop: any, receiver: any) {
        if (!args.includes(prop)) {
          delete target[prop];
        }
        return target[prop];
      },
    };
  };

  Select(...args: (keyof T)[]): ITransformer<T> & IResult<T> {
    const handler = _jQl.getProxyHandler(...args);
    const data = this._data.map((t) => new Proxy(t, handler));
    this._data = data;
    return this;
  }
  GroupBy(...keys: (keyof T)[]): ITransformer<T> {
    throw new Error('Method not implemented.');
  }

  GroupByTest(
    aggregateFns: ((k: T) => number)[],
    keys?: (keyof T)[]
  ): ITransformer<T> {
    throw new Error('Method not implemented.');
  }

  Having(
    predicate: (value: T, index: number, array: T[]) => boolean
  ): ITransformer<T> {
    throw new Error('Method not implemented.');
  }

  Where(
    predicate: (value: T, index: number, array: T[]) => boolean
  ): ExtractorMethodReturnType<T> & IResult<T> {
    if (!this._data.length) {
      return this;
    }
    this._data = this._data.filter(predicate);
    return this;
  }

  private static ValidateInput<T>(args: T[] | string): 'string' | 'array' {
    if (typeof args !== 'string' && !Array.isArray(args)) {
      throw new Error(
        'Invalid arguments passed only supported string and array'
      );
    }

    const arg_type: 'string' | 'array' = Array.isArray(args)
      ? 'array'
      : 'string';

    return arg_type;
  }

  async FromAsync(url: string): Promise<ExtractorMethodReturnType<T>> {
    return await this._options
      .httpService(url)
      .then((data) => {
        return (data.json && data.json()) || data;
      })
      .then((data: T[]) => {
        this._data = data;
      })
      .then(() => {
        return this;
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  From(args: T[] | string): ExtractorMethodReturnType<T> {
    const arg_type = _jQl.ValidateInput(args);

    if (arg_type === 'string') {
    } else {
      this._data = args as T[];
    }
    return this;
  }
}

export const jQl = <T>(options?: any) => {
  const jql = new _jQl<T>(options);
  return { From: jql.From, FromAsync: jql.FromAsync };
};

export const From = <T>(args: string | T[], options?: JqlOptions) => {
  return new _jQl<T>(options).From(args);
};

export const FromAsync = <T>(args: string, options?: JqlOptions) => {
  return new _jQl<T>(options).FromAsync(args);
};
