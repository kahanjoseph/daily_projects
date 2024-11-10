import logo from './logo.svg';
import './App.css';
import {useEffect, useMemo, useState} from "react";
import Modal from "./components/Modal";

function App() {
    const lines = [
        // Horizontal lines
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Vertical lines
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonal lines
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]

    ];
    const [open, setOpen] = useState(false)
    const [squares, setSquares] = useState([[0,0,0],[0,0,0],[0,0,0]])
    const [player, setPlayer] = useState(1)
    const [human, setHuman] = useState(1)
    const [winner, setWinner] = useState(false)

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const resetGame = () => {
        setWinner(false)
        setSquares([[0,0,0],[0,0,0],[0,0,0]])
        setPlayer(1)
    }

    const displayWinner = useMemo(() => {
        if(winner === 1){
            return 'X';
        }else if(winner === 2){
            return 'O'
        }
        return ''
    }, [winner]);

    const calculateWinner = (board) => {

        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a[0]][a[1]] !== 0 &&
                board[a[0]][a[1]] === board[b[0]][b[1]] &&
                board[a[0]][a[1]] === board[c[0]][c[1]]) {
                return board[a[0]][a[1]];
            }
        }
        return null;
    };

    const aiMove = (player, squaresCopy) => {
        const otherPlayer = player === 1 ? 2 : 1;

        for (let line of lines) {
            const otherPlayerArray = []
            const emptyArray = []
            const samePlayerArray = []
            for(let cell of line){
                if(squaresCopy[cell[0]][cell[1]] === otherPlayer){
                    otherPlayerArray.push(cell);
                }else if(squaresCopy[cell[0]][cell[1]] === 0){
                    emptyArray.push(cell)
                }else if(squaresCopy[cell[0]][cell[1]] === player){
                    samePlayerArray.push(cell)
                }
            }
            if ((samePlayerArray.length === 2 && emptyArray.length)){
                squaresCopy[emptyArray[0][0]][emptyArray[0][1]] = player;
                return squaresCopy;
            }
            if ((otherPlayerArray.length === 2 && emptyArray.length)){
                squaresCopy[emptyArray[0][0]][emptyArray[0][1]] = player;
                return squaresCopy;
            }
            if (samePlayerArray.length && emptyArray.length && !otherPlayerArray.length){
                squaresCopy[emptyArray[0][0]][emptyArray[0][1]] = player;
                return squaresCopy;
            }
        }

        if(squaresCopy[1][1] === 0){
            squaresCopy[1][1] = player;
        }else{
            outerLoop: for(let i = 0; i < squaresCopy.length; i++){
                for(let j = 0; j < squaresCopy[i].length; j++){
                    if(squaresCopy[i][j] === 0){
                        squaresCopy[i][j] = player;
                        break outerLoop;
                    }
                }
            }
        }

        return squaresCopy;
    }

    return (
        <div className="App">
            <Modal open={open} setOpen={setOpen} winner={displayWinner} resetGame={resetGame}/>
            <header className="App-header">
                <div className='size-96 bg-white grid grid-cols-3'>
                    {squares.map((row, i) => (
                        row.map((square, j) => (
                            <div key={`${i}_${j}`} className='border-2 border-black flex justify-center items-center'
                                 onClick={() => {
                                     if (squares[i][j] === 0 && !winner) {
                                         let squaresCopy = squares.map(row => row.slice()); // Create a new copy of the state
                                         squaresCopy[i][j] = player;
                                         if(calculateWinner(squaresCopy)){
                                             setSquares(squaresCopy);
                                             setWinner(player);
                                             setOpen(true);
                                             return;
                                         }else{
                                             // AI makes its move after the player's move
                                             squaresCopy = aiMove(player === 1 ? 2 : 1, squaresCopy);
                                             // Check for AI's move
                                             if (calculateWinner(squaresCopy)) {
                                                 setSquares(squaresCopy);
                                                 setWinner(player === 1 ? 2 : 1);
                                                 setOpen(true);
                                                 return;
                                             }
                                         }
                                         setSquares(squaresCopy);
                                     }
                                 }}>
                                <div
                                    className={`h-7 w-7 text-center flex items-center text-5xl ${!square ? '' : square === 1 ? 'text-red-500' : 'text-blue-500'}`}>
                                    {!square ? '' : square === 1 ? 'X' : 'O'}
                                </div>
                            </div>
                        ))
                    ))}
                </div>
                <button
                    onClick={()=>resetGame()}
                    type="button"
                    className="mt-4 bg-white w-96 py-5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Restart Game
                </button>
            </header>
        </div>
    );
}

export default App;
