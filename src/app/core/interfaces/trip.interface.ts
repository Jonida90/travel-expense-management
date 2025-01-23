import { IExpense } from "./expense.interface";


export interface ITrip {
  id: string;
  name: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  expenses: IExpense[];
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'REFUNDED' | 'PROCESS';
  notes?: string;
  userCreatorId?: any;
  approverId?: any;
  financeId?: any;
}
