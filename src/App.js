import './App.css';
import React from 'react';
import { Menu, GameState } from './Menu';

const Direction = 
{ 
  left:  "left", 
  right: "right",
  up:  "up",
  down: "down",
};

class App extends React.Component 
{
  constructor()
  {
    super();

    this.canvasRef = React.createRef();
    this.intervalInstance = null;

    this.state =
    {
      body: [ { x: 0, y: 0 } ],
      direction: Direction.right,
      food: { x: 60, y: 60 },
      blockSize: 20,
      gameState: GameState.newGame
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot)
  {
    if (this.state.gameState === GameState.running)
    {
      const { body, blockSize, food } = this.state;
      const ctx = this.canvasRef.current.getContext("2d");
      prevState.body.forEach(element => ctx.clearRect(element.x, element.y, blockSize, blockSize));
      body.forEach(element => ctx.fillRect(element.x, element.y, blockSize, blockSize));

      ctx.clearRect(prevState.food.x, prevState.food.y, blockSize, blockSize);
      ctx.fillRect(food.x, food.y, blockSize, blockSize);
    }
    else
    if (this.state.gameState === GameState.pause)
    {
      clearInterval(this.intervalInstance);
    }
  }

  componentDidMount()
  {
    document.addEventListener("keydown", this.onKeyPressed, false);
  }

  onKeyPressed = (event) =>
  {
    if (this.state.gameState === GameState.running)
    {
      let { body, direction, gameState } = this.state; 
      body = JSON.parse(JSON.stringify(body));
      
      switch (event.keyCode)
      {
        case 65://A, left
          if (this.state.direction !== Direction.right)
            direction = Direction.left
          break;
        case 68://D, right
          if (this.state.direction !== Direction.left)
            direction = Direction.right
          break;
        case 87://W, up
          if (this.state.direction !== Direction.down)
            direction = Direction.up
          break;
        case 83://S, down
          if (this.state.direction !== Direction.up)
            direction = Direction.down
          break;
        case 32:        
          body.push({ x: body[body.length - 1].x, y: body[body.length - 1].y });
          break;
        case 27:        
          gameState = GameState.pause;
          break;
        default:
          break;
      }
        
      this.setState({ body, direction, gameState });
    }
  }

  startGame = () =>
  {
    let self = this;
    this.intervalInstance = setInterval(() =>
    {
      let { body, blockSize, food } = this.state;
      body = JSON.parse(JSON.stringify(body));

      const head = body[0];
      for (let i = body.length - 1; i > 0; --i)
      {
        body[i].x = body[i - 1].x;
        body[i].y = body[i - 1].y;
      }

      switch (this.state.direction)
      {
        case Direction.left:
          head.x -= blockSize;
          break;
        case Direction.right:
          head.x += blockSize;
          break;
        case Direction.up:
          head.y -= blockSize;
          break;
        case Direction.down:
          head.y += blockSize;
          break;
        default:
          break;
      }

      if (food.x === head.x && food.y === head.y)
      {
        body.push({ x: body[body.length - 1].x, y: body[body.length - 1].y });        
       
        food.x = Math.floor((Math.random() * this.canvasRef.current.width) / blockSize) * blockSize;
        food.y = Math.floor((Math.random() * this.canvasRef.current.height) / blockSize) * blockSize;        
      }
      
      if (this.canvasRef.current)
      {
        if (head.x >= this.canvasRef.current.width)
          head.x = 0;
        else
        if (head.x < 0)
          head.x = this.canvasRef.current.width - blockSize;
        else
        if (head.y >= this.canvasRef.current.height)
          head.y = 0;
        else
        if (head.y < 0)
          head.y = this.canvasRef.current.height - blockSize;
      }

      self.setState({ body, food });
    }, 100);

    this.setState({ gameState: GameState.running });
  }

  clearGame = () =>
  {
    this.setState(
    {
      body: [ { x: 0, y: 0 } ],
      direction: Direction.right,
      food: { x: 60, y: 60 },
      blockSize: 20
    });
  }

  onNewGameButtonClicked = () =>
  {
    this.clearGame();
    this.startGame();
  }

  onContinueButtonClicked = () =>
  {
    this.startGame();
  }

  render()
  {
    return (
      <div className="app">
        <Menu gameState={this.state.gameState} newGameHandler={this.onNewGameButtonClicked} continueGameHandler={this.onContinueButtonClicked}/>
        <canvas width="500" height="500" ref={this.canvasRef}/>
      </div>
    );
  }
}

export default App;
