export interface UserModel {
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  saleIncome: number;
  registerDate: Date;
}

export interface UserListModel {
  username: string;
  firstName?: string;
  lastName?: string;
  saleIncome: number;
  registerDate: Date;
}
