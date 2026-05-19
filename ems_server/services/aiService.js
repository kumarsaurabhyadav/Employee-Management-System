import { GoogleGenerativeAI } from "@google/generative-ai";

// 🚀 Explicitly specify the API version if needed, but usually the SDK handles it.
// Make sure your GEMINI_API_KEY is correct in .env
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables. AI generation will fail.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    error?.status === 429 ||
    error?.status === 503 ||
    /quota|rate limit|too many requests|high demand|service unavailable/i.test(message)
  );
};

const isModelMissing = (error) => {
  const message = String(error?.message || "");
  return error?.status === 404 || /model.*not found/i.test(message);
};

export const generateCourseContent = async (requirement, type = "slide") => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured on server. Set GEMINI_API_KEY in your environment.');
  }
  const candidateModels = [
    process.env.GEMINI_MODEL || "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
  ];

  console.info('AI_SERVICE: candidate models', candidateModels);

  const prompt = `
      You are an expert instructional designer. A user has given this requirement:
      "${requirement}"

      Create a professional course structure from this requirement.
      If the input is short or high level, infer the best target audience, level, learning objectives, and course outline.
      Provide a clear, polished course title and description.
      Keep it focused on practical learning and outcomes.
      Target format: ${type} (slide or video).

      If the target format is slide, create slide-ready modules with 3-5 slides per module and include bullets for each slide.
      If the target format is video, create video lesson structure and key talking points.

      Return ONLY a valid JSON object with these properties:
      {
        "title": "String",
        "description": "String",
        "category": "String",
        "level": "String",
        "duration": "String",
        "videos": Number,
        "learningObjectives": ["String"],
        "modules": [
          {
            "title": "String",
            "content": "String",
            "duration": "String",
            "keyPoints": ["String"],
            "slides": [
              {
                "title": "String",
                "bullets": ["String"]
              }
            ]
          }
        ]
      }
    `;

  let lastError;

  for (const modelName of candidateModels) {
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await (typeof response.text === 'function' ? response.text() : String(response));

        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start === -1 || end === -1) {
          throw new Error("Invalid AI Response Format");
        }

        const jsonText = text.slice(start, end + 1);
        try {
          return JSON.parse(jsonText);
        } catch (parseErr) {
          console.error('AI_SERVICE_PARSE_ERROR: Failed to parse JSON from AI response', parseErr, { model: modelName, raw: jsonText.slice(0, 400) });
          throw parseErr;
        }
      } catch (error) {
        lastError = error;
        const message = String(error?.message || "");

        if (isModelMissing(error)) {
          console.warn(`Model ${modelName} unavailable, trying next model...`);
          break;
        }

        if (isRetryableError(error)) {
          attempt += 1;
          if (attempt < maxAttempts) {
            console.warn(`Model ${modelName} retry ${attempt}/${maxAttempts} due to temporary issue: ${message}`);
            await sleep(1500 * attempt);
            continue;
          }
          console.warn(`Model ${modelName} still unavailable after ${maxAttempts} attempts, trying next model...`);
          break;
        }

        console.error("AI_SERVICE_DETAILED_ERROR:", error?.stack || error);
        throw error;
      }
    }
  }

  console.error("AI_SERVICE_ALL_MODELS_FAILED:", lastError);
  const lastMsg = lastError?.message || String(lastError || 'unknown');
  throw new Error(
    `All Gemini model fallbacks failed. Last error: ${lastMsg}. Please check your API key, quota, or try again later.`
  );
};
