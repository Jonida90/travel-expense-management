export interface IUser {
    id: string;
    username: string;
    password: string;
    role: 'END_USER' | 'APPROVER' | 'FINANCE';
  }
  