import logo from './logo.svg';
import './App.css';
import Board from './Components/Board';
import Keyboard from './Components/Keyboard';
import './Components/styles/wordle.css';
import { useEffect, useState } from 'react';
import { boardDefault,generateWordSetEN,generateWordSetFR } from './Words';
import { createContext } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


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

  console.log("language: ", language);
  
  useEffect(() => {
    if (language === "fr"){
    generateWordSetFR().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });}

    else {
    generateWordSetEN().then((words) => {
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord);
      });
    }
  }, []);

  const onEnter = () => {
    // trimming des mots du wordSet
    let wordSetTrimmed = new Set();
    wordSet.forEach((word) => {
          wordSetTrimmed.add(word.trim());
        }
    );
    // si le mot saisi par l'utilisateur n'est pas dans le wordSet on alerte l'utilisateur
    if (currAttempt.letterPos === 5) {
      if (!wordSetTrimmed.has(newBoard[currAttempt.attempt].join("").toLowerCase().trim())) {
        if (language === "fr") alert("Mot non valide");
        if (language === "en") alert("Invalid word");
        // on efface la ligne et l'utilisateur recommence
        newBoard[currAttempt.attempt] = ["", "", "", "", ""];
        setBoard(newBoard);
        setCurrAttempt({attempt: currAttempt.attempt, letterPos: 0});
        return;
      }
      if (currAttempt.letterPos !== 5) return;
      let currWord = "";
      for (let i = 0; i < 5; i++) {
        currWord += board[currAttempt.attempt][i];
      }

      setCurrAttempt({attempt: currAttempt.attempt + 1, letterPos: 0});
      if (correctWord.toLowerCase().trim() === currWord.toLowerCase().trim()) {
        setWordFound(true);
      }
      if (currAttempt.attempt === 5 && wordFound === false) {
        setGameOver(true);
      }
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
    // Timeout pour éviter que le changement de langue ne soit pas pris en compte
    setTimeout(() => {  setLanguage(language); setBoard([
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
if (language === "en") {
  generateWordSetEN().then((words) => {
    setWordSet(words.wordSet);
    setCorrectWord(words.todaysWord);
  });
}
if (language === "fr") {
    generateWordSetFR().then((words) => {
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord);
    });
}
      setWordFound(false);
      setGameOver(false);
      }, 100);

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
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }
  else {
    generateWordSetFR().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }
}
  return (
    <div className="App">
      <nav>
      <h1>Wordlings</h1>
      {(language==="fr")&& <button class="btn-language" onClick={() => handleLanguage("en")}> FR </button>}
      {(language==="en")&& <button class="btn-language" onClick={() => handleLanguage("fr")}> EN </button>}
      </nav>
    <div className='wordle'>
    <AppContext.Provider  value={{ board, setBoard, currAttempt, setCurrAttempt, onEnter, onRemove, onSelectLetter, correctWord, disabledLetters, setDisabledLetters }}>
    <Board/>
    {gameOver && !wordFound && (language == "en") && 
      <div className="finished"><h2> GAME OVER ! The word was : {correctWord} </h2>
        <button className="btn-restart" onClick={() => onRestart("en")}> RESTART </button>
      </div>}
    {wordFound && (language == "en") && 
      <div className="finished"><h2> CONGRATS ! The word was : {correctWord} </h2>
      <h3> found in : {currAttempt.attempt} attempts. </h3>
        <button className="btn-restart" onClick={() => onRestart("en")}> RESTART </button>
      </div>}
    {gameOver && !wordFound && (language == "fr") && 
      <div className="finished"><h2> PERDU ! Le mot était : {correctWord} </h2>
        <button className="btn-restart" onClick={() => onRestart("fr")}> REJOUER </button>
      </div>}
    {wordFound && (language == "fr") && 
      <div className="finished"><h2> TROUVÉ ! Le mot était : {correctWord} </h2>
      <h3> trouvé en: {currAttempt.attempt} essais. </h3>
      <button className="btn-restart" onClick={() => onRestart("fr")}> REJOUER </button>
      </div>}

    {!wordFound && !gameOver && <Keyboard language={language}/>}
    </AppContext.Provider>
    </div>
    </div>
  );
}

export default App;
