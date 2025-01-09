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

// Mock data
const MOCK_SERVERS: Server[] = [
  { id: "server1", type: "Content" },
  { id: "server2", type: "Communication" },
  { id: "server3", type: "Unknown" },
];

const MOCK_FILES = ["image1.jpg", "photo2.png", "picture3.jpg"];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchServers = async (): Promise<Server[]> => {
  // const response = await fetch(`${API_BASE_URL}/servers`);
  // if (!response.ok) throw new Error("Failed to fetch servers");
  // return response.json();
  await delay(1000);
  return MOCK_SERVERS;
};

export const fetchFilesList = async (serverId: string): Promise<string[]> => {
  // const response = await fetch(`${API_BASE_URL}/files_list?server_id=${serverId}`);
  // if (!response.ok) throw new Error("Failed to fetch files");
  // return response.json();
  await delay(1000);
  return MOCK_FILES;
};

export const fetchFile = async (serverId: string, filename: string): Promise<string> => {
  // const response = await fetch(`${API_BASE_URL}/file?server_id=${serverId}&filename=${filename}`);
  // if (!response.ok) throw new Error("Failed to fetch file");
  // return response.json();
  await delay(1000);
  return "https://picsum.photos/400/300"; // Random placeholder image
};

export const registerToChat = async (serverId: string): Promise<string> => {
  // const response = await fetch(`${API_BASE_URL}/register?server_id=${serverId}`, {
  //   method: "POST",
  // });
  // if (!response.ok) throw new Error("Failed to register");
  // return response.json();
  await delay(1000);
  return "client" + Math.random().toString(36).substring(7);
};

export const fetchClients = async (serverId: string): Promise<string[]> => {
  // const response = await fetch(`${API_BASE_URL}/clients?server_id=${serverId}`);
  // if (!response.ok) throw new Error("Failed to fetch clients");
  // return response.json();
  await delay(1000);
  return ["client1", "client2", "client3"];
};

export const fetchMessages = async (serverId: string, clientId: string): Promise<Message[]> => {
  // const response = await fetch(`${API_BASE_URL}/messages?server_id=${serverId}&client=${clientId}`);
  // if (!response.ok) throw new Error("Failed to fetch messages");
  // return response.json();
  await delay(1000);
  return [
    {
      clientId,
      content: "Hello from " + clientId,
      timestamp: new Date().toISOString(),
    },
  ];
};

export const sendMessage = async (serverId: string, content: string): Promise<void> => {
  // const response = await fetch(`${API_BASE_URL}/messages?server_id=${serverId}`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ content }),
  // });
  // if (!response.ok) throw new Error("Failed to send message");
  await delay(1000);
};