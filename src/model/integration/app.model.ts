import mongoose, { Schema, Document, models, model } from "mongoose";


interface IApp extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    accessToken: string;
    provider: string;
    refreshToken?: string;
    expiresIn?: Date;
    tokenType?: string;
    idToken?: string;
    scope?: string;
    integrationType?: string;
}

const AppSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String},
    provider: { type: String, required: true }, 
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresIn: { type: Date },
    tokenType: { type: String },
    idToken: { type: String },
    scope: { type: String },
    integrationType: { type: String },
}, { timestamps: true });


export default models.App || model<IApp>('App', AppSchema);





//temp example
// {
//   _id: ObjectId("..."),
//   userId: ObjectId("..."),
//   name: "Zoho CRM",              // 🟡 Human-friendly label
//   provider: "zoho",             // 🔵 System-level identifier (used in logic)
//   integration_type: "crm",     // 🟣 Category/type of integration
//   access_token: "abc123...",
//   refresh_token: "xyz456...",
//   token_type: "Bearer",
//   scope: "ZohoCRM.modules.ALL",
//   expires_in: 3600,
//   expires_at: ISODate("2025-05-30T13:45:00Z"),
//   createdAt: ISODate("2025-05-30T12:45:00Z"),
//   updatedAt: ISODate("2025-05-30T12:45:00Z")
// }
