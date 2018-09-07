export interface Result<T = any> {
  success: Number;
  code: Number;
  messages: string[];
  extra: T;
}
