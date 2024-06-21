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

export interface TransactionRequest{
    transactionAmountNotInterest: number;
    transactionAmountWithInterest: number;
    transactionType: string;
    transactionDescription: string;
    installments: number;
    installmentAmount: number;
    dniClient: string;
    productsIds: number[];

}
