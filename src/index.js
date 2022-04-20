import React from 'react';
import ReactDOM from 'react-dom/client';
import { forwardRef } from 'react';
import './index.css';

function getWinnerString(winner) {
  if (winner === 'X') {
    return 'Player';
  } else {
    return 'Computer';
  }
}

const Square = forwardRef((props, ref) => {
  return (
    <button ref={ref} className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
});

class Board extends React.Component {
  createSquare(i, ref) {
    return (
      <Square
        ref={ref}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  squares = [];
  constructor(props) {
    super(props);
    this.squares = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef(),
      React.createRef()
    ];
  }

  clickSquare(i) {
    this.squares[i].current.click();
  }

  render() {
    return (
      <div>
        <div className='board-row'>
          {this.createSquare(0, this.squares[0])}
          {this.createSquare(1, this.squares[1])}
          {this.createSquare(2, this.squares[2])}
        </div>
        <div className='board-row'>
          {this.createSquare(3, this.squares[3])}
          {this.createSquare(4, this.squares[4])}
          {this.createSquare(5, this.squares[5])}
        </div>
        <div className='board-row'>
          {this.createSquare(6, this.squares[6])}
          {this.createSquare(7, this.squares[7])}
          {this.createSquare(8, this.squares[8])}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
    this._child = React.createRef();
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });

    if (this.state.xIsNext) {
      this.forceUpdate(() => {
        if (!this.eightFull()) {
          this.moveRandom();
        }
      });
    }
  }

  eightFull() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    let filled = 0;

    for (let i = 0; i < 9; i++) {
      if (current.squares[i] === 'X' || current.squares[i] === 'O') {
        filled++;
      }
    }
    if (filled >= 8) {
      return true;
    }
    return false;
  }

  moveRandom() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    while (true) {
      const randomNum = Math.floor(Math.random() * 9);

      if (
        current.squares[randomNum] !== 'X' &&
        current.squares[randomNum] !== 'O'
      ) {
        this._child.current.clickSquare(randomNum);
        return;
      }
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      // history: [
      //   {
      //     squares: Array(9).fill(null)
      //   }
      // ],
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + getWinnerString(winner);
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            ref={this._child}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
//ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
