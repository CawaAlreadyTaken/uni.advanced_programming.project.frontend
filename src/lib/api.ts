import { API_BASE_URL } from "@/config/env";

export type ServerType = "Content" | "Communication" | "Unknown";

export interface Server {
  id: string;
  type: ServerType;
}

export interface Message {
  clientId: string;
  content: string;
  timestamp: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchServers = async (): Promise<Server[]> => {
  await fetch(`${API_BASE_URL}/obtain_servers`, {method: "POST"});
  await delay(1000);
  const response = await fetch(`${API_BASE_URL}/servers`);
  if (!response.ok) throw new Error("Failed to fetch servers");
  return response.json();
};

export const fetchFilesList = async (serverId: string): Promise<string[]> => {
  await fetch(`${API_BASE_URL}/obtain_files_list?server_id=${serverId}`, {method: "POST"});
  await delay(1000);
  const response = await fetch(`${API_BASE_URL}/files_list?server_id=${serverId}`);
  if (!response.ok) throw new Error("Failed to fetch files");
  return response.json();
};

export const fetchFile = async (serverId: string, filename: string): Promise<string> => {
  await fetch(`${API_BASE_URL}/obtain_file?server_id=${serverId}&filename=${filename}`, {method: "POST"});
  const response = await fetch(`${API_BASE_URL}/file?server_id=${serverId}&filename=${filename}`);
  if (!response.ok) throw new Error("Failed to fetch file");

  const b64image = (await response.json())["image"];
  const blob = new Blob([Uint8Array.from(atob(b64image), c => c.charCodeAt(0))], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};

export const registerToChat = async (serverId: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/register?server_id=${serverId}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to register");
  const client = "client"+(await response.json())["client"];
  return client;
};

export const fetchClients = async (serverId: string): Promise<string[]> => {
  await fetch(`${API_BASE_URL}/obtain_clients?server_id=${serverId}`, {method: "POST"});
  const response = await fetch(`${API_BASE_URL}/clients?server_id=${serverId}`);
  if (!response.ok) throw new Error("Failed to fetch clients");
  return response.json();
};

export const fetchMessages = async (serverId: string, clientId: string): Promise<Message[]> => {
  const response = await fetch(`${API_BASE_URL}/messages?server_id=${serverId}&client_id=${clientId}`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

export const sendMessage = async (serverId: string, content: string, clientId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/send_messages?server_id=${serverId}&client_id=${clientId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Failed to send message");
};