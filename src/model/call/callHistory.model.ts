// lib/models/Metrics.ts
import mongoose from 'mongoose';

const CallHistorySchema = new mongoose.Schema({}, { strict: false, collection: 'callHistory' });

const CallHistory = mongoose.models.CallHistory || mongoose.model('CallHistory', CallHistorySchema);

export default CallHistory;
