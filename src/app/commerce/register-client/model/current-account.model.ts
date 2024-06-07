
export interface registerCurrentAccount{
    typeInterest: typeInterest;
    creditLimit: number;
    paymentDate: any;
    accountClosingDate: any;
    paymentDay: number;
    interestRate: number;
    moratoriumRate: number;
    dniClient: string;
    

}

export enum typeInterest{
    NOMINAL = "NOMINAL",
    EFECTIVO = "EFFECTIVE"

}

//la cuenta tiene que tener estos datos
/*
{
  "typeInterest": "NOMINAL",
  "creditLimit": 0,
  "paymentDate": "2024-06-07",
  "accountClosingDate": "2024-06-07",
  "paymentDay": 0,
  "interestRate": 0,
  "moratoriumRate": 0,
  "dniClient": "08133634"
}
*/ 