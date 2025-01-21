import { IExpense } from "./expense.interface";


export interface ITrip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  expenses: IExpense[];
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'REFUNDED' | 'IN_PROCESS';
}
