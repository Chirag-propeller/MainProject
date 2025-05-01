import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import knowledgeBaseModel from '@/model/knowledgeBase/knowledgeBase.model'
import fileModel from '@/model/knowledgeBase/file.model'
import linkModel from '@/model/knowledgeBase/link.model'
import { uploadFileToAzure } from '@/lib/azure'
import { getUserFromRequest } from '@/lib/auth'
import User from '@/model/user/user.model'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const user = await getUserFromRequest(req);
    const formData = await req.formData()
    const name = formData.get('name')?.toString() || 'Default Knowledge Base'
    // const userId = formData.get('userId')?.toString() || 'Admin01'
    const linksRaw = formData.get('links')?.toString() || '[]'

    const linksArray: string[] = JSON.parse(linksRaw)

    // Step 1: Create knowledge base
    const knowledgeBase = await knowledgeBaseModel.create({
      name,
      userId:user.userId,
      sourceType: 'upload',
    })

    // Step 2: Save links
    // if (linksArray.length > 0) {
    //   await Promise.all(
    //     linksArray.map((url) =>
    //       linkModel.create({
    //         url,
    //         knowledgeBaseId: knowledgeBase._id,
    //       })
    //     )
    //   )
    // }

    // Step 2: Save links and collect their IDs
    const createdLinks = await Promise.all(
      linksArray.map((url) =>
        linkModel.create({
          url,
          knowledgeBaseId: knowledgeBase._id,
        })
      )
    )

    // Extract the _ids
    const linkIds = createdLinks.map(link => link._id)
    

    // Step 3: Handle file uploads (multiple supported)
    const uploadedFiles = []
    for (const entry of formData.entries()) {
      const [key, value] = entry
      if (key === 'file' && typeof(value) === "object") {
        const arrayBuffer = await value.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        console.log(buffer);
        const azureUrl = await uploadFileToAzure(buffer, value.name)

        const dbFile = await fileModel.create({
          name: value.name,
          url: azureUrl,
          size: value.size,
          type: value.type,
          source: 'upload',
          knowledgeBaseId: knowledgeBase._id,
        })

        uploadedFiles.push(dbFile)
      }
    }
    await User.findByIdAndUpdate(user.userId, { $push: { phoneNumbers: knowledgeBase._id } });

    // User.findByIdAndUpdate({_id: user.userId})
    // Step 4: Attach file IDs to knowledge base
    await knowledgeBaseModel.findByIdAndUpdate(knowledgeBase._id, {
      // $push: { files: { $each: uploadedFiles.map((f) => f._id) } },
      $push: {
        files: { $each: uploadedFiles.map((f) => f._id) },
        links: { $each: linkIds }
      }
    })
    
    return NextResponse.json({
      success: true,
      knowledgeBase,
      files: uploadedFiles,
    })
  } catch (err: any) {
    console.error('Upload error:', err?.message || err)
    console.error('Full Error:', err)
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
    
  // catch (err) {
  //   console.error('Upload error:', err)
  //   return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  // }
}




// import { NextRequest, NextResponse } from 'next/server'
// import fs from 'fs'
// import path from 'path'
// import formidable from 'formidable'
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
// // Helper to parse FormData
// const parseForm = (req: NextRequest): Promise<{ fields: any; files: any }> => {
//   const form = formidable({ multiples: true, keepExtensions: true, uploadDir: '/tmp' })

//   return new Promise((resolve, reject) => {
//     form.parse(req as any, (err:any, fields:any, files:any) => {
//       if (err) reject(err)
//       else resolve({ fields, files })
//     })
//   })
// }

// export async function POST(req: NextRequest) {
//   await dbConnect()

//   const { fields, files } = await parseForm(req)
//   let userId = fields.userId?.toString()
//   let name = fields.name?.toString()
//   const rawLinks = fields.links?.toString() // JSON string array of URLs
//   if (!userId){
//     userId= "Admin01";
//   }
//   if (!name){
//     name = "Default Knowledge Base";
//   }
//   if (!userId || !name) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
//   }

//   const linksArray: string[] = rawLinks ? JSON.parse(rawLinks) : []

//   // Step 1: Create knowledge base
//   const knowledgeBase = await knowledgeBaseModel.create({
//     name,
//     userId,
//     sourceType: 'upload',
//   })

//   // Step 2: Save links
//   if (linksArray.length > 0) {
//     await Promise.all(
//       linksArray.map((url) =>
//         linkModel.create({
//           url,
//           knowledgeBaseId: knowledgeBase._id,
//         })
//       )
//     )
//   }

//   // Step 3: Handle file upload
//   const uploadedFiles = await Promise.all(
//     (Array.isArray(files.file) ? files.file : [files.file]).map(async (file: any) => {
//       const azureUrl = await uploadFileToAzure(file.filepath, file.originalFilename)

//       const dbFile = await fileModel.create({
//         name: file.originalFilename,
//         url: azureUrl,
//         size: file.size,
//         type: file.mimetype,
//         source: 'upload',
//         userId,
//         knowledgeBaseId: knowledgeBase._id,
//       })

//       // Remove file from local after upload
//       fs.unlinkSync(file.filepath)
//       return dbFile
//     })
//   )

//   // Step 4: Add file IDs to knowledge base
//   await knowledgeBaseModel.findByIdAndUpdate(knowledgeBase._id, {
//     $push: { files: { $each: uploadedFiles.map((f) => f._id) } },
//   })

//   return NextResponse.json({
//     success: true,
//     knowledgeBase,
//     files: uploadedFiles,
//   })
// }
