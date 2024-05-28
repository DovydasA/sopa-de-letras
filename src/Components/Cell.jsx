import React from 'react';

const Cell = (props) => {
    const { cell, onClick, onReleaseClick, onHover } = props;

    
    let classList = `${cell.class}${cell.set ? ' highlight-border' : ''}${cell.selected ? ' highlight' : ''}`
    return ( 
        <div 
            className={classList}
            key={cell.id.toString()}
            id={cell.id}
            onMouseDown={onClick}
            onMouseUp={onReleaseClick}
            onMouseEnter={onHover}
            >{cell.letter}
        </div> 
    );
}
 
export default Cell;