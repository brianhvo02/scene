import {model, Schema} from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hasProfilePic: {
        type: Boolean,
        required: true,
        default: false
    },
    zipCode: {
        type: Number
    },
    hashedPassword: {
        type: String,
        required: true
    },
    genreIds: {
        type: [Number],
        required: true
    },
    likedMovies: {
        type: [],
        required: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    coordinates: {
        latitude: {
            type: Number,
            // required: true
        },
        longitude: {
            type: Number,
            // required: true
        }
    }
}, {
    timestamps: true
});

export default model('User', userSchema);