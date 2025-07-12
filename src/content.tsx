import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Content from "./content/index";

const root = document.createElement('div');
root.id = 'search-ai-container';
document.body.append(root);

createRoot(root).render(
    <StrictMode>
        <Content />
    </StrictMode>
);