import './index.scss'

const SplashPage = () => {

    return(
        <>
        <div className="name-logo-container">
            <img className="scene-logo" src="../../public/logo.png" alt="scene-logo" />
            <div className="button-container">
                <button>Signin Button</button>
                <button>Login Button</button>
            </div>
        </div>
        </>
    )
}

export default SplashPage;