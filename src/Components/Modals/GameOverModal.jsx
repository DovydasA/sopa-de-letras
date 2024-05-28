import React, { useState} from 'react';
import '../../Style/modal.css';

const GameOverModal = (props) => {
    const {points, timeout, showModal, onClose, isTop10, onEnterTop10} = props;
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        setSubmitted(true);
        onEnterTop10(e);
    };

    const handleClose = (e) => {
        onClose();
        setSubmitted(false);
    };

    const top10 = () => {
        if(isTop10 && !submitted){
            return(
            <form onSubmit={handleSubmit}>
                <label> Enter name for Top10
                    <input type="text"/>
                </label>
            </form>);
        }
    }

    return (
        <div className={`modal ${showModal ? 'open' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close" onClick={handleClose}>&times;</span>
                    <h2>Game Over{` ${timeout ? '- Time Ended' : ''}`}</h2>
                </div>
                <div className="modal-body">
                    <p>Words Per Minute: {points}</p>
                    {top10()}
                </div>
            </div>
        </div> );
}
 
export default GameOverModal;
