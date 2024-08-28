import { NextRequest, NextResponse } from "next/server";
import { ZhipuAI } from "zhipuai-sdk-nodejs-v4";
export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    // 初始化 ZhipuAI
    const ai = new ZhipuAI({
      apiKey: "8e20048ac32cefdc5f9d2e0f38f0c149.hK5dHtwYYGcPDgLU", // 这里替换为你的 API KEY
    });

    // 调用大模型接口
    const data: any = await ai.createCompletions({
      model: "glm-4-flash",
      messages: [{ role: "user", content: input }],
      stream: false,
    });
    console.log("data", data.choices);
    // 返回结果
    return NextResponse.json({ message: data.choices[0].message });
  } catch (error) {
    console.error("Error in API call:", error);
    return NextResponse.json(
      { message: "Error occurred", error },
      { status: 500 }
    );
  }
}
