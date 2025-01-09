import { useQuery } from "@tanstack/react-query";
import { fetchFilesList, fetchFile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ContentServerProps {
  serverId: string;
}

export const ContentServer = ({ serverId }: ContentServerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { data: files, refetch, isLoading } = useQuery({
    queryKey: ["files", serverId],
    queryFn: () => fetchFilesList(serverId),
    enabled: false,
  });

  const { data: fileContent } = useQuery({
    queryKey: ["file", serverId, selectedFile],
    queryFn: () => selectedFile ? fetchFile(serverId, selectedFile) : null,
    enabled: !!selectedFile,
  });

  return (
    <div className="space-y-8">
      <div>
        <Button
          onClick={() => refetch()}
          disabled={isLoading}
        >
          Get Files List
        </Button>
      </div>

      {files && files.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className="text-left p-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                {file}
              </button>
            ))}
          </div>
        </div>
      )}

      {fileContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedFile}</h3>
              <Button variant="ghost" onClick={() => setSelectedFile(null)}>
                Close
              </Button>
            </div>
            <img
              src={fileContent}
              alt={selectedFile || ""}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};