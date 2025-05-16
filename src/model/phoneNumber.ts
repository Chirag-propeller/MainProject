import mongoose from 'mongoose';

const phoneNumberSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    // unique: true,
  },
  terminationUri: {
    type: String,
    // required: true,
  },
  sipTrunkUserName: {
    type: String,
    default: '', // Optional
  },
  sipTrunkPassword: {
    type: String,
    default: '', // Optional
  },
  nickname: {
    type: String,
    default: '', // Optional
  },
  provider: {
    type: String,
  },
  agentAttached: {
    type: Boolean,
    default: false,
  },
  agentName: {
    type: String,
    default: '', // Optional — could also use ref to Agent schema if needed
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true // Optional: adds createdAt and updatedAt
});

const PhoneNumber = mongoose.models.PhoneNumber || mongoose.model('PhoneNumber', phoneNumberSchema);

export default PhoneNumber;
