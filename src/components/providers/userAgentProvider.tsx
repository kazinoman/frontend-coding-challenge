"use client";

import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { setCookie } from "cookies-next/client";

const CONTEXT_ERROR = "useUserAgentContext must be used within a UserAgentProvider";

type UserAgent = string;

type UserAgentContextType = {
  userAgent: UserAgent | undefined;
  setUserAgent: (userAgent: UserAgent | undefined) => void;
};

type UserAgentProviderProps = {
  children: ReactNode;
  userAgent?: UserAgent;
};

const UserAgentContext = createContext<UserAgentContextType | undefined>(undefined);

export const useUserAgentContext = (): UserAgentContextType => {
  const context = useContext(UserAgentContext);
  if (context === undefined) {
    throw new Error(CONTEXT_ERROR);
  }
  return context;
};

export const UserAgentProvider: React.FC<UserAgentProviderProps> = ({ children, userAgent: userAgentProp }) => {
  const [userAgent, setUserAgent] = useState<UserAgent | undefined>(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
  );

  useEffect(() => {
    // Set initial user agent from browser if available
    if (typeof window !== "undefined" && !userAgent) {
      const browserUserAgent = window.navigator.userAgent;
      setUserAgent(browserUserAgent);
      localStorage.setItem("userAgent", browserUserAgent);
    }

    // Function to fetch user agent data from an API
    const fetchUserAgent = async () => {
      try {
        const response = await fetch("https://httpbin.org/user-agent", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Error fetching user agent: ${response.statusText}`);
        }
        const data: { ["user-agent"]: string } = await response.json();
        console.log("Fetched user agent:", data["user-agent"]);

        setUserAgent(data["user-agent"]);
        setCookie("userAgent", data["user-agent"]);
      } catch (error) {
        console.error("Failed to fetch user agent:", error);
      }
    };

    // Fetch from API if running in the browser
    if (typeof window !== "undefined") {
      fetchUserAgent();
    }
  }, [userAgent]);

  const value = useMemo<UserAgentContextType>(
    () => ({
      userAgent,
      setUserAgent,
    }),
    [userAgent]
  );

  return <UserAgentContext.Provider value={value}>{children}</UserAgentContext.Provider>;
};
