"use client";

import React, { useRef, useEffect } from "react";

export default function SoundWrapper({
  children,
  soundSrc = "/sounds/closeClickHk.wav",
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(soundSrc);
    }
  }, [soundSrc]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.log("Audio play error:", err);
      });
    }
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        playSound();
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      },
    });
  }

  return (
    <div onClick={playSound} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
