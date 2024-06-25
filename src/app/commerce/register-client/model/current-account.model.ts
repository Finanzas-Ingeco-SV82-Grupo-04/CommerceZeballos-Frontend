
export interface registerCurrentAccount{
    typeInterest: typeInterest;
    creditLimit: number;
    numberOfMonths: number;
    typeCredit: string;
    //paymentTerm: string;
    paymentFrequency: typeFrecuency;
    //monthlyEffectiveInterestRate: number;
    interesRate: number;
    moratoriumRate: number;
    dniClient: string;
}

export enum typeInterest{
    NOMINAL = "NOMINAL",
    EFECTIVO = "EFFECTIVE"
}

export enum typeFrecuency{
  SEMANAL = "WEEKLY",
  QUINCENAL = "BIWEEKLY"
}

export enum TypeTransactionType{
  PROXIMA_FECHA = "NEXT_CLOSES",
  CUOTAS = "INSTALLMENTS"
}

export enum TypeDescription{
  AMERICANO = "AMERICANO",
  FRANCES = "FRANCES"
}


export interface PaymentPlan {
  AmountNotInterest: number;
  transactionType: TypeTransactionType;
  Description: TypeDescription;
  dniClient: string;
  paymentFrequency: typeFrecuency;
  interestRateByPaymentFrequency: number;
  installments: number;
  amountForEachInstallmentId: Array<{ installmentId: number, amount: number }>;
}

