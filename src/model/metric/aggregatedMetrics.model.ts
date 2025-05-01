// lib/models/Metrics.ts
import mongoose from 'mongoose';

const AggregatedMetricsSchema = new mongoose.Schema({}, { strict: false, collection: 'aggregated_metrics' });

export default mongoose.models.AggregatedMetrics || 
       mongoose.model('AggregatedMetrics', AggregatedMetricsSchema)

// const AggregatedMetrics = mongoose.models.AggregatedMetrics || mongoose.model('AggregatedMetrics', AggregatedMetricsSchema);

// export default AggregatedMetrics;
