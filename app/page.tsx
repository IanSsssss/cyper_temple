'use client'
import './globals.css';
import {BackgroundLines} from './welcome';
import Thumb from './card/thumb';

export default function Home() {

    return (
      <div>
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4" />
        <div>
        <Thumb />
        </div>
      </div>

    );
}