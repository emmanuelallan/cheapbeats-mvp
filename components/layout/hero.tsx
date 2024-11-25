import heroImage from "@/assets/images/hero.webp";
import Image from "next/image";

export default function Hero() {
  return (
    <div>
      <div className="absolute top-0 right-0 left-0 h-[50vh] opacity-45 bg-home" />
      <div className="flex-col flex relative flex-grow">
        <div className="relative -mt-[112px]">
          <section className="flex items-center overflow-hidden place-content-center h-[50vh] max-w-full relative min-h-fit bg-transparent">
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src={heroImage}
                alt="Background Image"
                className="opacity-100 absolute object-center top-auto bottom-auto w-base-2 h-base-2 object-cover"
                fill
              />

              <div className="overflow-hidden absolute w-full h-full">
                <div className="absolute h-full w-[272.718vh] min-w-full min-h-[36.6679vw] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-full overflow-hidden relative w-full">
                    <div className="w-full h-full opacity-100 bg-transparent">
                      <video
                        crossOrigin="anonymous"
                        aria-label="Video"
                        autoPlay
                        muted
                        loop
                        preload="auto"
                        className="bg-transparent block w-full h-full max-w-none max-h-none object-contain"
                      >
                        <source
                          src="https://utfs.io/f/ogmBUnGAUH2YbkeD2OUs6TjAymiOMWg0flwtBda3UZHeLRDr"
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -inset-1 w-base-1 h-base-1">
                <div className="absolute w-full bottom-0 h-full bg-linear2"></div>
              </div>
            </div>

            <div className="max-w-[768px] w-full mx-auto z-10">
              <div className="pt-[160px] pb-[80px] flex flex-col place-content-center items-center text-center whitespace-normal mx-auto w-full px-3">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-background mt-0 mb-6">
                  Unlock the Perfect Sound for Your Next Hit
                </h1>
                <p className="text-background max-w-lg mx-auto md:mx-0 mb-9">
                  License hand-picked tracks & beats from top industry
                  producers.
                  <br /> Find a track you love, write a topline, and release
                  your song.
                  <br /> Exclusive licenses for commercial release.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
