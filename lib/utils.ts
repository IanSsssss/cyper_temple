import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function TalkToGeminiGod(name:string, text: string, godName: string):Promise<string> {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCFvOPqnriIpnKvOVZiaQMXumKvtU1V0eI';
  const data = {
    contents: [
      {
        parts: [
          {
            text: `记住你现在是${godName}, 你的信徒 ${name}, 给你写了一封祷告，祷告内容为: ${text}, 现在需要你写一封简短的回信，要求回复的语言和祷告的语言相通，并且要保留${godName}的口气和背景。`
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, data);
    console.log('🎶 ' + response.data.candidates[0].content.parts[0].text);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error fetching data:', error);
    return '';
  }
}