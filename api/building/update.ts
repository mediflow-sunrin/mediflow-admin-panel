import { authInstance } from "..";
import { Building } from "./findAll";

type Request = Partial<Omit<Building, "id">>;

export async function update(id: string, payload: Request) {
  return await authInstance().put(`/building/${id}`, payload);
}
