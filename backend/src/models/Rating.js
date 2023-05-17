import { model, Schema } from "mongoose";

const ratingSchema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    rater: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    timestamps: true
});

export default model('Rating', ratingSchema)