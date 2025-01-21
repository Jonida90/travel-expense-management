export interface IExpense {
    id: string;
    type: 'CAR_RENTAL' | 'HOTEL' | 'FLIGHT' | 'TAXI';
    details: any; // Use specific types or interfaces for more detail
    totalPrice: number;
  }
  