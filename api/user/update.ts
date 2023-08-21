import { authInstance } from "..";

type Request = {
  building: string | null;
};

export async function update(id: string, payload: Request) {
  const res = await authInstance().put(`/user/${id}`, payload);
  return res.data;
}
