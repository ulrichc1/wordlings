import logo from './logo.svg';
import './App.css';
import Board from './Components/Board';
import Keyboard from './Components/Keyboard';
import './Components/styles/wordle.css';
import { useEffect, useState } from 'react';
import { boardDefault,generateWordSetEN,generateWordSetFR } from './Words';
import { createContext } from 'react';

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [language, setLanguage] = useState("fr");
  const [currAttempt, setCurrAttempt] = useState({attempt: 0, letterPos: 0});
  const [prevPos, setPrevPos] = useState(0);
  const newBoard = [...board];
  const [wordSet, setWordSet] = useState(new Set());
  const [correctWord,setCorrectWord] = useState("");
  const [disabledLetters,setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [wordFound, setWordFound] = useState(false);

  useEffect(() => {
    if (language === "fr"){
    generateWordSetFR().then((words) => {
      console.log(words);
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });}

    else {
    generateWordSetEN().then((words) => {
        console.log(words);
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord);
      });
    }
  }, []);

  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return;
    let currWord = "";
    for (let i = 0; i<5; i++){
      currWord += board[currAttempt.attempt][i];
    }
    
    setCurrAttempt({attempt: currAttempt.attempt+1,letterPos:0});
    console.log(correctWord,currWord.toLowerCase());
    if (correctWord.toLowerCase().trim() === currWord.toLowerCase().trim()){
      setWordFound(true);
    }
    if (currAttempt.attempt === 5 && wordFound === false){
      setGameOver(true);
    }
  }

  const onRemove = () => {
    
    if (currAttempt.letterPos === 0) { newBoard[currAttempt.attempt][0] = " ";}
    else {
      setPrevPos(currAttempt.letterPos - 1);
      newBoard[currAttempt.attempt][currAttempt.letterPos] = " ";
      currAttempt.letterPos--;
      console.log(currAttempt.letterPos);
      }
      
  }

  const onSelectLetter = (keyVal) => {
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
    if (currAttempt.letterPos <= 4){
      currAttempt.letterPos++;
      }
    setBoard(newBoard);
  }
  
  const handleLanguage = (language) => {
    setLanguage(language);
    setBoard([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    currAttempt.attempt = 0;
    currAttempt.letterPos = 0;
    setDisabledLetters([]);
    generateWordSetEN().then((words) => {
      console.log(words);
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
    setWordFound(false);
    setGameOver(false);
  }
  

  const onRestart = (language) => {
    currAttempt.attempt = 0;
    currAttempt.letterPos = 0;
    setWordFound(false);
    setGameOver(false);
    setDisabledLetters([]);
    setBoard([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    if (language === "en"){
    generateWordSetEN().then((words) => {
      console.log(words);
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }
  else {
    generateWordSetFR().then((words) => {
      console.log(words);
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }
}
  return (
    <div className="App">
      <nav>
      <h1>Wordlings</h1>
      {(language==="fr")&& <button onClick={() => handleLanguage("en")}> EN </button>}
      {(language==="en")&& <button onClick={() => handleLanguage("fr")}> FR </button>}
      </nav>
    <div className='wordle'>
    <AppContext.Provider  value={{ board, setBoard, currAttempt, setCurrAttempt, onEnter, onRemove, onSelectLetter, correctWord, disabledLetters, setDisabledLetters }}>
    <Board/>
    {gameOver && !wordFound && (language == "en") && 
      <div><h2> GAME OVER ! The word was : {correctWord} </h2>
      <button onClick={() => onRestart()}> RESTART </button>
      </div>}
    {wordFound && (language == "en") && 
      <div><h2> CONGRATS ! The word was : {correctWord} </h2>
      <h3> found in : {currAttempt.attempt} attempts. </h3>
      <button onClick={() => onRestart()}> RESTART </button>
      </div>}
    {gameOver && !wordFound && (language == "fr") && 
      <div><h2> PERDU ! Le mot était : {correctWord} </h2>
      <button onClick={() => onRestart()}> RESTART </button>
      </div>}
    {wordFound && (language == "fr") && 
      <div><h2> TROUVÉ ! Le mot était : {correctWord} </h2>
      <h3> trouvé en: {currAttempt.attempt} essais. </h3>
      <button onClick={() => onRestart()}> RESTART </button>
      </div>}

    {!wordFound && !gameOver && <Keyboard language={language}/>}
    </AppContext.Provider>
    </div>
    </div>
  );
}

export default App;
