// lib/tts/google.ts
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// This is the sample text that will be synthesized.

const client = new TextToSpeechClient();

export async function synthesizeSpeech(text: string, voiceName: string): Promise<Buffer> {
  const languageCode = voiceName.split('-').slice(0, 2).join('-');
  console.log("text", text);
  const request = {
    input: { text: text },
    voice: {
      name: voiceName,
      languageCode: languageCode,
    },
    audioConfig: { audioEncoding: 'MP3' as const },
  };

  // Perform the text-to-speech request.
  const [response] = await client.synthesizeSpeech(request);
  const audioContent = response.audioContent;

  if (!audioContent) {
    throw new Error('Failed to generate audio from Google TTS.');
  }
  return Buffer.from(audioContent as Uint8Array);
}



// // Server-side implementation (Node.js)
// const textToSpeech = require('@google-cloud/text-to-speech');
// const client = new textToSpeech.TextToSpeechClient();

// export async function synthesizeSpeech(text: string, voiceName: string) {
//     const request = {
//         input: { text: text },
//         voice: { name: voiceName, languageCode: 'en-US' },
//         audioConfig: { audioEncoding: 'MP3' },
//     };
    
//     const [response] = await client.synthesizeSpeech(request);
//     console.log("response", response)
//     return response.audioContent;
// }