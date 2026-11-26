"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export default function AboutUsGhlChatWidget() {
  useEffect(() => {
    return () => {
      // Clean up chat widget when navigating away from /aboutus
      const widgets = document.querySelectorAll("chat-widget");
      widgets.forEach((w) => w.remove());
    };
  }, []);

  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id="6b05948d10f9c20b4d4bbf4b"
      data-position="bottom-left"
      data-widget-placement="left"
      strategy="afterInteractive"
    />
  );
}
