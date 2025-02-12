// api/music/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";



const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
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

    // Create the prediction
    const prediction = await replicate.predictions.create({
      version: "8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      input: {
        prompt_a: prompt,
        denoising: 0.75,
        seed_image_id: "vibes",
        alpha: 0.5,
        num_inference_steps: 50
      }
    });
    await increaseApiLimit();

    // Wait for the prediction to complete
    let finalPrediction = await replicate.predictions.get(prediction.id);
    
    while (finalPrediction.status !== 'succeeded' && finalPrediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
      finalPrediction = await replicate.predictions.get(prediction.id);
    }

    if (finalPrediction.status === 'failed') {
      return new NextResponse("Audio generation failed", { status: 500 });
    }

    // Type the output properly
    interface ReplicateOutput {
      audio: string;
      spectrogram: string;
    }

    const output = finalPrediction.output as ReplicateOutput;

    if (!output?.audio) {
      return new NextResponse("Audio URL not found in response", { status: 500 });
    }

    // Return the URLs
    const response = NextResponse.json({
      audio: output.audio,
      spectrogram: output.spectrogram
    });
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error) {
    console.error("[MUSIC_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
