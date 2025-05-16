import mongoose from "mongoose";


const ctaLeadsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
}
);

const CtaLeads = mongoose.models.CtaLeads || mongoose.model('CtaLeads', ctaLeadsSchema);

export default CtaLeads;
