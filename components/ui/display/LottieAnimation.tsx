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
      className={`w-[256px] h-[256px] pointer-events-none ${customClass ?? ""}`}
    />
  );
};

export default LottieAnimation;
