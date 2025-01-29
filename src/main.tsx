import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const nodeId = import.meta.env.VITE_NODE_ID;

document.title = `Dr. Ones - Client ${nodeId || ""}`;

createRoot(document.getElementById("root")!).render(<App />);
