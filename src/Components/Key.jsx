import React, { useState } from 'react'
import { AppContext } from '../App';
import { useContext } from 'react';

const Key = ({keyVal, disabled}) => {
  const { onEnter, onRemove, onSelectLetter } = useContext(AppContext);

  const selectLetter = () => {
    if (keyVal==="←"){
     onRemove();
    }
    
    else if (keyVal==="→"){
      onEnter();
    }

    else{
     onSelectLetter(keyVal);
  }
};
  
  if (keyVal === "←"){
    return (
      <div className='key big key-remove' onClick={selectLetter}>{keyVal}</div>
    )
  }
  if (keyVal === "→"){
    return (
      <div className='key big key-enter' onClick={selectLetter}>{keyVal}</div>
    )
  }
  return (
    <div className='key' id={disabled && "disabled"} onClick={selectLetter}>{keyVal}</div>
  )
}

export default Key