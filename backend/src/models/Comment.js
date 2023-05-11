import {model, Schema} from 'mongoose';

const commentSchema = new Schema({
    author: {
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
        required: true,
        autopopulate: true
    }]
}, {
    timestamps: true
});


export default model('Comment', commentSchema);