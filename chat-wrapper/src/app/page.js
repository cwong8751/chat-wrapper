"use client";
import SettingsIcon from "../components/SettingsIcon";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [toggleSearchModal, setToggleSearchModal] = useState(false);

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  return (
    <div className="bg-white min-h-screen font-sans text-black">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Header Title */}
          <h1 className="text-xl font-bold text-black">Chat Wrapper</h1>

          {/* Settings Icon Button */}
          <button
            onClick={handleSettingsClick}
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            aria-label="Settings"
          >
            <SettingsIcon onClick={handleSettingsClick} />
          </button>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto p-4">
        <div className="flex" style={{ height: "600px" }}>
          {/* Sidebar */}
          <aside className="w-1/4 bg-gray-100 p-4 border-r flex flex-col">
            <button
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              onClick={() => alert("New chat started!")}
            >
              New Chat
            </button>
            <button
              className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              onClick={() => setToggleSearchModal(!toggleSearchModal)}
            >
              Search
            </button>
            <h2 className="text-lg font-semibold mb-4">Model</h2>

            <select className="mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-5">gpt-5</option>
              <option value="gpt-3">gpt-3</option>
            </select>

            <h2 className="text-medium font-semibold mb-4">My Chats</h2>
            <ul>
              <li className="mb-2">Item 1</li>
              <li className="mb-2">Item 2</li>
              <li className="mb-2">Item 3</li>
            </ul>
          </aside>

          {/* Chat area */}
          <div className="w-3/4" style={{ position: "relative" }}>
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  <Message
                    model={{
                      message: "Hello my friend",
                      sentTime: "just now",
                      sender: "Joe",
                    }}
                  />
                </MessageList>
                <MessageInput placeholder="Type message here" />
              </ChatContainer>
            </MainContainer>
          </div>

          {/* modal */}
          {toggleSearchModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Search</h2>
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {/* where search results go */}
                <ul>
                  <li className="mb-2">Item 1</li>
                  <li className="mb-2">Item 2</li>
                  <li className="mb-2">Item 3</li>
                </ul>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setToggleSearchModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => alert("Searching...")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
