import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './index.scss';
import { signup } from '../../store/session';
import { clearSessionErrors } from '../../store/errors/sessionErrors';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        }
    }, [dispatch]);

    const update = (field) => {
        let setState;
        switch (field) {
            case 'email':
                setState = setEmail;
                break;
            case 'username':
                setState = setUsername;
                break;
            case 'password':
                setState = setPassword;
                break;
            case 'password2':
                setState = setPassword2;
                break;
            default:
                throw Error ('Unknown field in Signup Form');
        }
        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            email,
            username,
            password,
        };
        dispatch(signup(user))
    }

    return (
        <form className="session-form" onSubmit={handleSubmit}>
            <h2>Sign Up Form</h2>
            <div className="errors">{errors?.email}</div>
            <label className="input-label" htmlFor="user-email">Email</label>
            <div className='inputbox-container'>
                <input className='inputbox' id='user-email'
                    type='text'
                    value={email}
                    plasceholder="Email"
                    onChange={update('email')}
                    required
                />
            </div>
            <div className="errors">{errors?.username}</div>
            <label className="input-label" htmlFor="user-username">Username</label>
            <div className='inputbox-container'>
                <input className='inputbox' id='user-username'
                    type='text'
                    value={username}
                    plasceholder="Username"
                    onChange={update('username')}
                    required
                />
            </div>
            <div className='errors'>{errors?.password}</div>
            <label className="input-label" htmlFor="password">Password</label>
            <div className='inputbox-container'>
                <input className='inputbox' id='password'
                    type='password'
                    value={password}
                    plasceholder="password"
                    onChange={update('password')}
                    required
                />
            </div>
            <div className="errors">
                {password !== password2 && 'Confirm Password field must match'}
            </div>
            <label className="input-label" htmlFor="password2">Confirm Password</label>
            <div className='inputbox-container'>
                <input className='inputbox' id='password2'
                    type='password'
                    value={password2}
                    plasceholder="Confirm Password"
                    onChange={update('password2')}
                    required
                />
            </div>
            <input
                type="submit"
                value="Sign Up"
                disabled={!email || !username || !password || password !== password2}
            />
        </form>
    )
}

export default SignupForm;