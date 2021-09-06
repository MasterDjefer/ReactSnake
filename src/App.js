import './App.css';
import React from 'react';

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

    this.state =
    {
      body: [ { x: 0, y: 0 } ],
      direction: Direction.right,
      blockSize: 20      
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot)
  {
    const { body, blockSize } = this.state;
    const ctx = this.canvasRef.current.getContext("2d");
    prevState.body.forEach(element => ctx.clearRect(element.x, element.y, blockSize, blockSize));
    body.forEach(element => ctx.fillRect(element.x, element.y, blockSize, blockSize));
  }

  componentDidMount()
  {
    console.log(this.canvasRef.current.width, this.canvasRef.current.height);
    document.addEventListener("keydown", this.onKeyPressed, false);

    let self = this;
    setInterval(() =>
    {
      let { body, blockSize } = this.state;
      const cBody = JSON.parse(JSON.stringify(body));

      const head = cBody[0];
      for (let i = cBody.length - 1; i > 0; --i)
      {
        cBody[i].x = cBody[i - 1].x;
        cBody[i].y = cBody[i - 1].y;
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

      self.setState({ body: cBody });
    }, 100);
  }

  onKeyPressed = (event) =>
  {
    let { body, direction } = this.state; 
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
      default:
        break;
    }
      
    this.setState({ body, direction });
  }

  render()
  {
    return (
      <div className="app">
        <canvas width="500" height="500" ref={this.canvasRef}/>
      </div>
    );
  }
}

export default App;
