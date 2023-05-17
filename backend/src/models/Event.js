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
    ticketUrl: {
        type: String,
        required: true
    },
    ticketType: {
        type: String,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    },
    theater: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    tmdb: {
        type: String
    }
}, {
    timestamps: true
});

export default model('Event', eventSchema);