import { IExpense } from "./expense.interface";


export interface ITrip {
  id: string;
  name: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  expenses: IExpense[];
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'REFUNDED' | 'IN_PROCESS';
  approverNotes?: string;
  userId?: any;
}
