import { Server } from "@/lib/api";
import { ImageIcon, MessageSquare, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface ServerCardProps {
  server: Server;
}

export const ServerCard = ({ server }: ServerCardProps) => {
  const getIcon = () => {
    switch (server.type) {
      case "Content":
        return <ImageIcon className="w-12 h-12 text-purple-500" />;
      case "Communication":
        return <MessageSquare className="w-12 h-12 text-blue-500" />;
      default:
        return <HelpCircle className="w-12 h-12 text-gray-400" />;
    }
  };

  if (server.type === "Unknown") {
    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-md transition-all duration-300 opacity-50 cursor-not-allowed">
        <div className="flex flex-col items-center space-y-4">
          {getIcon()}
          <h3 className="text-xl font-semibold text-gray-400">Server {server.id}</h3>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/server/${server.id}`}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col items-center space-y-4">
        {getIcon()}
        <h3 className="text-xl font-semibold text-gray-800">Server {server.id}</h3>
      </div>
    </Link>
  );
};