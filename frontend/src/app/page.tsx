import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";

const Page = () => {
  return (
    <main>
      <Suspense fallback={<div className="h-125 w-full bg-gray-200" />}>
        <HeroSlider />
      </Suspense>
    </main>
  );
};

export default Page;