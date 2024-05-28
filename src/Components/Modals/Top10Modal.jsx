import React from 'react';
import '../../Style/modal.css';

const Top10Modal = (props) => {

    const {top10, showModal, onClose} = props;
    const difficulty = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard'
    }

    return (
        <div className={`modal ${showModal ? 'open' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close" onClick={onClose}>&times;</span>
                    <h2>Top 10</h2>
                </div>
                <div className="modal-body">
                    <div id='top10'>
                        <p key={'NameTitle'} className={'title'}>Name</p>
                        <p key={'WPMTitle'} className={'title'}>Words Per Minute</p>
                        <p key={'LevelTitle'} className={'title'}>Difficulty</p>
                        {top10.map((player, index) => <>
                                <p key={`${player.name}/${index}`}>{player.name}</p>
                                <p key={`${player.wpm}/${index}`}>{player.wpm}</p>
                                <p key={`${player.difficulty}/${index}`}>{difficulty[player.difficulty]}</p>
                        </>)}
                    </div>
                </div>
            </div>
        </div> );
}
 
export default Top10Modal;