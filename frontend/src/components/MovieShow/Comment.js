import './Comment.scss';
import { useEffect, useMemo, useRef, useState } from "react";
import { createComment, deleteComment, editComment } from "../../store/movies";
import { useDispatch, useSelector } from "react-redux";
import { clearcommentErrors, receivecommentErrors, useClearcommentErrors } from '../../store/errors/commentErrors';


const CommentBox = ({ movieId, comments, userId }) => {
    const dispatch = useDispatch();
    const [activeComment, setActiveComment] = useState('');
    const [replyComment, setReplyComment] = useState();
    const [edit, setEdit] = useState();
    const errors = useSelector(state => state.errors.comment);

    useClearcommentErrors();

    const CommentCreate = ({ editBody = '', disabled = false }) => {
        const [commentBody, setCommentBody] = useState(editBody);

        return (
            <div className='create-comment'>
                <textarea className='comment comment-body' placeholder={
                    'Add a comment...'
                } value={commentBody} onChange={e => setCommentBody(e.target.value)} disabled={disabled} />
                {
                    commentBody &&
                    <>
                        <button className='event-create-button' onClick={() => {
                            setCommentBody('');
                            setReplyComment();
                            setEdit();
                        }}>Cancel</button>
                        <button className='event-create-button' 
                            onClick={
                                () => {
                                    const errors = [];
                                    if (commentBody.length < 2 || commentBody.length > 500) errors.push('Comment must be between 2 and 500 characters')

                                    if (errors?.length) {
                                        dispatch(receivecommentErrors({ errors }));
                                    }

                                    dispatch((edit ? editComment : createComment)(commentBody, movieId, edit || replyComment))
                                        .then(() => {
                                            setCommentBody('');
                                            setReplyComment();
                                            setEdit();
                                        })
                                }
                            }>{replyComment ? 'Reply' : edit ? 'Edit' : 'Comment'}</button>
                    </>
                }
                {errors?.map(error => {
                    return <p key={`${error}-1`} className='errors comment-errors'>{error}</p>
                })}
            </div>
        )
    }

    const Comment = ({ id, body, author, children }) => {

        return (
            <div className='comment'>
                <div className='comment-body-box' onMouseEnter={() => !replyComment && setActiveComment(id)} onMouseLeave={() => setActiveComment()}>
                    <span>
                        <p className='comment-username'>{author.username}:</p>
                        <p className='comment-body'>{body}</p>
                    </span>
                    <span>
                        {
                            (activeComment === id || replyComment === id || edit === id) && body !== '[DELETED]' &&
                            <>
                                {
                                    author._id === userId &&
                                    <button className='event-create-button' 
                                        onClick={
                                            () => {
                                                edit
                                                    ? setEdit()
                                                    : setEdit(id);
                                                setReplyComment();
                                            }
                                        }>Edit</button>
                                }
                                {
                                    author._id === userId &&
                                    <button className='event-create-button' 
                                        onClick={
                                            () => dispatch(deleteComment(id, movieId))
                                        }>Remove</button>
                                }
                                <button className='event-create-button'
                                    onClick={
                                        () => {
                                            replyComment
                                                ? setReplyComment()
                                                : setReplyComment(id);
                                            setEdit();
                                        }
                                    }>Reply</button>
                            </>
                        }
                    </span>
                </div>
                {id === replyComment ? <CommentCreate /> : null}
                {id === edit ? <CommentCreate editBody={body} /> : null}
                <div className='children'>
                    {
                        children.map(child => <Comment key={child._id} id={child._id} body={child.body} author={child.author} children={child.childrenComments} />)
                    }
                </div>
            </div>
        )
    }

    const commentElements = useMemo(() => 
        comments.map(comment =>
            <Comment key={comment._id} id={comment._id} body={comment.body} author={comment.author} children={comment.childrenComments} />
        ), 
    [comments, activeComment, replyComment, edit]);

    return (
        <div className='comments-box'>
            <div className='comments'>
                <CommentCreate disabled={!!replyComment} />
                {commentElements}
            </div>
        </div>
    )
}

export default CommentBox;