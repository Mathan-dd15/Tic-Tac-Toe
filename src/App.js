import './App.css';
import Board from './Board';
import Square from './Square';
import {useState,useEffect} from 'react';


const defaultSquares = () => (new Array (9)).fill(null)

const lines =[
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]
function App() {
  const [squares, setSquares] = useState(defaultSquares())
  const [winner,setWinner] =useState(null)
  const isTie = squares.every(square => square !== null) && !winner;

  function ResetGame(){
    setSquares(defaultSquares());
    setWinner(null);
  }


  useEffect(() => {
    const linesThatAre = (a, b, c) => {
      return lines.filter(squareIndexs => {
        const squareValues = squareIndexs.map(index => squares[index]);
        return JSON.stringify([a, b, c]) === JSON.stringify(squareValues.sort());
      });
    };
  
    const emptyIndexes = squares.map((square, index) => (square === null ? index : null)).filter(index => index !== null);
    const playerWon = linesThatAre('X', 'X', 'X').length > 0;
    const computerWon = linesThatAre('O', 'O', 'O').length > 0;
  
    if (playerWon) {
      setWinner('X');
    }
    if (computerWon) {
      setWinner('O');
    }
  
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
  
    if (isComputerTurn && !winner) {
      const winingLines = linesThatAre('O', 'O', null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].find(index => squares[index] === null);
        if (winIndex !== undefined) {
          const newSquares = [...squares];
          newSquares[winIndex] = 'O';
          setSquares(newSquares);
          return;
        }
      }
  
      const linesToBlock = linesThatAre('X', 'X', null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].find(index => squares[index] === null);
        if (blockIndex !== undefined) {
          const newSquares = [...squares];
          newSquares[blockIndex] = 'O';
          setSquares(newSquares);
          return;
        }
      }
  
      const linesToContinue = linesThatAre('O', null, null);
      if (linesToContinue.length > 0) {
        const continueIndex = linesToContinue[0].find(index => squares[index] === null);
        if (continueIndex !== undefined) {
          const newSquares = [...squares];
          newSquares[continueIndex] = 'O';
          setSquares(newSquares);
          return;
        }
      }
  
      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      if (randomIndex !== undefined) {
        const newSquares = [...squares];
        newSquares[randomIndex] = 'O';
        setSquares(newSquares);
      }
    }
  }, [squares, winner]);
  

  function handleSquareClick(index){
    const isPlayerTurn =squares.filter(square => square !== null).length % 2===0
    if(isPlayerTurn){
      const newSquares = [...squares];
      newSquares[index] = 'X'
      setSquares(newSquares)
    }
  }

  return (
    <main>
      <Board>
        {squares.map((square,index) =>
           <Square 
           x = {square==='X'?1:0}
           o = {square==='O'?1:0}
           key={index} onClick ={() => handleSquareClick(index)} />)}
      </Board>
      
      {!!winner ? (
      <div className={`result ${winner === 'X' ? 'green' : 'red'}`}>
        {winner === 'X' ? 'You WON!' : 'You LOST!'}
      </div>
      ) : isTie ? (
      <div className='result yellow'>
        It's a TIE!
      </div>
      ) : null}

      <button className='reset-button' onClick={ResetGame}>Reset The Game</button>

    </main>
  );
}

export default App;
