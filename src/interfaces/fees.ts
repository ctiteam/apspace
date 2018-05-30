export interface FeesBankDraft {
  AMOUNT_COLLECTED: number;
  BANKDRAFT_AMOUNT: number;
  BANKDRAFT_DUE_DATE: string;
  BANKDRAFT_NO: string;
  COURSE_CODE_ALIAS: string;
  DATE_COLLECTED: string;
  REGISTRATION_DATE: string;
  STUDENT_NUMBER: string;
}

export interface FeesDetails {
  AMOUNT_PAYABLE: number;
  DUE_DATE: string;
  ITEM_DESCRIPTION: string;
  NAME: string;
  OUTSTANDING: number;
  STUDENT_NUMBER: string;
  TOTAL_COLLECTED: number;
}

export interface FeesSummary {
  INVOICE_DESCRIPTION: string;
  INVOICE_NO: string;
  NAME: string;
  PAYABLE_AMOUNT: number;
  PAYMENT_DUE_DATE: string;
  STUDENT_NUMBER: string;
  TOTAL_COLLECTED: number;
}

export interface FeesTotalSummary {
  STUDENT_NUMBER: string;
  TOTAL_FINE: number;
  TOTAL_OUTSTANDING: number;
  TOTAL_PAID: number;
  TOTAL_PAYABLE: number;
}
