"use client";

import { useState } from "react";

/**
 * Click-to-play YouTube embed. Shows the thumbnail until the visitor clicks,
 * so the homepage loads no YouTube scripts or cookies up front. Uses the
 * privacy-enhanced youtube-nocookie.com domain.
 */
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="yt-embed">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} aria-label={`Play video: ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" />
          <span className="yt-play" aria-hidden>
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.3 34 .3 34 .3s-21.2 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.8 47.7 34 47.7 34 47.7s21.2 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" fill="#FF6B1A" />
              <path d="M45 24 27 14v20z" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
