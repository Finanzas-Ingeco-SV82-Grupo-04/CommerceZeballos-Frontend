export interface Transaction{
    id: number;
    transactionAmountNotInterest: number;
    transactionDescription: string;
    transactionDate: string;
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
