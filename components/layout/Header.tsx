"use client";

import HeaderContent from "@/components/ui/navigation/HeaderContent";
import useHeaderData from "@/hooks/layout/useHeaderData";

const Header = () => {
  const { priceBounds, isPriceBoundsReady } = useHeaderData();

  return (
    <HeaderContent
      priceBounds={priceBounds}
      isPriceBoundsReady={isPriceBoundsReady}
    />
  );
};

export default Header;
