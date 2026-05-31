import { Request } from 'express';

export interface RequestWithRefresh extends Request {
  cookies: {
    refresh?: string;
  };
  headers: {
    'x-refresh-token'?: string;
    authorization: string;
  };
}
