// lib/models/Metrics.ts
import mongoose from 'mongoose';

const AggregatedMetricsSchema = new mongoose.Schema({}, { strict: false, collection: 'aggregated_metrics' });

const AggregatedMetrics = mongoose.models.Metrics || mongoose.model('AggregatedMetrics', AggregatedMetricsSchema);

export default AggregatedMetrics;
