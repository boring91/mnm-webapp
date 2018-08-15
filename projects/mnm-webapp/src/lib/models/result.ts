export interface Result<T> {
  success: Number;
  code: Number;
  messages: string[];
  extra: T;
}
