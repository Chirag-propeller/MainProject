import mongoose from 'mongoose';

const CampaignCallSchema = new mongoose.Schema({
  campaignCallName: {
    type: String,
    // required: true,
    trim: true,
  },
  campaignCallId: {
    type: String,
    // required: true,
    // unique: true,
  },
  fromNumber: {
    type: String,
    // required: true,
  },
  attachmentId: {
    type: String,
    required: false, 
  },
  callDate: {
    type: Date,
    required: false,
  },
  callTimezone: {
    type: String,
    required: false,
  },
  callScheduledOrNot: {
    type: Boolean,
    required: false,
  },
  callTime: {
    type: String,
    required: false,
  },
  recipients: [{ type: String,}],
  // userId{type: objectId}
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Prevent model overwrite in development
export default mongoose.models.CampaignCall || mongoose.model('CampaignCall', CampaignCallSchema);
