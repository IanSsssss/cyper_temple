import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/CgIS8gBoKOp3atEMXs4ZhEwuJVdFiAU0");

const wallet = new ethers.Wallet('70a45ebde804808ea770145bd1758f1d7649449a5b3a9cb72dcb23930e6afb3c', provider);

const contractAddress = "0x908c3d303e8684FC6E7f0bCb266F47bC67a58cC0";
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
          "name": "content",
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
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "godId",
          "type": "uint16"
        }
      ],
      "name": "NewMsgSubmit",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "GodsList",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "desc",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "imgUrl",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "subDesc",
          "type": "string"
        },
        {
          "internalType": "uint16",
          "name": "godNum",
          "type": "uint16"
        },
        {
          "internalType": "uint128",
          "name": "prayerCount",
          "type": "uint128"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "PrayerMap",
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
          "internalType": "uint16",
          "name": "godId",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "godName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "desc",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "imgUrl",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "subDesc",
          "type": "string"
        }
      ],
      "name": "createGod",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "godId",
          "type": "uint16"
        }
      ],
      "name": "getPrayerList",
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
              "internalType": "uint16",
              "name": "godId",
              "type": "uint16"
            }
          ],
          "internalType": "struct CyperTemple.Prayer[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "godList",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "desc",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "imgUrl",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "subDesc",
              "type": "string"
            },
            {
              "internalType": "uint16",
              "name": "godNum",
              "type": "uint16"
            },
            {
              "internalType": "uint128",
              "name": "prayerCount",
              "type": "uint128"
            }
          ],
          "internalType": "struct CyperTemple.God[]",
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
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "nickname",
          "type": "string"
        },
        {
          "internalType": "uint16",
          "name": "godId",
          "type": "uint16"
        }
      ],
      "name": "submit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export async function getGodsList() {
	const result = await contract.godList();
    debugger
	console.log(result);
}

console.log(getGodsList())