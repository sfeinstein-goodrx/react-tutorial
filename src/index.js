import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={`square ${props.isWinningSquare ? "square-winner" : ""}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                isWinningSquare={this.props.winningSquares.has(i)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class History extends React.Component {
    render() {
        const moves = this.props.history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const isSelected = move === this.props.stepNumber;
            return (
                <li key={move}>
                    <button
                        className={isSelected ? "history-selected" : ""}
                        onClick={() => this.props.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        return (
            <ol>{moves}</ol>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            check: {},
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        const check = checkForWinner(squares);
        if (check.winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            winningSquares: check.winningSquares,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const check = checkForWinner(current.squares)

        let status;
        if (check.winner) {
            status = 'Winner: ' + check.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'the fabulous player X' : 'the amazing player O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={check.winningSquares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <History
                        history={history}
                        stepNumber={this.state.stepNumber}
                        jumpTo={(i) => this.jumpTo(i)}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

function checkForWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningSquares: new Set(lines[i])
            };
        }
    }
    return {
        winner: null,
        winningSquares: new Set(),
    };
}
