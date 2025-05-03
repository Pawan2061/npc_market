// utils/stability.ts
export async function generateImageFromStability(
  prompt: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY;

  const response = await fetch(
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 15,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 50,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Stability API failed: " + (await response.text()));
  }

  const data = await response.json();
  const base64Image = data.artifacts[0].base64;
  console.log(base64Image, "okay ser images");

  return `data:image/png;base64,${base64Image}`;
}
