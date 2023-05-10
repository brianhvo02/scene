import './index.scss';

const Modal = ({children, closeModal}) => {

    return (
        <div className='modal'>
            <div className='modal-background' onClick={closeModal}></div>
            <div className='modal-content'>
                {children}
            </div>
        </div>
    )
}

export default Modal;