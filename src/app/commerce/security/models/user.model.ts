export interface signInRequest{
    email:string;
    password:string;
}


export interface userSignInResponse{
    Message:string;
    token:string; 
}


export interface registerClient{
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    dni:string;
    phone:string;
}
