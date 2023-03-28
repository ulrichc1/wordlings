import React, { useCallback, useEffect } from 'react'
import Key from './Key';
import { useContext } from 'react'
import { AppContext } from '../App';

const Keyboard = ({language}) => {
  const keys1 = ["A","Z","E","R","T","Y","U","I","O","P"];
  const keys2 = ["Q","S","D","F","G","H","J","K","L","M"];
  const keys3 = ["W","X","C","V","B","N"];
 // Keyboard (AZERTY)

 const keys4 = ["Q","W","E","R","T","Y","U","I","O","P"];
 const keys5 = ["A","S","D","F","G","H","J","K","L"];
 const keys6 = ["Z","X","C","V","B","N","M"];
// Keyboard (QWERTY)

const {onEnter, onRemove, onSelectLetter, disabledLetters} = useContext(AppContext);

const handleKeyboard = useCallback((event) => {
  if (event.key === "Enter"){
    onEnter();
  }
  else if (event.key === "Backspace"){
    onRemove();
  }

  else {
    if (language === "fr"){
    keys1.forEach((key) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        onSelectLetter(key);
      }
    });
    keys2.forEach((key) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        onSelectLetter(key);
      }
    });
    keys3.forEach((key) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        onSelectLetter(key);
      }
    });    
  }
  else {
    keys4.forEach((key) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        onSelectLetter(key);
      }
    });
    keys5.forEach((key) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        onSelectLetter(key);
      }
    });
    keys6.forEach((key) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        onSelectLetter(key);
      }
    });
  }
  }
});


useEffect(()=> {
  document.addEventListener("keydown",handleKeyboard);
  return () =>{
    document.removeEventListener("keydown",handleKeyboard);
  };

}, [handleKeyboard]);

if (language === "fr"){
  return (
    <div className='keyboard' onKeyDown={handleKeyboard}>
      <div className="line1">{keys1.map((key) => {return <Key keyVal={key}  disabled={disabledLetters.includes(key)}/>})}</div>
      <div className="line2">{keys2.map((key) => {return <Key keyVal={key}  disabled={disabledLetters.includes(key)}/>})}</div>
      <div className="line3"><Key keyVal={"←"}/>{keys3.map((key) => {return <Key keyVal={key}  disabled={disabledLetters.includes(key)}/>})}<Key keyVal={"→"}/></div>
    </div>
  )
}
return (
  <div className='keyboard' onKeyDown={handleKeyboard}>
    <div className="line1">{keys4.map((key) => {return <Key keyVal={key}  disabled={disabledLetters.includes(key)}/>})}</div>
    <div className="line2">{keys5.map((key) => {return <Key keyVal={key}  disabled={disabledLetters.includes(key)}/>})}</div>
    <div className="line3"><Key keyVal={"←"}/>{keys6.map((key) => {return <Key keyVal={key}  disabled={disabledLetters.includes(key)}/>})}<Key keyVal={"→"}/></div>
  </div>
)
}


export default Keyboard;