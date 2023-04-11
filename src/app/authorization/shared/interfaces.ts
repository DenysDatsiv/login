export interface Country {
  name: string;
}

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?:boolean;
}

export interface ForgotPasswordData
{
  email:string
}

export interface  UserData
{
  email: string,
  id: string,
  _token: string,
  _tokenExpirationDate: string
}
export  interface UserProfileData
{
  country:string;
  email:string;
  firstName:string;
  lastName:string;
}
