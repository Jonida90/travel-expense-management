export interface IExpense {
    id: Number;
    type: 'CAR_RENTAL' | 'HOTEL' | 'FLIGHT' | 'TAXI';
    details?: any; // Use specific types or interfaces for more detail
  }
  