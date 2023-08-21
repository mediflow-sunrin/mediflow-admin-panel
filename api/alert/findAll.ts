import { authInstance } from "..";

export async function findAll(buildingId: number) {
  const res = await authInstance().get(`/alert?id=${buildingId}`);
  return res.data;
}
