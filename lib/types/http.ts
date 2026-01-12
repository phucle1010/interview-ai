export interface HttpResponse<T> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}
