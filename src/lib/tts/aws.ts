// lib/tts/aws.ts
import { PollyClient, SynthesizeSpeechCommand, VoiceId } from '@aws-sdk/client-polly'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// const SAMPLE_TEXT = 'This is how I sound as your voice assistant.'

const polly = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function generateAWSVoice(voiceName: string, model: string, text: string): Promise<Buffer> {
    const engine = model === 'standard' ? 'standard' : model === 'neural' ? 'neural' : 'generative' 
  const command = new SynthesizeSpeechCommand({
    OutputFormat: 'mp3',
    VoiceId: voiceName as VoiceId,
    Text: text,
    // Engine: model === 'standard' ? 'standard' : 'neural',
    Engine: engine,
  })

  const response = await polly.send(command)

  const audioStream = await response.AudioStream

 if (!audioStream) {
    // console.log("audioStream", audioStream)
    throw new Error('Failed to generate audio from Polly')
  }

  const chunks: Uint8Array[] = []
  const arr = await audioStream.transformToByteArray()
  // console.log("arr", arr)

//   for await (const chunk of arr) {
//     chunks.push(chunk as Uint8Array)
//   }

  return Buffer.from(arr)
}
