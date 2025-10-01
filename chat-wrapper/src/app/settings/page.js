"use client";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";

const defaultSettings = {
  openai_api_key: "",
  model: "gpt-4o",
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [testMessage, setTestMessage] = useState("");
  const [testOutput, setTestOutput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userSettings", JSON.stringify(settings));
    alert("Settings saved");
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();

    // check if api key is set
    if (!settings.openai_api_key) {
      alert("set your OpenAI API key in settings first.");
      return;
    }

    // check user input
    if (!testMessage) {
      alert("type a test message first.");
      return;
    }

    const testClient = new OpenAI({
      apiKey: settings.openai_api_key,
      dangerouslyAllowBrowser: true,
    });

    const response = await testClient.responses.create({
      model: "gpt-5",
      input: testMessage,
    });

    setTestOutput(response.output_text)
  };

  return (
    <div className="bg-white min-h-screen font-sans text-black">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition text-black mr-4"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-black">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div style={{ position: "relative", height: "500px" }}>
          <div>
            <label className="block font-medium mb-2 text-black">
              Open AI Settings
              <input
                type="text"
                onChange={handleChange}
                value={settings.openai_api_key}
                name="openai_api_key"
                placeholder="OpenAI API Key"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              />
            </label>
            <label className="block font-medium mb-2 text-black">
              Model Selection
              <select
                name="model"
                value={settings.model}
                onChange={handleChange}
                className="mt-2 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              >
                <option value="gpt-5">gpt-5</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-3">gpt-3</option>
              </select>
            </label>
            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Settings
            </button>
          </div>
          <hr className="my-6" />
          <div>
            <label className="block font-medium mb-2 text-black">
              Testing
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                name="test_msg"
                placeholder="Type a test message"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              />
            </label>
            <button
              type="submit"
              onClick={handleTestSubmit}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Test
            </button>
            <h3 className="mt-4 text-black">Test Output:</h3>
            <div className="mt-2 p-4 border rounded bg-gray-50 text-black">
              {testOutput
                ? testOutput
                : "Your test output will appear here."}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
