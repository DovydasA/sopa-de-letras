import React from 'react'
import '../Style/words.css';
import Word from './Word.jsx'

const WordsContainer = (props) => {

  const {words} = props;
  
  return (
      <div className="words-container">
        <div className="words-title">Palavras</div>
        <div className="words-list">
            {words && words.map(word => (
              <Word word={word} key={`${word.index}`} />
            ))}
        </div>
      </div>
    );
}
 
export default WordsContainer;