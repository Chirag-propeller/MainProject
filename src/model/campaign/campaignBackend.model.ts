import mongoose from 'mongoose';

const CampaignBackendSchema = new mongoose.Schema({}, { strict: false, collection: 'campaigns' });

export default mongoose.models.Campaigns || 
       mongoose.model('Campaigns', CampaignBackendSchema)