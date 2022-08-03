export interface IRegister {
  email: string;
  username: string;
  password: string;
}
export interface ILogin {
  username: string;
  password: string;
}
export interface IToken {
  accessToken: string;
}

export interface IUser {
  _id: string;
  username: string;
}
