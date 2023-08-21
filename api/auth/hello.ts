import { authInstance } from "..";

export async function hello() {
  return await authInstance().get("/auth");
}
