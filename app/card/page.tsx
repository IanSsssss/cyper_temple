"use client";

import Image from "next/image";
import { Suspense, useState, useMemo } from "react";
import { CardBody, CardContainer, CardItem } from "./card";
import { useSearchParams } from "next/navigation";
import { Header } from "../header";
import {WishList} from "./wishlistV2";
import { SubmitPrayer } from "./createPrayerV2";

function GodCard() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");

  const godData = useMemo(() => {
    if (!dataParam) return null;
    try {
      return JSON.parse(dataParam);
    } catch (e) {
      console.error("Failed to parse god data:", e);
      return null;
    }
  }, [dataParam]);

  return (
    <div className="h-screen fixed top-0 left-40">
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {godData.name}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            {godData.desc}
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <Image
              src={godData.imgUrl}
              height="1000"
              width="1000"
              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl transition-opacity duration-500 ease-in-out"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            <div className="text-m font-normal dark:text-white">
              {godData.subDesc}
            </div>
          </div>
        </CardBody>
      </CardContainer>
      <div className="w-100 h-screen relative">
        <div className="fixed top-0 right-32">
        <div className="absolute bottom-36 left-72 w-80"> 
          <SubmitPrayer godId={godData.id} />
          </div>
          <WishList />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
      />
      <GodCard />
    </Suspense>
  );
}
