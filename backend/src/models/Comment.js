import {model, Schema} from 'mongoose';

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    childrenComments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    }]
}, {
    timestamps: true
});


export default model('Comment', commentSchema);