import mongoose, { Schema, Document } from 'mongoose';
import { ST } from 'next/dist/shared/lib/utils';

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
  agentId: {
    type: String,
    ref: 'Agent',
  },
  followUp:{
    type: Boolean,
  },
  noOfFollowUps: {
    type: String,
  },
  concurrentCalls: {
    type: Number,
    default: 0,
  },
  fromNumber: {
    type: String,
    // required: true,
  },
  attachmentId: {
    type: String,
    required: false, 
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'draft'],
    default: 'ongoing',
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
  slotDates:{
    type: Array,
  },
  slotTime:{
    type: String,
  },
  goal:{
    type: String,
  },
  dataToCollect:{
    type: Array,
  },
  // New: structured call tracking setup (array of subdocuments)
  trackingSetup: [
    {
      fieldName: { type: String, default: '' },
      description: { type: String, default: '' },
      successCriteria: {
        type: String,
        enum: [
          'Achieved/Not Achieved',
          'Yes/No',
          '0-10 Scale',
          'Percentage',
          'Count',
        ],
        default: 'Achieved/Not Achieved',
      },
    },
  ],
  // New: structured list of data fields to collect during call
  dataFields: [
    {
      fieldName: { type: String, default: '' },
      description: { type: String, default: '' },
    },
  ],
  mandatoryAdherence:{
    type: String,
  },
  recipientFile:{
    type: String,
  },
  recipientFileProvider:{
    type: String,
    enum: ['csv', 'googleSheet'],
  },
  recipientFileLink:{
    type: String,
  },
  recipientFileId:{
    type: String,
  },
  recipientFileName:{
    type: String,
  },
  agent:{
    type: JSON,
  },

  recipients: [{ type: String,}],
  userId: {type: Schema.Types.ObjectId},
  outboundCallId: [{ type: Schema.Types.ObjectId, ref: 'outbound_call_data' , default: []}],
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Prevent model overwrite in development
export default mongoose.models.CampaignCall || mongoose.model('CampaignCall', CampaignCallSchema);
