"use client";

import { useState, useEffect, useRef } from "react";
import { Sender, Bubble, Attachments, AttachmentsProps } from "@ant-design/x";
import {
  UserOutlined,
  CloudUploadOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { BubbleProps } from "@ant-design/x";
import { Typography, App, Button, Flex, type GetProp, type GetRef } from "antd";
import markdownit from "markdown-it";

const md = markdownit({ html: true, breaks: true });

const renderMarkdown: BubbleProps["messageRender"] = (content) => (
  <Typography>
    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: used in demo */}
    <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
  </Typography>
);

export default function Home() {
  const [open, setOpen] = useState(false);
  const senderRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [renderKey, setRenderKey] = useState(0);
  const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
  const [items, setItems] = useState<GetProp<AttachmentsProps, "items">>([]);

  const handleSubmit = async (input: string) => {
    const res = await fetch("/api/echo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setLoading(false);
    setResponse(data.message.content);
  };
  useEffect(() => {
    const id = setTimeout(() => {
      setRenderKey((prev) => prev + 1);
      console.log("response", response);
    }, response?.length * 100 + 2000);

    return () => {
      clearTimeout(id);
    };
  }, [renderKey]);

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={open}
      onOpenChange={setOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        // Mock not real upload file
        beforeUpload={() => false}
        items={items}
        onChange={({ fileList }) => setItems(fileList)}
        placeholder={(type) =>
          type === "drop"
            ? {
                title: "Drop file here",
              }
            : {
                icon: <CloudUploadOutlined />,
                title: "Upload files",
                description: "Click or drag files to this area to upload",
              }
        }
        getDropContainer={() => senderRef.current}
      />
    </Sender.Header>
  );

  return (
    <div
      style={{ padding: "20px", paddingBottom: "80px", position: "relative" }}
    >
      <div key={renderKey} style={{ marginBottom: 10 }}>
        <Bubble
          loading={loading}
          typing
          content={response}
          messageRender={renderMarkdown}
          avatar={{ icon: <UserOutlined /> }}
        />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "50%",
          background: "#fff",
          padding: "10px 20px",
          boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px", // 可选：添加圆角效果
        }}
      >
        <Sender
          ref={senderRef}
          header={senderHeader}
          prefix={
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={() => {
                setOpen(!open);
              }}
            />
          }
          onPasteFile={(file) => {
            attachmentsRef.current?.upload(file);
            setOpen(true);
          }}
          loading={loading}
          value={value}
          onChange={(v) => {
            setValue(v);
          }}
          submitType="shiftEnter"
          placeholder="Press Shift + Enter to send message"
          onSubmit={(msg) => {
            setValue("");
            setLoading(true);
            handleSubmit(msg);
          }}
        />
      </div>
    </div>
  );
}
