"use client";
/* eslint-disable prefer-const */
import { useState } from "react";
import {TalkToGeminiGod} from '../../lib/utils'
import {submitMessage} from '../contract';
import {MiracleModal} from './term';

export function CreatePrayerModal({id, godName}:{id: string, godName: string}) {
  const [showModal, setShowModal] = useState(false);
  const [showMiracleModal, setShowMiracleModal] = useState(false);
  let [response, setResult] = useState('');

  const [nickname, setName] = useState("");
  const [text, setDesc] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !text) {
      alert("Invalid Parameter！");
      return;
    }

    try {
      await submitMessage(text, nickname, id); // 等待提交成功
      setShowModal(false);
      response = await TalkToGeminiGod(nickname, text, godName);
      setResult(response);
      setShowMiracleModal(true);
      // setShowModal(false);

    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to submit message!");
    }
  };

  const MiracleModalComponent = () =>
    showMiracleModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-transparent p-6 rounded-lg w-[70%]">
          <MiracleModal text={text || "Loading..."} godResponse={response ?? ''} />
          <button
            className="mt-4 bg-black-500 text-white px-4 py-2 rounded"
            onClick={() => setShowMiracleModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="ml-8 shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] px-8 py-2 bg-[#fff] text-[#696969] rounded-md font-light transition duration-200 ease-linear"
      >
       📜 Create Prayer
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 灰色背景遮罩 */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          />

          {/* 弹窗内容 */}
          <div className="relative bg-white p-6 rounded-lg z-10 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Create your preayer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Type your name*</label>
                <input
                  value={nickname}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Tell god what you want*</label>
                <textarea
                  value={text}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
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
                <MiracleModalComponent />
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
    </>
  );
}