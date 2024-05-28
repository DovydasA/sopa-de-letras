import React, {useState, useEffect} from 'react';
import '../Style/words.css';

const Word = (props) => {
    const {word} = props;
    //const [found, setFound] = useState(false);

    
    //setFound(word.found);
    //console.log('state of word changed');
    
    

    let classList = `words ${word.found ? ' strikediag' : ''}`;
    //console.log(`${word.word} ${word.found} ${classList}`);
    return ( 
        <div className={classList} key={`wordID-${word.index}`}>{word.word}</div>
    );
}
 
export default Word;