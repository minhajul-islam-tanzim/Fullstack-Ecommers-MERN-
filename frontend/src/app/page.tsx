import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import Text from "@/components/home/Text";
import ShopByCategory from "@/components/home/ShopByCategory";
import NewArrivals from "@/components/home/NewArrivals";

const Page = () => {
  return (
    <main>
      <Suspense fallback={<div className="h-125 w-full bg-gray-200" />}>
        <HeroSlider />
        <Text />
        <ShopByCategory />
        <NewArrivals></NewArrivals>
      </Suspense>
    </main>
  );
};

export default Page;