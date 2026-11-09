import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import Text from "@/components/home/Text";
import ShopByCategory from "@/components/home/ShopByCategory";

const Page = () => {
  return (
    <main>
      <Suspense fallback={<div className="h-125 w-full bg-gray-200" />}>
        <HeroSlider />
        <Text />
        <ShopByCategory />
      </Suspense>
    </main>
  );
};

export default Page;