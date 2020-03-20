export interface IErrors {
  error: string | null;
  hasError: boolean;
  setError(error: string | null): void;
}
