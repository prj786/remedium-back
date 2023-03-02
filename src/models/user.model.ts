export interface UserModel {
  _id?: any;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  saleIncome: number;
  registerDate: Date;
}

export interface UserListModel {
  _id?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  saleIncome: number;
  registerDate: Date;
}
