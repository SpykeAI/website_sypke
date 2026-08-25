"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalEmbed({ link }: { link: string }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#00DF81" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  return (
    <div className="w-full h-full min-h-[600px]">
      <Cal
        calLink={link}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: 'month_view', theme: 'light' }}
      />
    </div>
  );
}
