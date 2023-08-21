import { apiInstance } from "..";

export async function uploadImage(file: FormData) {
  return await apiInstance(false).post("https://cdn.plebea.com/upload", file);
}
