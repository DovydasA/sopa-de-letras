import React from 'react';
import Cell from './Cell.jsx';

const Row = (props) => {
    const {rowData, onClick, onReleaseClick, onHover} = props;

    return (                  
        <div className='cell-row'>{
            rowData.map(cell => (
                <Cell cell={cell} onClick={onClick} onReleaseClick={onReleaseClick} onHover={onHover} key={cell.id.toString()}/>
            ))}
        </div>);
}
 
export default Row;