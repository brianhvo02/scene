import { model, Schema } from "mongoose";

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        required: true
    },
    host_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true
});

export default model('Event', eventSchema);