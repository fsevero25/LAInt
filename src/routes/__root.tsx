import React from "react";
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LAInt — Análise de Campanhas META" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="pt-BR">
      <head>
        <Meta />
      </head>
      <body>
        <Outlet />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1c2025",
              color: "#f5f5f5",
              border: "1px solid #2a2e34",
            },
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
