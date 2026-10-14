import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface SoundToggleProps {
  onLabel: string;
  offLabel: string;
  className?: string;
}

/**
 * Optional ambience toggle — OFF by default.
 *
 * The sound is *synthesised* with the Web Audio API (a low sub-bass drone plus
 * filtered noise for rain), so the project ships zero audio files and the user
 * never has to supply any. The graph is created lazily on the first click, which
 * satisfies the browser's "audio requires a user gesture" rule.
 */
export function SoundToggle({ onLabel, offLabel, className }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const ensureGraph = useCallback((): AudioContext | null => {
    if (ctxRef.current) return ctxRef.current;
    if (typeof window === "undefined" || !("AudioContext" in window)) return null;

    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // 1. Sub-bass drone: the "city at night" floor.
    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.value = 46;
    const humGain = ctx.createGain();
    humGain.gain.value = 0.3;
    hum.connect(humGain);
    humGain.connect(master);

    // 2. Filtered noise: faint rain hiss.
    const seconds = 2;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      // Brown-ish noise (integrated white noise) reads as rain, not static.
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.4;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 900;
    lowpass.Q.value = 0.4;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.42;

    noise.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(master);

    hum.start();
    noise.start();

    ctxRef.current = ctx;
    masterRef.current = master;
    return ctx;
  }, []);

  const toggle = () => {
    const next = !enabled;
    const ctx = ensureGraph();

    if (ctx && masterRef.current) {
      if (ctx.state === "suspended") void ctx.resume();
      const gain = masterRef.current.gain;
      gain.cancelScheduledValues(ctx.currentTime);
      gain.linearRampToValueAtTime(next ? 0.085 : 0, ctx.currentTime + (next ? 0.9 : 0.4));
    }

    setEnabled(next);
  };

  // Release the audio hardware when the component goes away.
  useEffect(() => {
    return () => {
      const ctx = ctxRef.current;
      if (ctx) void ctx.close();
      ctxRef.current = null;
      masterRef.current = null;
    };
  }, []);

  const label = enabled ? onLabel : offLabel;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={label}
      title={label}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-gotham-600 text-ash transition-colors hover:border-signal hover:text-signal " +
        (className ?? "")
      }
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
    </button>
  );
}
