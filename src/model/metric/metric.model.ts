// lib/models/Metrics.ts
import mongoose from 'mongoose';

const MetricsSchema = new mongoose.Schema({}, { strict: false, collection: 'metrics' });

const Metrics = mongoose.models.Metrics || mongoose.model('Metrics', MetricsSchema);

export default Metrics;
