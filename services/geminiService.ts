import { GoogleGenAI } from "@google/genai";
import { GenerateContentParams, Source } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildPrompt(params: GenerateContentParams): string {
    const { inputText, target, conditions, useUserData, userData } = params;

    let prompt = `أنت مساعد ذكاء اصطناعي خبير في إعادة صياغة وكتابة المحتوى باللغة العربية. مهمتك هي تحويل النص التالي:\n\n--- النص الأصلي ---\n${inputText}\n------------------\n\n`;
    
    prompt += `الهدف من إعادة الصياغة هو: "${target}".\n\n`;

    if (conditions.length > 0) {
        prompt += "الرجاء الالتزام بالشروط التالية بدقة:\n";
        conditions.forEach(condition => {
             if (condition.type === 'seoKeywords' && condition.value) {
                prompt += `- قم بتضمين الكلمات المفتاحية التالية بشكل طبيعي: ${condition.value}\n`;
            } else {
                prompt += `- ${condition.type}: ${condition.value}\n`;
            }
        });
    }

    if (useUserData && userData) {
        prompt += "\nاستخدم أيضًا هذه المعلومات عن المستخدم لتخصيص النص:\n";
        prompt += `- اللغة المفضلة: ${userData.language}\n`;
        prompt += `- النبرة المفضلة: ${userData.tone}\n`;
        prompt += `- اللهجة المفضلة: ${userData.dialect}\n`;
        prompt += `- استخدام الرموز التعبيرية: ${userData.emojis}\n`;
        prompt += `- اهتمامات المستخدم: ${userData.interests}\n`;

        if (userData.customPrompt?.trim()) {
            prompt += `\nتعليمات إضافية ومخصصة من المستخدم (مهم جداً):\n"${userData.customPrompt}"\n`;
        }
    }

    prompt += "\nالآن، قم بتوليد النص المطلوب بجودة عالية واحترافية.";

    return prompt;
}

export const generateContent = async (params: GenerateContentParams): Promise<{ text: string; sources: Source[] }> => {
    try {
        const prompt = buildPrompt(params);
        
        const config: any = {};
        if (params.useInternet) {
            config.tools = [{ googleSearch: {} }];
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config,
        });

        const text = response.text;
        if (!text) {
            throw new Error("API returned an empty response. The content may have been blocked.");
        }

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources: Source[] = groundingChunks
            ? groundingChunks
                .map((chunk: any) => ({
                    uri: chunk.web?.uri || '',
                    title: chunk.web?.title || 'مصدر غير معروف',
                }))
                .filter((source: Source) => source.uri)
            : [];
        
        return { text, sources };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate text. Please check your API key and network connection.");
    }
};