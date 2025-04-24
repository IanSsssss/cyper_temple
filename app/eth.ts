import { ethers } from "ethers";

export interface MsgStruct {
    text: string,
    address: string,
    nickname: string,
    time: number,
}

declare const window: {ethereum: {
    isMetaMask?: boolean;
    request: (args: { method: string }) => Promise<string[]>;
    enable?: () => Promise<string[]>;
  };};


const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/CgIS8gBoKOp3atEMXs4ZhEwuJVdFiAU0");

const wallet = new ethers.Wallet('70a45ebde804808ea770145bd1758f1d7649449a5b3a9cb72dcb23930e6afb3c', provider);

const contractAddress = "0x9AB674C725cD95E2211191B297cc54f94089BfA1";
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "nickname",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "NewMsgSubmit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "nickname",
				"type": "string"
			}
		],
		"name": "submit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint16",
				"name": "msgCount",
				"type": "uint16"
			}
		],
		"name": "getMsgList",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "nickname",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					}
				],
				"internalType": "struct MsgBoard.Message[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Messages",
		"outputs": [
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "nickname",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export async function getMessages():Promise<MsgStruct[]> {
  try {
    const messages: string[] = await contract.getMsgList(1);

	const mockData = [{
		text: 'ขอให้พระพุทธเจ้าคุ้มครองให้ฉันมีความสุขและปลอดภัยตลอดปีนี้  ',
		address: '0x...1AB',
		nickname: 'สมศักดิ์ ',
		time: 23121,
	},
	{
		text: '今年は仏様のご加護で、無事で平和な年になりますように',
		address: '0x...BS1',
		nickname: '山田西瓜郎',
		time: 212121,
	},
	{
		text: '文殊菩萨在上，保佑我今年考试顺利通过',
		address: '0x...213',
		nickname: '一名学渣',
		time: 21231721,
	},{
		text: '文殊菩萨，你的狮子坐骑在狮驼岭当山大王呢啊！',
		address: '0x...310',
		nickname: '孙行者',
		time: 21423121,
	},
	{
		text: '普贤菩萨，吾儿红孩儿可还好啊',
		address: '0x..OX3',
		nickname: '牛魔王',
		time: 21233121,
	},{
		text: '不动明王様、どうか私と私の家族を守り、今年も無事で幸せでありますように',
		address: '0x...DD0',
		nickname: 'tom',
		time: 21253121,
	}

]

	return mockData.concat(messages.map((msg) => ({
		text: msg[0],
		address: `0x...${msg[1].slice(39)}`,
		nickname: msg[2],
		time: Number(msg[3])
	})));
  } catch (error) {
    console.error("Error:", error);
	return []
  }
}

export async function submitMessage(text: string, nickname: string) {
	try {
		if (!window.ethereum) {
			throw new Error("MetaMask not detected. Please install MetaMask.");
		  }
	  
		  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
		  if (accounts.length === 0) {
			throw new Error("No accounts available in MetaMask.");
		  }

		  const provider = new ethers.BrowserProvider(window.ethereum);
		  const signer = await provider.getSigner();
		  const contract = new ethers.Contract(contractAddress, contractABI, signer);

		const tx = await contract.submit(text, nickname);
		await tx.wait();  // 等待交易确认
		console.log("Message submitted successfully:", tx);
	  } catch (error) {
		console.error("Error:", error);
	  }
}