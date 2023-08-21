import EventEmitter from "events";
import io from "socket.io-client";
import { Alert, AlertType } from "../building/findAll";

export const socket = io("http://localhost:3000");
socket.connect();

socket.on("connect", () => {
  // console.log("connected!");
});

export function createAlert(data: CreateAlertDto) {
  socket.emit("createAlert", data);
}

export function subscribeToAlerts(
  callback: (data: Alert & { buildingId: string }) => void
) {
  socket.on(`alert-web`, callback);
}

export function unsubscribeToAlerts(
  callback: (data: Alert & { buildingId: string }) => void
) {
  socket.off(`alert-web`, callback);
}

export interface CreateAlertDto {
  type: AlertType;
  title: string;
  message: string;
  buildingId: string;
}
