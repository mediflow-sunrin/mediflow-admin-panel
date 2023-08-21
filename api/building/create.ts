import { authInstance } from "..";

type Request = {
  name: string;
  address: string;
  contact: string;
  exit: string[];
};

export async function create(payload: Request) {
  return await authInstance().post("/building", payload);
}
