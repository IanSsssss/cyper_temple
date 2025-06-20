import { ethers } from "ethers";
import contractData from "../artifacts/contracts/CyperTemple.sol/CyperTemple.json" assert { type: "json" };

export interface MsgStruct {
  text: string;
  address: string;
  nickname: string;
  time: number;
}

export interface GodStruct {
  id: number;
  name: string;
  desc: string;
  imgUrl: string;
  subDesc: string;
}

declare const window: {
  ethereum: {
    isMetaMask?: boolean;
    request: (args: { method: string }) => Promise<string[]>;
    enable?: () => Promise<string[]>;
  };
};

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/CgIS8gBoKOp3atEMXs4ZhEwuJVdFiAU0"
);

const wallet = new ethers.Wallet(
  "70a45ebde804808ea770145bd1758f1d7649449a5b3a9cb72dcb23930e6afb3c",
  provider
);

const contractAddress = "0x908c3d303e8684FC6E7f0bCb266F47bC67a58cC0";
const contractABI = contractData.abi;

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export async function getPrayerList(id: number): Promise<MsgStruct[]> {
  try {
    const messages: string[] = await contract.getPrayerList(id);
    
    const mockData = [
      {
        text: "ขอให้พระพุทธเจ้าคุ้มครองให้ฉันมีความสุขและปลอดภัยตลอดปีนี้  ",
        address: "0x...1AB",
        nickname: "สมศักดิ์ ",
        time: 23121,
      },
      {
        text: "今年は仏様のご加護で、無事で平和な年になりますように",
        address: "0x...BS1",
        nickname: "山田西瓜郎",
        time: 212121,
      },
      {
        text: "Cthulhu, whose dark slumber keeps us from the ultimate dread, we implore thee.",
        address: "0x...D16",
        nickname: "Fishman",
        time: 21253121,
      },
      {
        text: "文殊菩萨在上，保佑我今年考试顺利通过",
        address: "0x...213",
        nickname: "一名学渣",
        time: 21231721,
      },
      {
        text: "文殊菩萨，你的狮子坐骑在狮驼岭当山大王呢啊！",
        address: "0x...310",
        nickname: "孙行者",
        time: 21423121,
      },
      {
        text: "普贤菩萨，吾儿红孩儿可还好啊",
        address: "0x..OX3",
        nickname: "牛魔王",
        time: 21233121,
      },
      {
        text: "不动明王様、どうか私と私の家族を守り、今年も無事で幸せでありますように",
        address: "0x...DD0",
        nickname: "tom",
        time: 21253121,
      },
      {
        text: `O' Cthulhu, in the depths of R'lyeh, In the name of the Great Old Ones, we beg for mercy`,
        address: "0x...X55",
        nickname: "Noone",
        time: 21253101,
      },
    ];

    return mockData.concat(
      messages.map((msg) => ({
        text: msg[0],
        address: `0x...${msg[1].slice(39)}`,
        nickname: msg[2],
        time: Number(msg[3]),
      }))
    );
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function submitMessage(text: string, nickname: string, godId: string) {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected. Please install MetaMask.");
    }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
    	throw new Error("No accounts available in MetaMask.");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.submit(text, nickname, godId);
    await tx.wait();  // 等待交易确认
    console.log("Message submitted successfully:" ,text, nickname);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getGodsList(): Promise<GodStruct[]> {
  const gods = await contract.godList();
  const result = [];
  for (const god of gods) {
    const imgUrl = imgUrlMap(god);
    result.push({
      id: god[4],
      name: god[0],
      desc: god[1],
      imgUrl,
      subDesc: god[3],
    });
  }
  return result;
}

export async function createGod(param: {name:string,desc: string, imageUrl: string, subDesc: string }) {
	if (!param.name || !param.desc){
		throw new Error("MetaMask not detected. Please install MetaMask.");
	}

	await contract.createGod(param.name, param.desc, param.imageUrl, param.subDesc);
	return;
}

function imgUrlMap(god: number[]): string {
  if (god[4] < 6) {
    return [
      "/rulai.png",
      "/puxian.jpg",
      "/wenshu.jpg",
      "/budongmingwang.jpg",
      "/cthulhu.png",
	  "/jesus.png"
    ][god[4]];
  }
  return god[2] as unknown as string;
}
