import { AxiosError } from "axios";
import { apiInstance } from "..";

type Request = {
  id: string;
  password: string;
};

interface User {
  id: string;
  name: string;
  password: string;
  isAdmin: boolean;
}

export async function login(payload: Request) {
  const res = await apiInstance().post<User & { token: string }>(
    "/auth/login",
    payload
  );

  if (res.status === 401) return res;
  if (res.status === 200 && !res.data.isAdmin)
    return {
      status: 401,
      message: "You are not admin",
    };

  localStorage.setItem("token", res.data.token);
  return res;
}
