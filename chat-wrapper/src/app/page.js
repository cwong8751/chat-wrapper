"use client";
import SettingsIcon from "../components/SettingsIcon";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {marked} from "marked";

export default function Home() {
  const router = useRouter();
  const [toggleSearchModal, setToggleSearchModal] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [chatId, setChatId] = useState(0);
  const [chats, setChats] = useState([]);
  const [chosenModel, setChosenModel] = useState("chatgpt-4o-latest");

  const handleSettingsClick = () => {
    router.push("/settings");
  };

  const submitChatMessage = async () => {
    if (!userMessage.trim()) return;

    // check chat id
    console.log("Current chatId:", chatId);

    // build new message
    const newMessage = {
      message: userMessage,
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "User",
    };

    // update chat log with user message
    const updatedChatLog = [...chatLog, newMessage];
    setChatLog(updatedChatLog);
    setUserMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: chosenModel, prompt: userMessage }),
    });

    console.log("body:", { model: chosenModel, prompt: userMessage });

    const { text } = await res.json();

    // add bot response to chat log
    const botMessage = {
      message: text || "I am having trouble connecting to the server.",
      direction: "incoming",
      type: "text",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "Bot",
    };
    setChatLog((prevChatLog) => [...prevChatLog, botMessage]);

    // save chat log to database
    await fetch("/api/save-chatlog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        sender: newMessage.sender,
        message: newMessage.message,
        sentTime: newMessage.sentTime,
        direction: "outgoing",
      }),
    });

    await fetch("/api/save-chatlog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        sender: botMessage.sender,
        message: botMessage.message,
        sentTime: botMessage.sentTime,
        direction: "incoming",
      }),
    });
  };

  const startNewChat = async () => {
    // set chatId
    const chatId = crypto.randomUUID();
    setChatId(chatId);

    // save chat metadata to database
    await fetch("/api/chat-management", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        chatTitle: `Chat ${chatId}`, //TODO: set title later
      }),
    });

    // refresh chat list
    fetchAllChats();

    // clear user inputs
    setChatLog([]);
    setUserMessage("");
  };

  const fetchAllChats = async () => {
    const res = await fetch("/api/chat-management");
    const chats = await res.json();
    setChats(chats);
    console.log("All chats:", chats);
  };

  const loadChatLog = async (chatId) => {
    console.log("Loading chat log for chatId:", chatId);
    const res = await fetch(`/api/get-chatlog?chatId=${chatId}`);
    const chatLog = await res.json();
    setChatLog(chatLog);
    setChatId(chatId);
    console.log("Chat log:", chatLog);
  };

  // on load block
  useEffect(() => {
    fetchAllChats();
  }, []);

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
              onClick={startNewChat}
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

            <select value={chosenModel} onChange={(e) => setChosenModel(e.target.value)} className="mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="chatgpt-4o-latest">chatgpt-4o-latest</option>
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-4-turbo">gpt-4-turbo</option>
              <option value="gpt-5">gpt-5</option>
              <option value="gpt-3">gpt-3</option>
            </select>

            <h2 className="text-medium font-semibold mb-4">My Chats</h2>
            {/* List of chats */}
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat._id}
                  className={`mb-2 cursor-pointer hover:underline ${
                    chat.chatId === chatId ? "font-bold text-indigo-600" : ""
                  }`}
                  onClick={() => loadChatLog(chat.chatId)}
                >
                  {chat.chatTitle}
                </li>
              ))}
            </ul>
          </aside>

          {/* Chat area */}
          <div className="w-3/4" style={{ position: "relative" }}>
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {chatLog.map((chat, index) => (
                    <Message
                      key={index}
                      model={{
                        message: marked(chat.message),
                        sentTime: chat.sentTime,
                        sender: chat.sender,
                        direction: chat.direction,
                      }}
                    >
                      <Message.Header>
                        <span>{chat.sender}</span>
                        <span
                          style={{
                            fontSize: "0.75em",
                            color: "#888",
                            marginLeft: "8px",
                          }}
                        >
                          {chat.sentTime}
                        </span>
                      </Message.Header>
                    </Message>
                  ))}
                </MessageList>
                <MessageInput
                  value={userMessage}
                  onChange={setUserMessage}
                  onSend={submitChatMessage}
                  placeholder="Type message here"
                />
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
