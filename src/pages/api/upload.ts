import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingMessage } from 'node:http'
import dbConnect from '@/lib/mongodb'
import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
import fileModel from '@/model/knowledgeBase/file.model'
import linkModel from '@/model/knowledgeBase/link.model'
import { uploadFileToAzure } from '@/lib/azure'
// import Busboy from 'busboy'
const Busboy = require('busboy')
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect()

    const busboy = new Busboy({ headers: req.headers })
    const files: any[] = []
    const fields: { [key: string]: string } = {}

    busboy.on('field', (fieldname:any, val:any) => {
      fields[fieldname] = val
    })

    busboy.on('file', async (fieldname:any, file:any, filename:any, encoding:any, mimetype:any) => {
      const filePath = path.join('/tmp', filename)

      const writeStream = fs.createWriteStream(filePath)
      file.pipe(writeStream)

      writeStream.on('close', async () => {
        try {
          const fileBuffer = fs.readFileSync(filePath)

          // Upload the file to Azure (or your cloud storage)
          const azureUrl = await uploadFileToAzure(fileBuffer, filename)

          // Save the file details in the database
          const dbFile = await fileModel.create({
            name: filename,
            url: azureUrl,
            size: fileBuffer.length,
            type: mimetype,
            source: 'upload',
          })

          files.push(dbFile)

          // Delete the temporary file
          fs.unlinkSync(filePath)
        } catch (error) {
          console.error('Error processing file:', error)
        }
      })
    })

    busboy.on('finish', async () => {
      const name = fields.name || 'Default Knowledge Base'
      const linksRaw = fields.links || '[]'
      const linksArray: string[] = JSON.parse(linksRaw)

      // Step 1: Create knowledge base entry
      const knowledgeBase = await knowledgeBaseModel.create({
        name,
        sourceType: 'upload',
      })

      // Step 2: Save links to the database
      const createdLinks = await Promise.all(
        linksArray.map((url) =>
          linkModel.create({
            url,
            knowledgeBaseId: knowledgeBase._id,
          })
        )
      )
      const linkIds = createdLinks.map(link => link._id)

      // Step 3: Update knowledge base with file references
      await knowledgeBaseModel.findByIdAndUpdate(knowledgeBase._id, {
        $push: {
          files: { $each: files.map((f) => f._id) },
          links: { $each: linkIds },
        },
      })

      // Send success response
      return res.status(200).json({
        success: true,
        knowledgeBase,
        files,
      })
    })

    req.pipe(busboy)
  } catch (err:any) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: err.message || 'Upload failed' })
  }
}


// import formidable from 'formidable'
// import fs from 'fs'
// import dbConnect from '@/lib/mongodb'
// import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
// import fileModel from '@/model/knowledgeBase/file.model'
// import linkModel from '@/model/knowledgeBase/link.model'
// import { uploadFileToAzure } from '@/lib/azure'

// export const config = {
//   api: {
//     bodyParser: false, // We need to handle the body parsing manually with Formidable
//   },
// }

// export default async function POST(req: any, res: any) {
//   try {
//     await dbConnect()

//     // Initialize formidable to parse the incoming request
//     const form = new formidable.IncomingForm({
//       multiples: true,
//       keepExtensions: true,
//     })

//     form.parse(req, async (err: any, fields: any, files: any) => {
//       if (err) {
//         console.error('Form parsing error:', err)
//         return res.status(500).json({ error: 'Form parsing error', message: err.message })
//       }

//       // Handle form fields (e.g., links and name)
//       const name = fields.name?.toString() || 'Default Knowledge Base'
//       const linksRaw = fields.links?.toString() || '[]'
//       const linksArray: string[] = JSON.parse(linksRaw)

//       // Step 1: Create knowledge base entry
//       const knowledgeBase = await knowledgeBaseModel.create({
//         name,
//         sourceType: 'upload',
//       })

//       // Step 2: Save links to the database
//       const createdLinks = await Promise.all(
//         linksArray.map((url) =>
//           linkModel.create({
//             url,
//             knowledgeBaseId: knowledgeBase._id,
//           })
//         )
//       )
//       const linkIds = createdLinks.map(link => link._id)

//       // Step 3: Handle file uploads (ensure it's an array and process each file)
//       const uploadedFiles: any[] = []
//       if (files.file) {
//         const filesArray = Array.isArray(files.file) ? files.file : [files.file]

//         for (const file of filesArray) {
//           if (!file.filepath) {
//             console.error('File missing filepath:', file)
//             continue // Skip this file and move to the next
//           }

//           try {
//             const fileBuffer = await fs.promises.readFile(file.filepath)
//             const azureUrl = await uploadFileToAzure(fileBuffer, file.originalFilename)

//             const dbFile = await fileModel.create({
//               name: file.originalFilename,
//               url: azureUrl,
//               size: file.size,
//               type: file.mimetype,
//               source: 'upload',
//               knowledgeBaseId: knowledgeBase._id,
//             })

//             uploadedFiles.push(dbFile)

//             // Clean up the temporary file after uploading to Azure
//             await fs.promises.unlink(file.filepath)

//           } catch (uploadError:any) {
//             console.error('Error uploading file:', file.originalFilename, uploadError)
//             return res.status(500).json({ error: 'Error uploading file', message: uploadError.message })
//           }
//         }
//       }

//       // Step 4: Update knowledge base with links and file references
//       await knowledgeBaseModel.findByIdAndUpdate(knowledgeBase._id, {
//         $push: {
//           files: { $each: uploadedFiles.map((f) => f._id) },
//           links: { $each: linkIds },
//         },
//       })

//       // Send success response
//       return res.status(200).json({
//         success: true,
//         knowledgeBase,
//         files: uploadedFiles,
//       })
//     })
//   } catch (err: any) {
//     console.error('Upload error:', err?.message || err)
//     return res.status(500).json({ error: err?.message || 'Upload failed' })
//   }
// }


// import formidable from 'formidable'
// const formidable = require('formidable');

// import fs from 'fs'
// import path from 'path'
// import dbConnect from '@/lib/mongodb'
// import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
// import fileModel from '@/model/knowledgeBase/file.model'
// import linkModel from '@/model/knowledgeBase/link.model'
// import { uploadFileToAzure } from '@/lib/azure'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// export async function POST(req: any, res: any) {
//   try {
//     await dbConnect()

//     // Initialize formidable to parse the incoming request
//     const form = new formidable.IncomingForm({
//       multiples: true,
//       keepExtensions: true,
//     })

//     form.parse(req, async (err:any, fields:any, files:any) => {
//       if (err) {
//         console.error('Form parsing error:', err)
//         return res.status(500).json({ error: 'Form parsing error' })
//       }

//       // Handle form fields (e.g., links)
//       const name = fields.name?.toString() || 'Default Knowledge Base'
//       const linksRaw = fields.links?.toString() || '[]'
//       const linksArray: string[] = JSON.parse(linksRaw)

//       // Step 1: Create knowledge base entry
//       const knowledgeBase = await knowledgeBaseModel.create({
//         name,
//         sourceType: 'upload',
//       })

//       // Step 2: Save links to the database
//       const createdLinks = await Promise.all(
//         linksArray.map((url) =>
//           linkModel.create({
//             url,
//             knowledgeBaseId: knowledgeBase._id,
//           })
//         )
//       )
//       const linkIds = createdLinks.map(link => link._id)

//       // Step 3: Handle file uploads
//       const uploadedFiles: any[] = []
//       if (files.file) {
//         const filesArray = Array.isArray(files.file) ? files.file : [files.file]

//         for (const file of filesArray) {
//           if (!file.filepath) {
//             throw new Error('Filepath is missing.')
//           }

//           const fileBuffer = await fs.promises.readFile(file.filepath)
//           const azureUrl = await uploadFileToAzure(fileBuffer, file.originalFilename)

//           const dbFile = await fileModel.create({
//             name: file.originalFilename,
//             url: azureUrl,
//             size: file.size,
//             type: file.mimetype,
//             source: 'upload',
//             knowledgeBaseId: knowledgeBase._id,
//           })

//           uploadedFiles.push(dbFile)

//           // Remove the temporary file after upload
//           fs.unlinkSync(file.filepath)
//         }
//       }

//       // Step 4: Update knowledge base with links and file references
//       await knowledgeBaseModel.findByIdAndUpdate(knowledgeBase._id, {
//         $push: {
//           files: { $each: uploadedFiles.map((f) => f._id) },
//           links: { $each: linkIds },
//         },
//       })

//       // Send success response
//       return res.status(200).json({
//         success: true,
//         knowledgeBase,
//         files: uploadedFiles,
//       })
//     })
//   } catch (err: any) {
//     console.error('Upload error:', err?.message || err)
//     return res.status(500).json({ error: err?.message || 'Upload failed' })
//   }
// }


// // pages/api/upload.ts

// import { NextApiRequest, NextApiResponse } from 'next'
// import formidable from 'formidable'
// import dbConnect from '@/lib/mongodb'
// import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
// import fileModel from '@/model/knowledgeBase/file.model'
// import linkModel from '@/model/knowledgeBase/link.model'
// import { uploadFileToAzure } from '@/lib/azure'
// import fs from 'fs/promises'

// // Disable built-in bodyParser because formidable handles it
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' })
//   }

//   try {
//     await dbConnect()

//     const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true })

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         console.error('Form parse error:', err)
//         return res.status(500).json({ error: 'Form parsing failed' })
//       }

//       const name = fields.name?.toString() || 'Default Knowledge Base'
//       const linksRaw = fields.links?.toString() || '[]'
//       const linksArray: string[] = JSON.parse(linksRaw)

//       // Step 1: Create the Knowledge Base
//       const knowledgeBase = await knowledgeBaseModel.create({
//         name,
//         sourceType: 'upload',
//       })

//       // Step 2: Create link entries
//       const createdLinks = await Promise.all(
//         linksArray.map((url) =>
//           linkModel.create({
//             url,
//             knowledgeBaseId: knowledgeBase._id,
//           })
//         )
//       )

//       const linkIds = createdLinks.map((link) => link._id)

//       // Step 3: Handle file uploads
//       const uploadedFiles = []
//       const fileArray = Array.isArray(files.file) ? files.file : [files.file]

//       for (const file of fileArray) {
//         if (!file) continue;

//         if (file.filepath == null) { // <- important
//           throw new Error('Filepath is missing.')
//         }
        
//         const fileBuffer = await fs.readFile(file.filepath);
//         const azureUrl = await uploadFileToAzure(fileBuffer, file.originalFilename || 'uploaded-file');
        

//         const dbFile = await fileModel.create({
//           name: file.originalFilename,
//           url: azureUrl,
//           size: file.size,
//           type: file.mimetype,
//           source: 'upload',
//           knowledgeBaseId: knowledgeBase._id,
//         })

//         uploadedFiles.push(dbFile)
//       }

//       // Step 4: Attach file and link IDs to knowledge base
//       await knowledgeBaseModel.findByIdAndUpdate(knowledgeBase._id, {
//         $push: {
//           files: { $each: uploadedFiles.map((f) => f._id) },
//           links: { $each: linkIds },
//         },
//       })

//       return res.status(200).json({
//         success: true,
//         knowledgeBase,
//         files: uploadedFiles,
//       })
//     })
//   } catch (error: any) {
//     console.error('Upload handler error:', error)
//     return res.status(500).json({ error: error?.message || 'Upload failed' })
//   }
// }
