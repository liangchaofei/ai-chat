"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/echo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    console.log("data", data);

    setResponse(data.message.content);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>输入内容并显示返回结果</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入内容"
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "300px",
            height: "80px",
          }}
        />
        <button
          type="submit"
          style={{ marginLeft: "10px", padding: "8px 16px", fontSize: "16px" }}
        >
          确定
        </button>
      </form>
      {response ? (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          <strong>返回结果:</strong> {response}
        </div>
      ) : (
        "正在等待结果..."
      )}
    </div>
  );
}
