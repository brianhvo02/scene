import { model, Schema } from 'mongoose';

const theaterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    geo: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: true
});

export default model('Theater', theaterSchema);