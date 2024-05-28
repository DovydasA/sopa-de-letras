import React, {useState, useEffect} from 'react';
import '../Style/control-panel.css'

const TIMEOUTGAME = 120;
let timerId = undefined;

const ControlPanel = (props) => {
  const [newWord, setNewWord] = useState('');
  const {timer, setTimer, points, selectedLevel, onLevelChange, gameStarted, onGameStart, debugMode, onDebugMode, onNewWord, onRemoveWords, showWords, showTop10, onGameTimeout, top10} = props;
  let maxTimer = TIMEOUTGAME;
  const gameStartedClass = gameStarted ? " gameStarted" : "";

  const topWPM = () => {
    if(top10.length > 0) return top10[0].wpm;
    return 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onNewWord(newWord);
    setNewWord('');
  };

  useEffect(() => {
    maxTimer = TIMEOUTGAME*(parseInt(selectedLevel)**2);
  }, [selectedLevel]);


  useEffect(() => {
    if (gameStarted) {
      timerId = setInterval(() => {
        setTimer(currentTime => currentTime + 1);
      }, 1000);
    } else if (timer !== 0) {
      setTimer(0);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [gameStarted]);

  useEffect(() => {
    if(timer === maxTimer && gameStarted) {
      onGameTimeout();
      onGameStart();
    }
  },[timer]);

  return (
      <section id="panel-control">
      <h3 className="sr-only">Select Level</h3>
      <form className="form">
        <fieldset className="form-group">
          <label htmlFor="btLevel">Level:</label>
          <select
            id="btLevel"
            defaultValue="0"
            onChange={onLevelChange}
            disabled={gameStarted}
          >
            <option value="0">Select...</option>
            <option value="1">Easy (6 words / 2 minutes)</option>
            <option value="2">Medium (8 words / 8 minutes)</option>
            <option value="3">Hard (12 words / 18 minutes) </option>
          </select>
        </fieldset>
        <button
          type="button"
          id="btPlay"
          disabled={selectedLevel === '0'}
          onClick={onGameStart}
        >
          {gameStarted ? "Stop Game" : "Start Game"}
        </button>
        <button 
          type="button"
          className={`${debugMode ? 'debugOn' : 'debugOff'}`}
          onClick={onDebugMode}> TEST MODE </button>
      </form>
      <div style={{display : gameStarted ? 'none' : 'grid', justifyItems : 'center'}}>
        <form onSubmit={handleSubmit}>
          <label> Enter New Word:
            <input 
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}>
            </input>
          </label>
        </form>
        <div style={{display : 'flex'}}>
          <button onClick={onRemoveWords}>Delete Words</button>
          <button onClick={() => showWords(true)}>Show Words</button>
        </div>
      </div>
      <div className={`form-metadata ${gameStarted ? "form-metadata-gap" : ""}`}>
        <p id="message" role="alert" className="hide">
          Press START!
        </p>
        <dl className={`list-item left${gameStartedClass}`}>
          <dt>Game Time:</dt>
          <dd id="gameTime">{timer}</dd>
        </dl>
        <dl className={`list-item right${gameStartedClass}`}>
          <dt>Best WPM:</dt>
          <dd id="pointsTop">{topWPM()}</dd>
        </dl>
        <dl className={`list-item left${gameStartedClass}`}>
          <dt>Words Per Minute (WPM):</dt>
          <dd id="points">{points}</dd>
        </dl>
        <div id="top10" className={`right`}>
          <button id="btTop" onClick={() => showTop10(true)}>Show TOP10</button>
        </div>
      </div>
    </section>
  );
}
 
export default ControlPanel;