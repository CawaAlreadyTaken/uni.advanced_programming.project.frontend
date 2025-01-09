import { useQuery } from "@tanstack/react-query";
import { fetchServers } from "@/lib/api";
import { ServerCard } from "@/components/ServerCard";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const { data: servers, isLoading, error, refetch } = useQuery({
    queryKey: ["servers"],
    queryFn: fetchServers,
  });

  if (error) {
    toast.error("Failed to load servers");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Servers</h1>
          <Button
            onClick={() => refetch()}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white p-6 rounded-lg h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers?.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;