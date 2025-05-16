// lib/models/Metrics.ts
import mongoose from 'mongoose';

const OutBoundCallSchema = new mongoose.Schema({}, { strict: false, collection: 'outbound_call_data' });

const OutBoundCall = mongoose.models['outbound_call_data']  || mongoose.model('outbound_call_data', OutBoundCallSchema);

export default OutBoundCall;
