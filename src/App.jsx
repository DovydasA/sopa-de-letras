import "./Style/modal.css";
import "./App.css";
import React from "react";
import { useEffect, useState } from "react";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";
import ControlPanel from "./Components/ControlPanel.jsx";
import GameGrid from "./Components/GameGrid.jsx";
import WordsContainer from "./Components/WordsContainer.jsx";
import NewWordsModal from "./Components/Modals/NewWordsModal.jsx";
import GameOverModal from "./Components/Modals/GameOverModal.jsx";
import Top10Modal from "./Components/Modals/Top10Modal.jsx";

import { words as wordsFromFile } from "./Constants/palavrasArray.js";

function App() {
	const [words, setWords] = useState();
	const [maxGridSize, setGridSize] = useState(20);
	const [maxWords, setMaxWords] = useState(12);
	const [start, setStart] = useState(false);
	const [timer, setTimer] = useState(0);
	const [points, setPoints] = useState(0);
	const [selectedLevel, setSelectedLevel] = useState("0");
	const [reload, setReload] = useState(false);
	const [debugMode, setDebugMode] = useState(false);
	const [gameTimeout, setGameTimeout] = useState(false);
	const [top10, setTop10] = useState([]);
	const [newWords, setNewWords] = useState([]);
	const [newWordsModal, setNewWordsModal] = useState(false);
	const [gameOverModal, setGameOverModal] = useState(false);
	const [top10Modal, setTop10Modal] = useState(false);

	useEffect(() => {
		if (!start) {
			const getWord = async () => {
				let controller = new AbortController();
				setTimeout(() => controller.abort(), 1000);
				try {
					//const response = await fetch('https://random-word-api.herokuapp.com/word?number=200', { timeout: 2000});
					const response = await fetch(
						"https://random-word-api.herokuapp.com/word?number=200",
						{ signal: controller.signal }
					);
					return await response.json();
				} catch (err) {
					console.log(err);
					return false;
				}
			};
			const saveWords = async () => {
				const wordsApi = await getWord();
				let words = [];
				if (!wordsApi) {
					shuffleArray(wordsFromFile);
					words = wordsFromFile
						.filter(word => word.length <= maxGridSize)
						.map(word => word.toUpperCase())
						.slice(0, maxWords)
						.sort();
				} else {
					words = wordsApi
						.filter(word => word.length <= maxGridSize)
						.map(word => word.toUpperCase())
						.slice(0, maxWords)
						.sort();
				}
				if (newWords.length > 0) {
					shuffleArray(words);
					words = [...words, ...newWords]
						.map(word => word.toUpperCase())
						.slice(newWords.length, maxWords + newWords.length)
						.sort();
				}
				const wordsList = words.map((word, index) => ({
					word: word,
					index: index,
					placed: false,
					found: false,
				}));
				setWords(wordsList);
			};
			saveWords();
		}
	}, [start, maxWords, reload, newWords, maxGridSize]);

	const handleStart = () => {
		setStart(current => !current);
	};

	const handleGameTimeout = () => {
		setGameTimeout(true);
		setGameOverModal(true);
	};

	const handleWordStateChange = index => {
		const newWords = [...words];
		newWords[index].found = true;
		setWords(newWords);
	};

	const handleLevelChange = event => {
		setSelectedLevel(event.currentTarget.value);
	};

	const handleReload = () => {
		setReload(current => !current);
	};

	const handleDebugMode = () => {
		setDebugMode(current => !current);
	};

	const handleSetPoints = () => {
		const points = countFoundWords() / (timer / 60);
		setPoints(Math.round((points + Number.EPSILON) * 100) / 100);
	};

	const handleNewWords = newWord => {
		setNewWords([...newWords, newWord]);
	};

	const handleRemoveWords = () => {
		setNewWords([]);
	};

	const handleTop10 = e => {
		e.preventDefault();
		const top = {
			name: e.target[0].value,
			wpm: points,
			difficulty: selectedLevel,
		};
		const newTop10 = [...top10];
		newTop10.push(top);
		newTop10.sort(function (a, b) {
			return b.wpm - a.wpm;
		});
		if (newTop10.length > 10) newTop10.pop();
		setTop10(newTop10);
	};

	const handleCloseModal = () => {
		setNewWordsModal(false);
		setGameOverModal(false);
		setTop10Modal(false);
	};

	const isTop10 = () => {
		if (top10.length <= 10) return true;

		let lowestScore = top10[0].wpm;
		top10.forEach(player => {
			if (lowestScore > player.wpm) lowestScore = player.wpm;
		});
		if (lowestScore < points) return true;
		return false;
	};

	const countFoundWords = () => {
		let count = 0;
		for (let word of words) {
			if (word.found === true) count++;
		}
		return count;
	};

	useEffect(() => {
		if (start) {
			setPoints(0);
			setGameTimeout(false);
		}
	}, [start]);

	useEffect(() => {
		const level = {
			0: [0, 0],
			1: [10, 6],
			2: [15, 8],
			3: [20, 12],
		};
		const nSelectedLevel = parseInt(selectedLevel);
		setGridSize(level[nSelectedLevel][0]);
		setMaxWords(level[nSelectedLevel][1]);
	}, [selectedLevel]);

	const shuffleArray = array => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	};

	return (
		<div className="App">
			<Header />
			<ControlPanel
				timer={timer}
				setTimer={setTimer}
				onGameTimeout={handleGameTimeout}
				points={points}
				selectedLevel={selectedLevel}
				onLevelChange={handleLevelChange}
				gameStarted={start}
				onGameStart={handleStart}
				debugMode={debugMode}
				onDebugMode={handleDebugMode}
				onNewWord={handleNewWords}
				onRemoveWords={handleRemoveWords}
				showWords={setNewWordsModal}
				showTop10={setTop10Modal}
				top10={top10}
			/>
			<div
				className="game-container"
				style={{ display: start ? "" : "none" }}>
				{words ? (
					<GameGrid
						start={start}
						onStart={handleStart}
						words={words}
						onWordStateChange={handleWordStateChange}
						gridSize={maxGridSize}
						onReload={handleReload}
						reload={reload}
						debugMode={debugMode}
						onSetPoints={handleSetPoints}
						showGameOver={setGameOverModal}
					/>
				) : (
					<h1>Loading words... Wait</h1>
				)}
				<WordsContainer words={words} />
			</div>
			<NewWordsModal
				newWords={newWords}
				showModal={newWordsModal}
				onClose={handleCloseModal}
			/>
			<GameOverModal
				points={points}
				timeout={gameTimeout}
				showModal={gameOverModal}
				onClose={handleCloseModal}
				isTop10={isTop10()}
				onEnterTop10={handleTop10}
			/>
			<Top10Modal
				top10={top10}
				showModal={top10Modal}
				onClose={handleCloseModal}
			/>
			<Footer />
		</div>
	);
}

export default App;
