import mongoose, { Schema, model } from 'mongoose';

const contactSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    metadata: {
        type: Object,
    },
    status: {
        type: String,
        default: 'pending'
    },
}, { timestamps: true });

  export default mongoose.models.Contact ||
    mongoose.model('Contact', contactSchema)

