import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// You can place the helper function here or in a separate utility file
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}


export async function synthesizeSpeechElevenLabs(text: string, voiceId: string, modelId: string, language: string): Promise<Buffer> {
    try {
        console.log("ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY);
        console.log("voiceId:", voiceId, "modelId:", modelId, "language:", language, "text:", text);


        const client = new ElevenLabsClient({ 
            apiKey: process.env.ELEVENLABS_API_KEY! 
        });
    
        // 1. Get the audio as a stream from the SDK
        const audioStream = await client.textToSpeech.convert(voiceId, {
            outputFormat: "mp3_44100_128",
            text: text,
            modelId: modelId
            // languageCode: language
        });
        console.log(audioStream);
        
        // 2. Convert the stream to a buffer using the helper function
        const audioBuffer = await streamToBuffer(audioStream);
        console.log(audioBuffer);
    
        // 3. Return the final buffer
        return audioBuffer;
        
    } catch (error) {
        console.error("ElevenLabs TTS generation error:", error);
        throw new Error("Failed to synthesize speech with ElevenLabs.", { cause: error });
    }

}



// import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// export async function synthesizeSpeechElevenLabs(text: string, voiceId: string, model: string, language: string): Promise<any> {
//     const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
//     const audioStream = await client.textToSpeech.convert(voiceId, {
//         outputFormat: "mp3_44100_128",
//         text: text,
//         modelId: model
//     });

//     return audioStream;
// }
