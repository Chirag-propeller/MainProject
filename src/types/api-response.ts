export type ApiResponse<T = unknown> = {
    success: boolean;         // true or false
    message: string;          // human-readable message
    data?: T;                 // the payload if successful
    errorCode?: string;       // for client logic or i18n
    statusCode: number;       // HTTP status code for transparency
  };
  