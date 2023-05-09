import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './index.scss';
import { login } from '../../store/session';
import { clearSessionErrors } from '../../store/errors/sessionErrors';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        }
    }, [dispatch]);

    const update = (field) => {
        const setState = field === 'credential' ? setCredential : setPassword;
        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ credential, password }));
    }

    return (
        <>
            <form className='session-form' onSubmit={handleSubmit}>
                <h2>Log In Form</h2>
                <div className = 'errors'>{errors?.credentials}</div>
                <label className="input-label" htmlFor="user-credential">Username or Email</label>
                <div className='inputbox-container'>
                    <input className='inputbox' id = 'user-credential' 
                        type='text'
                        value={ credential }
                        plasceholder = "Username or Email"
                        onChange={update('credential')}
                        required
                    />
                </div>
                <div className='errors'>{errors?.password}</div>
                <label className="input-label" htmlFor="password">Password</label>
                <div className='inputbox-container'>
                    <input className='inputbox' id='password'
                        type='password'
                        value={ password }
                        plasceholder="password"
                        onChange={update('password')}
                        required
                    />
                </div>
                <button className="modal-button" id="modal-button-login" type="submit">Log in</button>
                <h2 id="modal-or">OR</h2>
                <button className="modal-button" id="modal-button-demo" onClick={() => { setCredential("DemoUser"); setPassword("password") }}>Continue as Demo User</button>
                <div className="divide-line"></div>
            </form>
        </>
    )
}

export default LoginForm;