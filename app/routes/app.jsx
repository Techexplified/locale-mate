import { useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  useRouteError,
} from "react-router";

import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
  };
};

export default function App() {
  const { apiKey } = useLoaderData();

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shop = urlParams.get("shop");
      const host = urlParams.get("host");
      if (shop) {
        sessionStorage.setItem("localemate_shop", shop);
        localStorage.setItem("localemate_shop", shop);
        document.cookie = `localemate_shop=${encodeURIComponent(shop)}; path=/; SameSite=None; Secure; max-age=31536000`;
      }
      if (host) {
        sessionStorage.setItem("localemate_host", host);
        localStorage.setItem("localemate_host", host);
        document.cookie = `localemate_host=${encodeURIComponent(host)}; path=/; SameSite=None; Secure; max-age=31536000`;
      }
    } catch (e) {
      console.warn("[LocaleMate] Failed to write to storage/cookies:", e);
    }
  }, []);

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Dashboard</s-link>
        <s-link href="/app/campaigns">Campaigns</s-link>
        <s-link href="/app/suggestions">Suggestions</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
