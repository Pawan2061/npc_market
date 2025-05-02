// /api/generate-image.js
import { NextResponse } from "next/server";

export const runtime = "edge"; // Use Edge runtime for faster response

export async function POST(req: any) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing required parameter: prompt" },
        { status: 400 }
      );
    }

    // Implement your AI image generation call here
    // Example using OpenAI DALL-E API
    // You can replace this with any AI image generation API of your choice
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `High quality, detailed NFT digital art: ${prompt}. Style: vibrant colors, crisp details, suitable for an NFT marketplace. Square format, digital art style.`,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          response_format: "url",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate image");
    }

    const data = await response.json();

    // Return the image URL
    return NextResponse.json({
      imageUrl: data.data[0].url,
      success: true,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error || "Failed to generate image" },
      { status: 500 }
    );
  }
}
