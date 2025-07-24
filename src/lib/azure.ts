// lib/azure.ts
import { BlobSASPermissions, BlobServiceClient, generateBlobSASQueryParameters, SASProtocol, StorageSharedKeyCredential } from '@azure/storage-blob'

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!
const CONTAINER_NAME = 'knowledgebase'
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING)

export async function uploadFileToAzure(buffer: Buffer, filename: string): Promise<string> {

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME)

  const blockBlobClient = containerClient.getBlockBlobClient(filename)

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: 'application/octet-stream', // optional: set correct mimetype if available
    },
  })

  return blockBlobClient.url
}

// export async function hasVoice(filename: string): Promise<boolean> {
  
//   const blockBlobClient = containerClient.getBlockBlobClient(filename)
//   const exists = await blockBlobClient.exists()
//   return exists
// }

export async function hasVoice(provider: string, model: string, voice: string): Promise<boolean> {
  const containerClient = blobServiceClient.getContainerClient("tts")
  const filename = generateFilename(provider, model, voice);
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    return await blockBlobClient.exists();
  } catch (error) {
    console.error(`Error checking voice existence for ${filename}:`, error);
    return false;
  }
}

export async function storeVoice(
  audioData: Buffer,
  provider: string,
  model: string,
  voice: string
): Promise<string> {
  const filename = generateFilename(provider, model, voice);
  try {
    const containerClient = blobServiceClient.getContainerClient("tts")
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(audioData, {
      blobHTTPHeaders: {
        blobContentType: 'audio/mpeg',
        blobCacheControl: 'public, max-age=31536000' // 1 year cache
      }
    });
    const permissions = new BlobSASPermissions();
    permissions.read = true;
    const sasUrl = await blockBlobClient.generateSasUrl({
      permissions: permissions,
      expiresOn: new Date(Date.now() + 10 * 60 * 1000), // 1 hour
    });
    console.log("sasUrl", sasUrl)
    return sasUrl;
  } catch (error) {
    console.error(`Error storing voice ${filename}:`, error);
    throw error;
  }
}

export async function getVoiceUrl(
  provider: string,
  model: string,
  voice: string
): Promise<string | null> {
  const containerClient = blobServiceClient.getContainerClient("tts")
  const filename = generateFilename(provider, model, voice);
  try {

    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    if (await blockBlobClient.exists()) {
      const permissions = new BlobSASPermissions();
      permissions.read = true;
      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions: permissions,
        expiresOn: new Date(Date.now() + 10 * 60 * 1000), // 1 hour
      });
      console.log("sasUrl", sasUrl)
      return sasUrl;
    }
    return null;
  } catch (error) {
    console.error(`Error getting URL for ${filename}:`, error);
    return null;
  }
}

// Helper for consistent filenames
function generateFilename(provider: string, model: string, voice: string): string {
  return `${provider.toLowerCase()}/${model}/${voice}.mp3`.replace(/\s+/g, '-');
}

export async function getKnowledgeBaseFileUrl(filename: string): Promise<string | null> {
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    if (await blockBlobClient.exists()) {
      const permissions = new BlobSASPermissions();
      permissions.read = true;
      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions,
        expiresOn: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      console.log("sasUrl", sasUrl);
      return sasUrl;
    }
    return null;
  } catch (error) {
    console.error(`Error getting knowledge base file URL for ${filename}:`, error);
    return null;
  }
}

export async function getCallRecordingUrl(container: string, filename: string): Promise<string | null> {
  const containerClient = blobServiceClient.getContainerClient(container);
  try {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    if (await blockBlobClient.exists()) {
      const permissions = new BlobSASPermissions();
      permissions.read = true;
      const sasUrl = await blockBlobClient.generateSasUrl({
        permissions,
        expiresOn: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      return sasUrl;
    }
    return null;
  } catch (error) {
    console.error(`Error getting call recording URL for ${filename}:`, error);
    return null;
  }
}


// import { BlobServiceClient } from '@azure/storage-blob'
// import { v4 as uuidv4 } from 'uuid'

// const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING

// if (!AZURE_STORAGE_CONNECTION_STRING) {
//     throw new Error('Azure connection string not found in environment variables.')
//   }

// export const uploadFileToAzure = async (
//   localFilePath: string,
//   originalName: string,
//   containerName: string = 'knowledgebase'
// ): Promise<string> => {
//   const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING)
//   const containerClient = blobServiceClient.getContainerClient(containerName)

//   const blobName = `${uuidv4()}-${originalName}`
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName)

//   await blockBlobClient.uploadFile(localFilePath)

//   return blockBlobClient.url
// }
