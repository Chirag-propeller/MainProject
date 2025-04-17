// lib/azure.ts
import { BlobServiceClient } from '@azure/storage-blob'

const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!
const CONTAINER_NAME = 'knowledgebase'

export async function uploadFileToAzure(buffer: Buffer, filename: string): Promise<string> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONNECTION_STRING)
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME)

  const blockBlobClient = containerClient.getBlockBlobClient(filename)

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: 'application/octet-stream', // optional: set correct mimetype if available
    },
  })

  return blockBlobClient.url
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
