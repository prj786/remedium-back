export interface UserModel {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  saleDate: Date;
  saleIncome: number;
  registerDate: Date;
}
