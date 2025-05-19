import { Schema, models, model } from "mongoose";

const twilioSchema = new Schema({
    accountSid: {
        type: String,
        required: true,
        unique: true,
    },
    friendlyName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Twilio = models.Twilio || model("Twilio", twilioSchema);

export default Twilio;

