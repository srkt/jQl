import { ITransformer } from './ITransformer';

export interface IResult<T> {
  get Results(): T[];
  get Result(): T;
}

export type ObjectLiteral = { [key: string]: string };

export type CommonKeys<A, B> = keyof A & keyof B;
export type ExtractorMethodReturnType<T> = IJoinExtractor<T> &
  IJoinExtractorAsync<T> &
  ITransformer<T>;

export interface IJoinExtractor<T> extends IResult<T> {
  Join<Tinner>(
    inner: Array<Tinner>,
    predicate: (outer: T, inner: Tinner) => boolean
  ): ExtractorMethodReturnType<T>;
}
export interface IJoinExtractorAsync<T> extends IResult<T> {
  JoinAsync<Tinner>(
    inner: string,
    predicate: (outer: T, inner: Tinner) => boolean
  ): Promise<ExtractorMethodReturnType<T>>;
}

export interface IExtractor<T> extends IResult<T> {
  From(args: Array<T> | string): ExtractorMethodReturnType<T>;
}
export interface IExtractorAsync<T> extends IResult<T> {
  FromAsync(url: string): Promise<ExtractorMethodReturnType<T>>;
}

export interface IPromiseResolver<T> {
  TryResolve(
    promise: Promise<T>,
    successCallback: (data: any) => any,
    failureCallback?: (reason: any) => any
  ): T;
}
