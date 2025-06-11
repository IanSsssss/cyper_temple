"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getPrayerList, MsgStruct } from "../contract";

type Card = {
  id: number;
  name: string;
  designation: string;
  content: string;
};

const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const MAX_VISIBLE_CARDS = 5;
  const [cards, setCards] = useState<Card[]>(items.slice(0, MAX_VISIBLE_CARDS));

  useEffect(() => {
    setCards(items.slice(0, MAX_VISIBLE_CARDS));
  }, [items]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const startFlipping = () => {
      interval = setInterval(() => {
        setCards((prevCards: Card[]) => {
          const currentCards = [...prevCards];
          const lastCard = currentCards.pop()!;
          currentCards.unshift(lastCard);
          return currentCards;
        });
      }, 5000);
    };

    startFlipping();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-96">
      {cards.map((card, index) => {
        const scale = 1 - index * SCALE_FACTOR;
        const opacity = 1 - (index * 0.2);
        const zIndex = MAX_VISIBLE_CARDS - index;

        return (
          <motion.div
            key={card.id}
            className="absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-96 rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1] shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: scale,
              opacity: opacity,
              zIndex: zIndex,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">
              {card.content}
            </div>
            <div>
              <p className="text-neutral-500 font-medium dark:text-white">
                {card.name}
              </p>
              <p className="text-neutral-400 font-normal dark:text-neutral-200">
                {card.designation}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export function WishList() {
    const [messages, setMessages] = useState<MsgStruct[]>([
        {
          text: "Loading...",
          address: "0x...001",
          nickname: "User1",
          time: 1693459818,
        },
      ]);

    useEffect(() => {
        async function loadMessages() {
          const ledgerMeesage = await getPrayerList(1);
          const mappedMessages = ledgerMeesage.map(msg => ({
            text: msg.text,
            address: msg.address,
            nickname: msg.nickname,
            time: msg.time
          }));
          setMessages(mappedMessages);
        }
        loadMessages();
      }, []);

    const CARDS = messages.map((msg) => ({
        id: msg.time,
        name: msg.nickname,
        designation: msg.address,
        content: msg.text,
      }));

  return (
    <div className="h-[40rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}