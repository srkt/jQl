import {
  IExtractor,
  ObjectLiteral,
  IResult,
  ExtractorMethodReturnType,
} from './IExtractor';

export interface ITransformer<T> {
  Where(
    predicate: (value: T, index: number, array: T[]) => boolean
  ): ExtractorMethodReturnType<T> & IResult<T>;
  Select(...args: (keyof T)[]): ITransformer<T> & IResult<T>;
  GroupBy(...keys: (keyof T)[]): ITransformer<T>;
  GroupByTest(
    aggregateColumns: ((k: T) => any)[],
    keys?: (keyof T)[]
  ): ITransformer<T>;
  Having(
    predicate: (value: T, index: number, array: T[]) => boolean
  ): ITransformer<T>;
}
