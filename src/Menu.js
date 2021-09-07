import React from "react";
import { GameState } from "./GameSettings";


export default class Menu extends React.Component
{
    render()
    {
        return (
            <div className={ "menu " + ((this.props.gameState === GameState.newGame || this.props.gameState === GameState.pause) ? "" : "unvisible") }>
                <ul>
                    <li><button className={ this.props.gameState === GameState.newGame ? "disabled" : "" } 
                                onClick={ this.props.onContinueButtonClicked }>Continue</button></li>
                    <li><button onClick={ this.props.onNewGameButtonClicked }>New game</button></li>
                    <li><button onClick={ this.props.onButtonSettingsClicked }>Settings</button></li>
                </ul>
            </div>
        );
    }
}