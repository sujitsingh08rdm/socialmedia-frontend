import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface HlsVideoPlayerProps {
  src: string;
  className?: string;
  poster?: string;
  onReady?: () => void;
  onError?: () => void;
}

function HlsVideoPlayer({
  src,
  className,
  poster,
  onReady,
  onError,
}: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    console.log("Hls.isSupported():", Hls.isSupported());
    console.log(
      "native HLS support:",
      video.canPlayType("application/vnd.apple.mpegurl"),
    );

    if (Hls.isSupported()) {
      hls = new Hls();

      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("media attached, loading source:", src);
        hls!.loadSource(src);
      });

      timeoutId = setTimeout(() => {
        console.log("HLS timeout — manifest never parsed");
        onError?.();
      }, 15000);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("manifest parsed!");
        clearTimeout(timeoutId);
        onReady?.();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.log("HLS error:", data.type, data.details, data.fatal);
        if (data.fatal) {
          clearTimeout(timeoutId);
          onError?.();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => onReady?.(), {
        once: true,
      });
      video.addEventListener("error", () => onError?.(), { once: true });
    } else {
      console.log("Neither hls.js nor native HLS supported in this browser");
    }

    return () => {
      clearTimeout(timeoutId);
      hls?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
    />
  );
}

export default HlsVideoPlayer;
