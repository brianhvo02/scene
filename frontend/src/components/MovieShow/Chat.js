
import './Chat.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { customFetch } from '../../store/utils';

const Chat = ({ movieId }) => {
    const [messages, setMessages] = useState([
        {
            bot: true,
            content: "Hi! I'm Reel, your friendly movie chat bot. Ask me anything about this movie."
        }
    ]);
    const [input, setInput] = useState('');
    const [disabledInput, disableInput] = useState(false);
    const [chatIsOpen, toggleChat] = useState(false);

    const handleSubmit = () => {
        const userInput = {
            bot: false,
            content: input
        };
        customFetch(`/api/movies/${movieId}/chat`, {
            method: 'POST',
            body: JSON.stringify([
                ...messages,
                userInput
            ])
        }).then(({ content }) => {
            setMessages(prev => 
                prev.concat({
                    bot: true,
                    content
                })
            );
            disableInput(false);
        });
            
        setMessages(prev => prev.concat(userInput));
        setInput('');
        disableInput(true);
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter"){
            e.preventDefault();
            handleSubmit();
        }
    }

    const lastMessage = useRef();
    const messagesRef = useRef();

    const chat = useMemo(() => 
        messages.map((message, i) => 
            <p key={i} ref={i === messages.length - 1 ? lastMessage : null} className={message.bot ? 'chat-bot' : 'chat-user'}>
                {message.content}
            </p>
        ), [messages]
    );

    useEffect(() => {
        if (lastMessage.current) {
            lastMessage.current.scrollIntoView();
        }
    }, [lastMessage.current]);

    return (
        <div className='chat' >
            <FontAwesomeIcon icon={faClapperboard} bounce={messages[messages.length - 1]?.bot && !chatIsOpen} onClick={() => toggleChat(prev => !prev)}/>
            <div className={`chatbox ${chatIsOpen ? 'open' : ''}`}>
                <h1>Chat with SceneBot</h1>
                <div className='chat-messages' ref={messagesRef}>
                    {chat}
                </div>
                <div className="user-input-container">
                    <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} id="user-input-text"/>
                    <button onClick={handleSubmit} disabled={disabledInput} id="send-button">Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat;