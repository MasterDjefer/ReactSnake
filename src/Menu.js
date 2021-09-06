import React from "react";

export const GameState =
{
  newGame: "newGame",
  running: "running",
  pause: "pause",
  lose: "lose"
};

export class Menu extends React.Component
{
    render()
    {
        return (
            <div className={ this.props.gameState === GameState.newGame || this.props.gameState === GameState.pause ? "" : "unvisible" }>
                <ul>
                    <li><button className={ this.props.gameState === GameState.newGame ? "disabled" : "" } 
                                onClick={this.props.continueGameHandler}>Continue</button></li>
                    <li><button onClick={this.props.newGameHandler}>New game</button></li>
                    <li><button>Settings</button></li>
                </ul>
            </div>
        );
    }
}