export interface CurrentAccount {
    id: number;
    typeInterest: string;
    creditLimit: number;
    usedCredit: number;
    openingDate: string;
    accountClosingDate: string;
    interestRate: number;
    moratoriumRate: number;
    dniClient: string;
}

/*
"data": {
    "id": 2,
    "typeInterest": "EFFECTIVE",
    "creditLimit": 21,
    "paymentDate": "2024-07-12",
    "openingDate": "2024-06-07T16:58:31.20919",
    "paymentDay": 12,
    "accountClosingDate": "2024-07-12",
    "interestRate": 2,
    "moratoriumRate": 12,
    "dniClient": "72555741"
  }
*/ 