export enum Roles {
  user = 'user',
  admin = 'admin',
}

export type ReturningData = {
  id: string;
  login: string;
  avatar: string | null;
  role: Roles;
  token: string;
};

export type RequestingData = {
  id: string;
  login: string;
  avatar: string;
  role: Roles;
};
