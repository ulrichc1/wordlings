import wordENBank from "./wordle-en-bank.txt";
import wordFRBank from "./wordle-fr-bank.txt";

export const boardDefault = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]; // Default board with no letters

  export const generateWordSetEN = async () => {
    let wordSet;
    let todaysWord;
    await fetch(wordENBank)
      .then((response) => response.text())
      .then((result) => {
        const wordArr = result.split("\n");
        todaysWord = wordArr[Math.floor(Math.random() * wordArr.length)];
        wordSet = new Set(wordArr);
      });
    return { wordSet, todaysWord };
  };

  export const generateWordSetFR = async () => {
    let wordSet;
    let todaysWord;
    await fetch(wordFRBank)
      .then((response) => response.text())
      .then((result) => {
        const wordArr = result.split("\n").filter(word => word.length === 6);
        todaysWord = wordArr[Math.floor(Math.random() * wordArr.length)];
        wordSet = new Set(wordArr);
        console.log(wordArr, todaysWord);
      });
    return { wordSet, todaysWord };
  };
  