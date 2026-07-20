import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { image, lang } = await req.json();

    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const visionResult = await groq.chat.completions.create({
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image in detail. If it contains text, read and translate it to ${lang}. If it's a homework problem, solve it step by step. If it's an object, identify it with interesting facts. Respond in ${lang} language. Begin with a brief description of what you see, then provide the analysis.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Data}` },
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const analysis = visionResult.choices[0]?.message?.content || "Could not analyze the image.";

    return Response.json({
      description: analysis,
      success: true,
    });
  } catch (err: any) {
    console.error("Lens error:", err);
    return Response.json({ error: err.message || "Failed to analyze image" }, { status: 500 });
  }
}
