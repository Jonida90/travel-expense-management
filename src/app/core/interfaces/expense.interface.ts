export interface IExpense {
    id: number;
    type: 'CAR_RENTAL' | 'HOTEL' | 'FLIGHT' | 'TAXI';
    details?: any; 
  }
  