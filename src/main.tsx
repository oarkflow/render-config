import React from "react";
import ReactDOM from "react-dom/client";
import WebBuilder from "./web/NewBuilder";
// import WebBuilder from "./web/WebBuilder.js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WebBuilder
     initialData={{
      content: [],
    }}
    onPublish={(data: unknown) => {
      console.log(data);
    }}
    onPreview={(data: unknown) => {
      console.log(data);
    }}
      
    />
  </React.StrictMode>
);
