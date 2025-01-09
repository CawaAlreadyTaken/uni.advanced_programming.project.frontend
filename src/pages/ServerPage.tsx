import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchServers } from "@/lib/api";
import { ContentServer } from "@/components/ContentServer";
import { CommunicationServer } from "@/components/CommunicationServer";
import { toast } from "sonner";

const ServerPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: servers, isLoading, error } = useQuery({
    queryKey: ["servers"],
    queryFn: fetchServers,
  });

  if (isLoading) {
    return <div className="animate-pulse bg-white p-6 rounded-lg h-40" />;
  }

  if (error) {
    toast.error("Failed to load server information");
    return null;
  }

  const server = servers?.find((s) => s.id === id);
  if (!server) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Server {id}</h1>
        {server.type === "Content" ? (
          <ContentServer serverId={id} />
        ) : server.type === "Communication" ? (
          <CommunicationServer serverId={id} />
        ) : null}
      </div>
    </div>
  );
};

export default ServerPage;