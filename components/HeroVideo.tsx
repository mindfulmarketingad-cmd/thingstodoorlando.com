"use client";

import { useSyncExternalStore } from "react";

/**
 * Decorative background video for the homepage hero. The poster image is
 * server-rendered for a fast first paint; the video mounts after hydration
 * and is skipped for reduced-motion users and Data Saver connections.
 */
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function canPlay() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !window.matchMedia(REDUCED).matches && !conn?.saveData;
}

export default function HeroVideo() {
  const play = useSyncExternalStore(subscribe, canPlay, () => false);
  return (
    <>
      <img
        className="hero-art"
        src="/video/hero-poster.jpg"
        alt=""
        width={1600}
        height={900}
        fetchPriority="high"
        decoding="async"
      />
      {play && (
        <video
          className="hero-art hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* Smaller files for phones; WebM first, MP4 fallback for older Safari. */}
          <source src="/video/hero-720.webm" type="video/webm" media="(max-width: 900px)" />
          <source src="/video/hero-720.mp4" type="video/mp4" media="(max-width: 900px)" />
          <source src="/video/hero-1080.webm" type="video/webm" />
          <source src="/video/hero-1080.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
