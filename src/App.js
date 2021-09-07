import './App.css';
import React from 'react';
import Menu from './Menu';
import Settings from './Settigns';
import { GameState, SnakeSpeed, BlockSize } from "./GameSettings";

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

    this.state = this.getEmptyState();
  }

  componentDidUpdate(prevProps, prevState, snapshot)
  {
    if (this.state.gameState === GameState.running)
    {
      const { body, food } = this.state;
      const ctx = this.canvasRef.current.getContext("2d");
      prevState.body.forEach(element => ctx.clearRect(element.x, element.y, BlockSize, BlockSize));
      body.forEach(element => ctx.fillRect(element.x, element.y, BlockSize, BlockSize));

      ctx.clearRect(prevState.food.x, prevState.food.y, BlockSize, BlockSize);
      ctx.fillRect(food.x, food.y, BlockSize, BlockSize);
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
        case 32://space, spawn food        
          body.push({ x: body[body.length - 1].x, y: body[body.length - 1].y });
          break;
        case 27://escape, pause game and go to menu
          if (gameState === GameState.running)      
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
      let { body, food } = this.state;
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
          head.x -= BlockSize;
          break;
        case Direction.right:
          head.x += BlockSize;
          break;
        case Direction.up:
          head.y -= BlockSize;
          break;
        case Direction.down:
          head.y += BlockSize;
          break;
        default:
          break;
      }

      if (food.x === head.x && food.y === head.y)
      {
        body.push({ x: body[body.length - 1].x, y: body[body.length - 1].y });        
       
        food.x = Math.floor((Math.random() * this.canvasRef.current.width) / BlockSize) * BlockSize;
        food.y = Math.floor((Math.random() * this.canvasRef.current.height) / BlockSize) * BlockSize;        
      }
      
      if (this.canvasRef.current)
      {
        if (head.x >= this.canvasRef.current.width)
          head.x = 0;
        else
        if (head.x < 0)
          head.x = this.canvasRef.current.width - BlockSize;
        else
        if (head.y >= this.canvasRef.current.height)
          head.y = 0;
        else
        if (head.y < 0)
          head.y = this.canvasRef.current.height - BlockSize;
      }

      self.setState({ body, food });
    }, self.state.snakeSpeed);

    this.setState({ gameState: GameState.running });
  }

  clearGame = () =>
  {
    this.setState(this.getEmptyState());
  }

  getEmptyState = () =>
  {
    return {
      body: [ { x: BlockSize, y: BlockSize } ],
      direction: Direction.right,
      food: { x: 60, y: 60 },
      gameState: GameState.newGame,
      snakeSpeed: SnakeSpeed.slow,
      isWallEnabled: false
    };
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

  onSpeedChanged = (snakeSpeed) =>
  {
    this.setState({ snakeSpeed });
  }

  onWallChanged = (isWallEnabled) =>
  {
    this.setState({ isWallEnabled });
  }

  onButtonSettingsClicked = () =>
  {
    this.setState({ gameState: GameState.settings });
  }

  onButtonBackClicked = () =>
  {
    const gameState = this.intervalInstance ? GameState.pause : GameState.newGame;
    this.setState({ gameState });
  }

  render()
  {
    return (
      <div className="app">
        <Menu gameState={this.state.gameState} onNewGameButtonClicked={this.onNewGameButtonClicked} 
              onContinueButtonClicked={this.onContinueButtonClicked}
              onButtonSettingsClicked={this.onButtonSettingsClicked}/>
        <Settings gameState={this.state.gameState}
                  snakeSpeed={this.state.snakeSpeed} onSpeedChanged={this.onSpeedChanged} 
                  isWallEnabled={this.state.isWallEnabled} onWallChanged={this.onWallChanged}
                  onButtonBackClicked={this.onButtonBackClicked}/>
        <canvas width="500" height="500" ref={this.canvasRef}/>
      </div>
    );
  }
}

export default App;
