// utils/stability.ts
export async function generateImageFromStability(
  prompt: string
): Promise<Blob> {
  const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY;

  const response = await fetch(
    "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Stability API failed: " + (await response.text()));
  }

  const data = await response.json();
  const base64Image = data.artifacts[0].base64;
  return await (await fetch(`data:image/png;base64,${base64Image}`)).blob();
}
