import { authInstance } from "..";

export interface Building {
  id: number;
  name: string;
  address: string;
  contact: string;
  exit: string[];
  users: User[];
  alerts: Alert[];
}

export interface User {
  id: string;
  name: string;
  password: string;
  isAdmin: boolean;
  building: Building;
}

export enum AlertType {
  DANGER,
  INFO,
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  createdAt: string;
}

export async function findAll() {
  const res = await authInstance().get<Building[]>("/building");
  return res.data;
}
