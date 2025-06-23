import { NextResponse } from "next/server";
import { generateAWSVoice } from "@/lib/tts/aws";
import { hasVoice, storeVoice, getVoiceUrl } from "@/lib/azure";
import { synthesizeSpeech } from "@/lib/tts/google";
// import { synthesizeSpeechSarvam } from "@/lib/tts/sarvam";
import axios from "axios";
// import { synthesizeSpeechElevenLabs } from "@/lib/tts/elevanlabs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export async function POST(req: Request) {
  let { provider, model, voice, text, language } = await req.json();
  console.log("text - post", text);
  
  try {
    // 1. Check Azure cache first
    const cachedUrl = await getVoiceUrl(provider, model, voice, language);
    if (cachedUrl) {
      // console.log("cachedUrl", cachedUrl)
      return NextResponse.json({ audioUrl: cachedUrl });
    }
    // console.log("groq api key", process.env.GROQ_API_KEY)


    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct', // or use the specific versatile variant if Groq labels it differently
          messages: [
            {
              role: 'system',
              content: `You are a language expert. Translate English text into grammatically correct for Language ${language} for audio ouput. Always read ProPal AI  as pɹoʊ pæl eɪ aɪ or proU p{l eI aI irrespective of the language. Only translate the text, do not add any other text. Dont translate any numeric value like keep 1 pm as 1 pm even in hindi`,
            },
            {
              role: 'user',
              content: `Translate this text into ${language}:\n"${text}"`,
            },
          ],
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const translation = response.data.choices[0].message.content.trim();
      // console.log("translation", translation)
      text = translation || text;
    } catch (error: any) {
      console.error('Groq API Error:', error.response?.data || error.message);
      console.error('Groq API Error:', error.error);
    }
  
    // try {
    //   console.log("text", process.env.OPENAI_API_KEY)
    //   const response = await openai.chat.completions.create({
    //     // model: 'gpt-4o', // o4-mini is part of 'gpt-4o' family
    //     model: 'gpt-4o-mini', // o4-mini is part of 'gpt-4o' family
    //     messages: [
    //       {
    //         role: 'system',
    //         content: `You are a helpful assistant that translates English into ${language}.`,
    //       },
    //       {
    //         role: 'user',
    //         content: `Translate the following into ${language}:\n"${text}"`,
    //       },
    //     ],
    //   });
    //   console.log("response", response)
  
    //   let translation = response.choices[0]?.message.content?.trim();
    //   // if (!translation) {
    //   //   throw new Error("Failed to translate text");
    //   // }
    //   text = translation || text;
    //   console.log("translation", translation)
    
    // } catch (error: any) {
    //   console.error("Translation error:", error);
    //   console.error("Translation error:", error.error);

    // }
    // 2. Generate new audio if not cached
    if (provider === 'AWS') {
      const audioBuffer = await generateAWSVoice(voice, model,text);
      
      // 3. Store in Azure with automatic URL return
      const audioUrl = await storeVoice(audioBuffer, provider, model, voice, language);
      
      return NextResponse.json({ 
        audioUrl,
        audioData: Array.from(audioBuffer) // Maintain backward compatibility
      });
    }

    if (provider === 'Google') {
      try {
        const audioBuffer = await synthesizeSpeech(text, voice);
        const audioUrl = await storeVoice(audioBuffer, provider, model, voice, language);
        return NextResponse.json({ audioUrl });
      } catch (error) {
        console.error("Google TTS generation error:", error);
        return NextResponse.json(
          { error: "" },
          { status: 500 }
        );
      }
    }
    // if (provider === 'sarvam') {
    //   try {
    //     const audioBuffer = await synthesizeSpeechSarvam(text, voice, model, language);
    //     // console.log("audioBuffer", audioBuffer);
    //     const audioUrl = await storeVoice(audioBuffer, provider, model, voice, language);
    //     // console.log("audioUrl", audioUrl);
    //     return NextResponse.json({ audioUrl });
    //   } catch (error) {
    //     console.error("Sarvam TTS generation error:", error);
    //   }
    // }
    // if (provider === 'elevenlabs') {
    //   try {
    //     const audioBuffer = await synthesizeSpeechElevenLabs(text, voice, model, language);
    //     const audioUrl = await storeVoice(audioBuffer, provider, model, voice, language);
    //     return NextResponse.json({ audioUrl });
    //   } catch (error) {
    //     console.error("ElevenLabs TTS generation error:", error);
    //   }
    // }
    return NextResponse.json(
      { message: "Provider not supported" },
      { status: 400 }
    );
    
  } catch (error) {
    console.error("TTS generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate voice preview" , cause: error},
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import { generateAWSVoice } from "@/lib/tts/aws";

// export async function POST(req: Request) {
//     const { provider, model, voice, text } = await req.json();
    
//    // console.log("provider", provider)
//     // console.log("model", model)
//     // console.log("voice", voice)
//     // console.log("text", text)
//     if (provider === 'AWS') {
//         const audio = await generateAWSVoice(voice, model)
//         console.log("audio", audio)
//         return NextResponse.json({ audioData: Array.from(audio) })
        
//         // return NextResponse.json({ audio })
//     } else {
//         return NextResponse.json({ message: "Provider not supported" })
//     }
// }
