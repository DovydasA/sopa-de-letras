import React, { useEffect, useState } from 'react';
import '../Style/cell.css'
import Row from './Row.jsx'

const GameGrid = (props) => {
    const {words, gridSize, start, onStart, onWordStateChange, reload, onReload, debugMode, onSetPoints, showGameOver} = props;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const getRandomLetter = () => alphabet[Math.floor(Math.random() * alphabet.length)];
    const wordsArray = words.map(obj => obj.word);

    const [ grid, setGrid] = useState();
    const [selection, setSelection] = useState(0);

    const directions = {
        //[row cell]
        '-1': [-1, -1],
        '-2': [0, -1],
        '-3': [1, -1],
        '-4': [1, 0],
        '0': [0, 0],
        '1': [-1, 1],
        '2': [0, 1],
        '3': [1, 1],
        '4': [-1, 0]
    }
/*  -1  4  1
    -2  0  2
    -3 -4  3
*/

    const createGrid = async () => {
        const gridArray = await generateLines();
        for (let word of words){
            let position;
            let direction;
            let result = false;
            let limit = 0;
            let wordToPlace = word.word;
            while( !result && !(limit === 1000) ){
                position = chooseRandomPosition();
                direction = chooseRandomDirection();
                result = checkIfPlaceable(gridArray, wordToPlace, position, direction);
                limit++;
            }
            if(result){
                placeWord(gridArray, wordToPlace, position, direction);
                word.placed = true;
            }
        }
        if(!allWordsPlaced()){
            onReload();
            return;
        }
        fillRemainingCells(gridArray);
        setGrid(gridArray);
    }

    const generateRows = (rowsGenerated) => {
        const rowArray = [];
        for (let i = 0; i < gridSize; i++) {
            rowArray.push({
                letter: ' ',
                row: rowsGenerated,
                col: i,
                id: `${rowsGenerated}-${i}`,
                class: 'cell',
                selected: false,
                set: false
            });
        }
        return ( rowArray );
    }

    const generateLines = async () => {
        const linesArray = [];
        for (let i= 0; i < gridSize; i++) {
            linesArray.push(generateRows(i))
        }
        return linesArray;
    }

    const chooseRandomPosition = () => {
        return ({
            row: Math.floor(Math.random() * gridSize),
            cell: Math.floor(Math.random() * gridSize)
        })
    }

    const chooseRandomDirection = () => {
        let direction = 0;
        while( direction === 0) direction = Math.floor(Math.random() * 8) - 4;
        return direction;
        /*  -1  4  1
            -2  0  2
            -3 -4  3
        */
    }

    const checkIfPlaceable = (map, word, pos, dir) => {
        const positionChange = directions[dir.toString()];

        let newRowPos = pos.row + ((word.length-1)*positionChange[0]);
        let newCellPos = pos.cell + ((word.length-1)*positionChange[1]);

        if(newRowPos >= gridSize || newCellPos >= gridSize || newRowPos < 0 || newCellPos < 0) return false; //se a palavra total ficar fora das bordas

        for(let i = 0; i < word.length; i++){
            newRowPos = pos.row + (i*positionChange[0]);
            newCellPos = pos.cell + (i*positionChange[1]);
            if( alphabet.includes(map[newRowPos][newCellPos].letter) && map[newRowPos][newCellPos].letter !== word[i]) return false;
        }

        return true;
    }

    const placeWord = (map, word, pos, dir) => {
        const positionChange = directions[dir.toString()];
        let newRowPos = pos.row;
        let newCellPos = pos.cell;

        for(let i = 0; i < word.length; i++){
            newRowPos = pos.row + (i*positionChange[0]);
            newCellPos = pos.cell + (i*positionChange[1]);
            map[newRowPos][newCellPos].letter = word[i];
            map[newRowPos][newCellPos].class += ` ${debugMode ? 'highlight' : ''}`;
        }
    }

    const fillRemainingCells = (map) => {
        map.forEach(row => {
            row.forEach(cell => {
                if(!(alphabet.includes(cell.letter))) {
                    cell.letter = getRandomLetter();

                }
            })
        })
    }

    const allWordsPlaced = () => {
        for(let word of words){
            if(word.placed === false) return false
        }
        return true;
    }

    const handleClick = (e) => {
        if(!selection){
            const cellID = e.target.id.split('-');
            setSelection([{
                row: parseInt(cellID[0]),
                col: parseInt(cellID[1])
            }])
            grid[cellID[0]][cellID[1]].selected = true;
        }
    }


    const handleReleaseClick = (e) => {
        if(!selection) return;
        const tempSelection = [...selection];
        const cellID = e.target.id.split('-');
        tempSelection.push({
            row: parseInt(cellID[0]),
            col: parseInt(cellID[1])
        })
        setSelection(tempSelection);
        grid[cellID[0]][cellID[1]].selected = true;
        lastDirection = 0;
    }

    let lastDirection = 0;
    const handleHover = (e) => {
        if(selection && selection.length === 1){
            const cellID = e.target.id.split('-').map(x => parseInt(x));
            const length = getWordLength(cellID[0] - selection[0].row, cellID[1] - selection[0].col)
            const currentDirection = getDirection(cellID[0] - selection[0].row, cellID[1] - selection[0].col);
            if(JSON.stringify(lastDirection) !== JSON.stringify(currentDirection)){
                lastDirection = currentDirection;
                deselectAllCells();
                setHoverSelection(lastDirection, length);
                return;
            }
            grid[cellID[0]][cellID[1]].selected = true;
        }
    }

    const getRowLength = () => {
        return selection[1].row - selection[0].row;
    }
    
    const getColumnLength = () => {
        return selection[1].col - selection[0].col;
    }

    const getWordLength = (rowLength, colLength) => {
        const positiveRowLength = Math.abs(rowLength);
        const positiveColLength = Math.abs(colLength);
        if(positiveRowLength > positiveColLength) return positiveRowLength;
        return positiveColLength;
    }

    const getDirection = (rowDif, colDif) => {
        const direction = [0, 0];
        if(rowDif < 0) direction[0] = -1;
        if(rowDif > 0) direction[0] = 1;
        if(colDif < 0) direction[1] = -1;
        if(colDif > 0) direction[1] = 1;
        return direction;
    }

    const getWord = (direction, length) => {
        let wordFromSelection = '';
        let newRow, newCol;
        for( let i = 0; i <= length; i++){
            newRow = selection[0].row+(i*direction[0]);
            newCol = selection[0].col+(i*direction[1]);
            if(checkBounds(newRow, newCol, length)) return false;
            wordFromSelection += grid[newRow][newCol].letter;
        }
        return wordFromSelection;
    }

    const setSelectedCells = (direction, length) => {
        let newRow, newCol;
        for( let i = 0; i <= length; i++){
            newRow = selection[0].row+(i*direction[0]);
            newCol = selection[0].col+(i*direction[1]);
            grid[newRow][newCol].set = true;
        }
    }

    const setHoverSelection = (direction, length) => {
        let newRow, newCol;
        for( let i = 0; i <= length; i++){
            newRow = selection[0].row+(i*direction[0]);
            newCol = selection[0].col+(i*direction[1]);
            if(checkBounds(newRow, newCol, length)) return;
            grid[newRow][newCol].selected = true;
        }
    }

    const checkBounds = (row, col, length) => {
        if(length > gridSize || row >= gridSize || row < 0 || col >= gridSize || col < 0){
            return true;
        }
        return false;
    }

    const deselectAllCells = () => {
        for(let i = 0; i < gridSize; i++){
            for(let j = 0; j < gridSize; j++){
                grid[i][j].selected = false;
            }
        }
        setGrid([...grid]);
    }

    const checkGameState = () => {
        for(let word of words){
            if(word.found === false) return false
        }
        return true;
    }

    const handleGameEnd = () => {
        onSetPoints();
        showGameOver(true);
        onStart();
    }

    useEffect(() => {
        if(selection.length === 2){
            const rowLength = getRowLength();
            const colLength = getColumnLength();
            const direction = getDirection(rowLength, colLength);
            const wordLength = getWordLength(rowLength, colLength);
            const wordFromSelection = getWord(direction, wordLength);
            if(wordsArray.includes(wordFromSelection)){
                onWordStateChange(wordsArray.indexOf(wordFromSelection));
                setSelectedCells(direction, wordLength);
                if(checkGameState()) handleGameEnd();

            } else {
                deselectAllCells(direction, wordLength);
            }
            setSelection(0);
            onSetPoints();
        }
    },[selection])
    
    useEffect(()=>{
        createGrid();
    },[start, reload])


    return ( 
        <div className='cell-grid' style={{display: start ? '' : 'none'}}>   
            {grid && grid.length === gridSize  ? 
                grid.map((row, index) => (
                    <Row 
                        rowData={row}
                        onClick={handleClick}
                        onReleaseClick={handleReleaseClick}
                        onHover={handleHover}
                        key={index}/>
                ))
                : <h1>Nao existe Grid</h1>}
        </div>
    );
}
 
export default GameGrid;