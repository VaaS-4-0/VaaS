export interface IUser {
  _id?: string | undefined;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  refreshRate?: number;
  darkMode?: boolean;
  __v?: number;
  clusters?: string[];
}
