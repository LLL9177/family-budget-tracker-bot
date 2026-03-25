export interface IGoogleAuth {
  access_token: {
    access: string;
    refresh: string;
  };
  password?: string;
}
