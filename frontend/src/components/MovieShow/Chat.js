
import './Chat.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendChatQuery } from '../../store/movies';

const Chat = ({ movieId }) => {
    const [chat, setChat] = useState([
        {
            bot: true,
            text: "Hi! I'm Reel, your friendly movie chat bot. Ask me anything about this movie."
        }
    ]);
    const [input, setInput] = useState('');
    const [previousQuery, setPreviousQuery] = useState({});
    const [disabledInput, disableInput] = useState(false);
    const [chatIsOpen, toggleChat] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = () => {
        dispatch(sendChatQuery(input, previousQuery, movieId))
            .then(({response, previousQuery}) => {
                setChat(prev => 
                    prev.concat({
                        bot: true,
                        text: response
                    })
                );
                setPreviousQuery(previousQuery);
                disableInput(false);
            });
        setChat(prev => 
            prev.concat({
                bot: false,
                text: input
            })
        );
        setInput('');
        disableInput(true);
    }

    const lastMessage = useRef();
    const messagesRef = useRef();

    const messages = useMemo(() => 
        chat.map((message, i) => 
            <p key={i} ref={i === chat.length - 1 ? lastMessage : null} className={message.bot ? 'chat-bot' : 'chat-user'}>
                {message.text}
            </p>
        ), [chat]
    );

    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView();
        }
    }, [lastMessage.current]);

    return (
        <div className='chat'>
            <FontAwesomeIcon icon={faClapperboard} bounce={chat[chat.length - 1]?.bot && !chatIsOpen} onClick={() => toggleChat(prev => !prev)}/>
            <div className={`chatbox ${chatIsOpen ? 'open' : ''}`}>
                <h1>Chat with SceneBot</h1>
                <div className='chat-messages' ref={messagesRef}>
                    {messages}
                </div>
                <div>
                    <textarea value={input} onChange={e => setInput(e.target.value)} />
                    <button onClick={handleSubmit} disabled={disabledInput}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat;