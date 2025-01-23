import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import {
  fetchClients,
  registerToChat,
  fetchMessages,
  sendMessage,
  type Message,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CommunicationServerProps {
  serverId: string;
}

const COLORS = [
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
];

export const CommunicationServer = ({ serverId }: CommunicationServerProps) => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<string[]>([]);
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [newMessages, setNewMessages] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: () => registerToChat(serverId),
    onSuccess: (newClientId) => {
      setClientId(newClientId);
      toast.success("Successfully registered to chat");
    },
  });

  const fetchClientsQuery = useQuery<string[], Error>({
    queryKey: ["clients", serverId],
    queryFn: () => fetchClients(serverId),
    enabled: false, // Run manually
  });

  useEffect(() => {
    if (fetchClientsQuery.isSuccess) {
      const fetchedClients = fetchClientsQuery.data;
      setClients(fetchedClients);
      const newChats = fetchedClients.reduce<Record<string, Message[]>>(
        (acc, clientId) => ({ ...acc, [clientId]: [] }),
        {}
      );
      setChats(newChats);
    }
  }, [fetchClientsQuery.data, fetchClientsQuery.isSuccess]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (clients.length === 0) return;

      for (const id of clients) {
        try {
          const newMessages = await fetchMessages(serverId, id.replace("client", ""));
          setChats((prev) => ({
            ...prev,
            [id]: [...prev[id], ...newMessages],
          }));
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [clients, serverId]);

  const handleSend = (e: React.FormEvent, clientId: string) => {
    e.preventDefault();
    const content = newMessages[clientId]?.trim();
    if (!content) return;

    sendMessage(serverId, content, clientId.replace("client", ""))
      .then(() => {
        setNewMessages((prev) => ({ ...prev, [clientId]: "" }));
      })
      .catch((err) => {
        console.error("Error sending message:", err);
      });
  };

  if (!clientId) {
    return (
      <div className="flex justify-center">
        <Button
          onClick={() => registerMutation.mutate()}
          disabled={registerMutation.isPending}
        >
          Register to Server Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <span>Your ID: {clientId}</span>
        <Button
          onClick={() => fetchClientsQuery.refetch()}
          disabled={fetchClientsQuery.isFetching}
        >
          Fetch Registered Clients
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((id) => (
          <div
            key={id}
            className="max-w-lg bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Chat Room</h2>
              <p className="text-sm text-gray-500">Client ID: {id}</p>
            </div>

            <div className="h-[300px] overflow-y-auto p-4 space-y-4">
              {chats[id]?.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.clientId === clientId
                      ? "ml-auto bg-purple-500 text-white"
                      : `${COLORS[parseInt(msg.clientId, 36) % COLORS.length]} mr-auto`
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {msg.clientId === clientId ? "You" : `Client ${msg.clientId}`}
                  </p>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => handleSend(e, id)}
              className="p-4 border-t flex gap-2"
            >
              <Input
                value={newMessages[id] || ""}
                onChange={(e) =>
                  setNewMessages((prev) => ({
                    ...prev,
                    [id]: e.target.value,
                  }))
                }
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};
