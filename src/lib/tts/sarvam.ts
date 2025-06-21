// import { SarvamVoice } from '@mastra/voice-sarvam';
// import { NextRequest } from "next/server";  
// import { SarvamAIClient } from "sarvamai";

// async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
//   const chunks: Buffer[] = [];
//   for await (const chunk of stream) {
//     chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
//   }
//   return Buffer.concat(chunks);
// }

// export async function synthesizeSpeechSarvam(text: string, voice: any, model: any, language: any): Promise<Buffer> {
//   try {
//     const client = new SarvamAIClient({
//       apiSubscriptionKey: process.env.SARVAM_API_KEY,
//     });

//     const response = await client.textToSpeech.convert({
//       text: text,
//       model: model,
//       speaker: voice,
//       target_language_code: language,
//       enable_preprocessing: true,
//     });
//     console.log(response);
//     const audioStream = response.audio as NodeJS.ReadableStream;
//     const audioBuffer = await streamToBuffer(audioStream);
    
//     return audioBuffer; 
//   } catch (error) {
//     console.error("Sarvam TTS generation error:", error);
//     throw new Error("Failed to create Sarvam TTS client.", { cause: error });
//   }
// }



import { SarvamAIClient } from "sarvamai";

export async function synthesizeSpeechSarvam(text: string, voice: any, model: any, language: any): Promise<any> {
  try {
    const client = new SarvamAIClient({
      apiSubscriptionKey: process.env.SARVAM_API_KEY,
    });

    const response = await client.textToSpeech.convert({
      text: text,
      model: model,
      speaker: voice,
      target_language_code: language,
    });
    if (!response.audios || response.audios.length === 0) {
      throw new Error("Sarvam API did not return any audio data.");
    }

    // 2. Get the Base64 encoded string from the first element of the array
    const base64Audio = response.audios[0];

    // 3. Decode the Base64 string into a binary Buffer
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    
    return audioBuffer;

    // Return the stream directly
    // return response.audio as unknown as NodeJS.ReadableStream; 

  } catch (error) {
    console.error("Sarvam TTS generation error:", error);
    throw new Error("Failed to create Sarvam TTS stream.", { cause: error });
  }
}
