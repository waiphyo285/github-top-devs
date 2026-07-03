"use client";

import React, { useEffect, useState } from "react";

interface LocalTimeProps {
  dateString: string;
}

export function LocalTime({ dateString }: LocalTimeProps) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    if (!dateString) return;

    const timer = setTimeout(() => {
      try {
        setFormatted(new Date(dateString).toLocaleString());
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [dateString]);

  return <span>{formatted}</span>;
}
