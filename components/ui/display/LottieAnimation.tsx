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
      className={`w-128 h-128 pointer-events-none ${customClass ?? ""}`}
    />
  );
};

export default LottieAnimation;
