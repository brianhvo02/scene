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
        required: true,
        default: []
    },
    likedMovies: {
        type: [Number],
        required: true,
        default: []
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
}, {
    timestamps: true
});

export default model('User', userSchema);