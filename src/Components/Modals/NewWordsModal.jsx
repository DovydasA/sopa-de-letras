import React from 'react';
import '../../Style/modal.css';

const NewWordsModal = (props) => {

    const {newWords, onClose, showModal } = props;

    return ( 
    <div className={`modal ${showModal ? 'open' : ''}`}>
        <div className="modal-content">
        <div className="modal-header">
            <span className="close" onClick={onClose}>&times;</span>
            <h2>Palavras Adicionadas</h2>
        </div>
        <div className="modal-body">
            {newWords.map((word) => <p>{word}</p>)}
        </div>
        </div>
    </div> );
}
 
export default NewWordsModal;