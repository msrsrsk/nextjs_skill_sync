"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieAnimationProps {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  customClass?: string;
}

const LottieAnimation = ({
  src,
  autoplay = true,
  loop = true,
  customClass,
}: LottieAnimationProps) => {
  return (
    <DotLottieReact
      src={src}
      autoplay={autoplay}
      loop={loop}
      className={`w-[512px] h-[512px] pointer-events-none ${customClass ?? ""}`}
    />
  );
};

export default LottieAnimation;
