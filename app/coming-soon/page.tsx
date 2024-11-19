"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Drum, Guitar, Mic, Piano, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addToWaitlist } from "@/actions/waitlist";

const audioSamples = [
  {
    name: "Drum Loop",
    icon: Drum,
    src: "https://utfs.io/f/ogmBUnGAUH2Y9N0MPrFLAfsMPcnuvbz4mKRZ8ewQWU1ah65I",
  },
  {
    name: "Bass Line",
    icon: Guitar,
    src: "https://utfs.io/f/ogmBUnGAUH2YM0iH0lQywraotDcjPX7hx5L6pAfnEqMisQb2",
  },
  {
    name: "Vocal Chop",
    icon: Mic,
    src: "https://utfs.io/f/ogmBUnGAUH2YlsYn9tqPBTVZt98ODq0NKvndzFeMf6gLHQoi",
  },
  {
    name: "Synth Melody",
    icon: Piano,
    src: "https://utfs.io/f/ogmBUnGAUH2Yo2ox0kGAUH2YzgbkSv0QrwF3yuqKOTaL4RCh",
  },
];

export default function Component() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean[]>(
    new Array(audioSamples.length).fill(false)
  );

  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef);
  const mainControls = useAnimation();
  const { toast } = useToast();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  useEffect(() => {
    // Create and configure audio elements
    audioRefs.current = audioSamples.map((sample) => {
      const audio = new Audio(sample.src);
      audio.loop = true;
      audio.volume = 0.8;
      // Preload the audio
      audio.preload = "auto";
      return audio;
    });

    // Cleanup function
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const result = await addToWaitlist(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "You're on the list! 🎵",
        description:
          "We'll notify you when we launch. Get ready to make some noise!",
        action: <ToastAction altText="Got it">Got it</ToastAction>,
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlay = async (index: number) => {
    const newIsPlaying = [...isPlaying];

    if (isPlaying[index]) {
      // If currently playing, just pause
      audioRefs.current[index].pause();
      newIsPlaying[index] = false;
    } else {
      // Pause all other audio without resetting their position
      audioRefs.current.forEach((audio, i) => {
        if (i !== index && !audio.paused) {
          audio.pause();
          newIsPlaying[i] = false;
        }
      });

      try {
        await audioRefs.current[index].play();
        newIsPlaying[index] = true;
      } catch (error) {
        console.error("Error playing audio:", error);
        toast({
          title: "Audio Playback Error",
          description:
            "There was an issue playing the audio. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsPlaying(newIsPlaying);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div ref={containerRef} className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-[#6C3CE9] text-sm font-medium tracking-wide uppercase">
            WHY CHEAPBEATS?
          </span>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate={mainControls}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-[2.75rem] font-bold leading-[1.2] tracking-tight mb-8">
            Cheapbeats is the all-in-one platform for selling your beats,
            samples, and music services.
            <span className="text-[#6C3CE9]"> Coming soon.</span>
          </h1>
          <p className="text-xl text-[#666666] mb-12">
            From beat marketplaces to custom storefronts, we&apos;re building
            the ultimate platform for music creators. Get ready to amplify your
            reach and monetize your sound.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="text-left p-6 rounded-2xl bg-[#F9F9F9] hover:bg-[#F5F5F5] transition-colors duration-200">
              <span className="text-[#6C3CE9] text-sm font-medium mb-4 block">
                01
              </span>
              <h3 className="text-xl font-semibold mb-2">Beat Marketplace</h3>
              <p className="text-[#666666]">
                Showcase and sell your beats with customizable licenses and
                instant delivery.
              </p>
            </div>
            <div className="text-left p-6 rounded-2xl bg-[#F9F9F9] hover:bg-[#F5F5F5] transition-colors duration-200">
              <span className="text-[#6C3CE9] text-sm font-medium mb-4 block">
                02
              </span>
              <h3 className="text-xl font-semibold mb-2">Sample Packs</h3>
              <p className="text-[#666666]">
                Create and sell professional sample packs with secure file
                delivery.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {audioSamples.map((sample, index) => (
              <div key={index}>
                <Button
                  variant="outline"
                  className={`h-16 w-16 rounded-2xl p-0 bg-white border-2 transition-all duration-200 ${
                    isPlaying[index]
                      ? "border-[#6C3CE9]"
                      : "border-[#E5E7EB] hover:border-[#6C3CE9]"
                  }`}
                  onClick={() => togglePlay(index)}
                >
                  <sample.icon
                    className={`h-8 w-8 ${
                      isPlaying[index] ? "text-[#6C3CE9]" : "text-[#1f1f1f]"
                    }`}
                  />
                </Button>
              </div>
            ))}
          </div>

          <form action={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1f1f1f] placeholder-[#666666] focus:border-[#6C3CE9] focus:ring-2 focus:ring-[#6C3CE9] focus:ring-opacity-20"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-6 bg-[#6C3CE9] text-white rounded-xl hover:bg-[#5B32D6] transition-colors duration-200"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="mt-4 text-sm text-[#666666]">
            Be the first to know when we launch. No spam, just beats.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
