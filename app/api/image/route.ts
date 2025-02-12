import { NextResponse } from "next/server";
import axios from 'axios';
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, guidance = 3.5, amount = 1, resolution = "512x512" } = body;

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

    // Split resolution into width and height
    const [width, height] = resolution.split('x').map(Number);

    // Together AI API call
    const response = await axios.post(
      'https://api.together.xyz/v1/images/generations',
      {
        model: 'black-forest-labs/FLUX.1-schnell-Free',
        prompt,
        steps: 1,
        n: Number(amount),
        guidance: Number(guidance),
        width,
        height,
        output_format: 'jpeg'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    await increaseApiLimit();

    // Extract image URLs from response
    const imageUrls = response.data.data.map((item: any) => item.url);
    
    return NextResponse.json(imageUrls, { status: 200 });
  } catch (error: any) {
    console.error("[IMAGE_ERROR]", error);
    return new NextResponse(error.response?.data?.error || "Internal Server Error", { 
      status: error.response?.status || 500 
    });
  }
}