"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useCartStore } from "@/app/stores/useStore";
import { SITE_MAP } from "@/constants/index";

const { PRICE_BOUNDS_API_PATH, CART_COUNT_API_PATH } = SITE_MAP;

const DEFAULT_PRICE_BOUNDS: ProductPriceBounds = {
  minPrice: 0,
  maxPrice: 0,
};

const useHeaderData = () => {
  const [priceBounds, setPriceBounds] =
    useState<ProductPriceBounds>(DEFAULT_PRICE_BOUNDS);
  const [isPriceBoundsReady, setIsPriceBoundsReady] = useState(false);

  const { status } = useSession();
  const { setCartCount } = useCartStore();

  useEffect(() => {
    fetch(PRICE_BOUNDS_API_PATH)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setPriceBounds(result.data);
        }
      })
      .finally(() => setIsPriceBoundsReady(true));
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      setCartCount(0);
      return;
    }

    if (status !== "authenticated") return;

    fetch(CART_COUNT_API_PATH)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setCartCount(result.data.count);
        }
      })
      .catch(() => setCartCount(0));
  }, [status, setCartCount]);

  return { priceBounds, isPriceBoundsReady };
};

export default useHeaderData;
