"use client";

import { BackToHome } from "@/components/backToHome/backToHome";
import { useUserAgentContext } from "@/components/providers/userAgentProvider";

export const UserAgent = () => {
  const { userAgent } = useUserAgentContext();

  return (
    <div>
      <BackToHome />

      {userAgent && (
        <section className="flex font-mono font-semibold text-sm">
          <span className="border p-2">UserAgent</span>

          <span className="border p-2">{userAgent}</span>
        </section>
      )}

      {!userAgent && <div>No user agent</div>}
    </div>
  );
};
