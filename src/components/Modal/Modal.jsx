import { useEffect } from 'react';
import './Modal.css';
import { CgClose } from 'react-icons/cg';

import { createPortal } from 'react-dom';
const modalRoot = document.querySelector('#modal_root');

export default function Modal({ onClose, children, showModal }) {
  useEffect(() => {
    const handleKeyDown = event => {
      console.log(event.code);
      if (event.code === 'Escape') {
        console.log('esc');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      console.log('backdrop');
      onClose();
    }
  };

  return createPortal(
    <div className="overlay" onClick={handleBackdropClick}>
      <div className="modal">
        <button className="close__button" type="button" onClick={onClose}>
          <CgClose className="icon__close" size="40" />
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
