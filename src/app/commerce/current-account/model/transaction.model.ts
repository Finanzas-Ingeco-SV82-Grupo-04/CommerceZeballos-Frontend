export interface Transaction{
    id: number;
    transactionAmountNotInterest: number;
    transactionAmountWithInterest: number;
    transactionType: string;
    transactionDescription: string;
    transactionDate: string;
    installments: number;
    installmentAmount: number;
    currentAccountId: number;
    productIds: number[];

}

/*
 "data": [
    {
      "id": 1,
      "transactionAmountNotInterest": 100,
      "transactionAmountWithInterest": 123,
      "transactionType": "PROXIMA_FECHA",
      "transactionDescription": "string",
      "installments": 2,
      "installmentAmount": 12,
      "currentAccountId": 1,
      "productIds": [
        1
      ]
    },
*/