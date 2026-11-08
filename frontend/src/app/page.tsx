import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import Text from "@/components/home/Text";

const Page = () => {
  return (
    <main>
      <Suspense fallback={<div className="h-125 w-full bg-gray-200" />}>
        <HeroSlider />
        <Text />
      </Suspense>
    </main>
  );
};

export default Page;