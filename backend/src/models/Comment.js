import {model, Schema} from 'mongoose';

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: Text,
        required: true
    },
    childrenComment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }]
}, {
    timestamps: true
});


export default model('Comment', commentSchema);