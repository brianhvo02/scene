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
        type: [Number],
        required: true
    }
}, {
    timestamps: true
});

export default model('User', userSchema);