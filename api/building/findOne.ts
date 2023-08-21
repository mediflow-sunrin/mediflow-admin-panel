import { authInstance } from "..";

export async function findOne(buildingId: string) {
  return await authInstance().get(`/building/${buildingId}`);
}
