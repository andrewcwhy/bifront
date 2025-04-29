import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import FileExplorer from "../components/FileExplorer";
import Editor from "../components/Editor";

export const Route = createFileRoute("/")({
    component: App,
});

// This route is the root of the application and will be used to wrap all other routes.
function App() {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    return (
        <div className="flex h-screen">
            <aside className="w-1/4 border-r p-4 overflow-y-auto">
                <FileExplorer onSelect={setSelectedFile} />
            </aside>
            <main className="flex-1 p-6 overflow-y-auto">
                <Editor file={selectedFile} />
            </main>
        </div>
    );
}
