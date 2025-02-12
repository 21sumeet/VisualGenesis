
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  useFileOutput:false ,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;
    const { userId } = await auth();
    
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

    

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    const isAllowed = await checkApiLimit();
    if (!isAllowed ) {
      return new NextResponse("API Limit Exceeded", { status: 403 });
    }
  
    const response = await replicate.run("lightricks/ltx-video:c441c271f0cfd578aa0cd14a8488329dd10b796313a9335573a4a63507a976a5", {
      input: {
        prompt,
      },
    });

    await increaseApiLimit();

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}