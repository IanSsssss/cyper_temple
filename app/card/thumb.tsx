"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { getGodsList, GodStruct, createGod } from "../contract";
import { cn } from "../../lib/utils";

export default function Thumb() {
  const [godsList, setGodsList] = useState<GodStruct[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [subDesc, setSubDesc] = useState("");

  useEffect(() => {
    async function fetchGodsList() {
      const data = await getGodsList();
      setGodsList(data);
    }
    fetchGodsList();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !desc || !imageUrl) {
      alert("神明名称、介绍、图片不能为空！");
      return;
    }

    createGod({ name, desc, imageUrl, subDesc });
    setShowModal(false);

    setName("");
    setDesc("");
    setImageUrl("");
    setSubDesc("");
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {godsList.map((item) => (
        <Link
          className="w-1/2 lg:w-1/3 p-4"
          key={item.id}
          href={{
            pathname: `/card`,
            query: { data: JSON.stringify(item) },
          }}
        >
          <button key={item.id} className="w-1/2 lg:w-1/3 p-4">
            <Card imageUrl={item.imgUrl}>
              <p className="font-bold text-xl">{item.name}</p>
              <p className="font-normal text-sm">{item.desc}</p>
            </Card>
          </button>
        </Link>
      ))}
      <div className="w-1/2 lg:w-1/3 p-4">
        <button onClick={() => setShowModal(true)}>
          <Card imageUrl="/new.png">
            <p className="font-bold text-xl">Create Your God</p>
            <p className="font-normal text-sm">Click to create your god</p>
          </Card>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white p-6 rounded-lg z-10 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Create Your God</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">God name*</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">add description*</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Post your god photo*</label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Extra description</label>
                <input
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-black"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Card = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;

    const direction = getDirection(event, ref.current);

    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        "md:h-96 w-60 h-60 md:w-96 bg-transparent rounded-lg overflow-hidden group/card relative",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          <motion.div className="group-hover/card:block hidden absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500" />
          <motion.div
            variants={variants}
            className="h-full w-full relative bg-gray-50 dark:bg-black"
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            <Image
              alt="image"
              className={cn(
                "h-full w-full object-cover scale-[1.15]",
                imageClassName
              )}
              width="1000"
              height="1000"
              src={imageUrl}
            />
          </motion.div>
          <motion.div
            variants={textVariants}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className={cn(
              "text-white absolute bottom-4 left-4 z-40",
              childrenClassName
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const variants = {
  initial: {
    x: 0,
  },

  exit: {
    x: 0,
    y: 0,
  },
  top: {
    y: 20,
  },
  bottom: {
    y: -20,
  },
  left: {
    x: 20,
  },
  right: {
    x: -20,
  },
};

const textVariants = {
  initial: {
    y: 0,
    x: 0,
    opacity: 0,
  },
  exit: {
    y: 0,
    x: 0,
    opacity: 0,
  },
  top: {
    y: -20,
    opacity: 1,
  },
  bottom: {
    y: 2,
    opacity: 1,
  },
  left: {
    x: -2,
    opacity: 1,
  },
  right: {
    x: 20,
    opacity: 1,
  },
};
