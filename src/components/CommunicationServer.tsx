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
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: clients } = useQuery({
    queryKey: ["clients", serverId],
    queryFn: () => fetchClients(serverId),
    enabled: !!clientId,
    refetchInterval: 2000,
  });

  const registerMutation = useMutation({
    mutationFn: () => registerToChat(serverId),
    onSuccess: (newClientId) => {
      setClientId(newClientId);
      toast.success("Successfully registered to chat");
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendMessage(serverId, content),
    onSuccess: () => {
      setNewMessage("");
    },
  });

  useEffect(() => {
    if (!clientId || !clients) return;

    const interval = setInterval(async () => {
      try {
        for (const otherId of clients) {
          if (otherId === clientId) continue;
          const newMessages = await fetchMessages(serverId, otherId);
          setMessages((prev) => [...prev, ...newMessages]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [clientId, clients, serverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  if (!clientId) {
    return (
      <div className="flex justify-center">
        <Button
          onClick={() => registerMutation.mutate()}
          disabled={registerMutation.isPending}
        >
          Register to Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat Room</h2>
        <p className="text-sm text-gray-500">Your ID: {clientId}</p>
      </div>

      <div className="h-[500px] overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
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
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" disabled={sendMessageMutation.isPending}>
          Send
        </Button>
      </form>
    </div>
  );
};