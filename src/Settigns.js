import React from "react";

export const SnakeSpeed =
{
    slow: 300,
    medium: 150,
    fast: 50
};

export class Settings extends React.Component
{
    render()
    {
        return (
            <div>
                <ul className="settings-list">
                    <li>
                        <div>
                            <ul className="settings-sublist">
                                <li>Speed:</li>
                                <li onClick={ () => this.props.onSpeedChanged(SnakeSpeed.slow) } className={ "cursor-pointer " + ((this.props.snakeSpeed === SnakeSpeed.slow) ? "selected-setting" : "") }>Slow</li>
                                <li onClick={ () => this.props.onSpeedChanged(SnakeSpeed.medium) } className={ "cursor-pointer " + ((this.props.snakeSpeed === SnakeSpeed.medium) ? "selected-setting" : "") }>Medium</li>
                                <li onClick={ () => this.props.onSpeedChanged(SnakeSpeed.fast) } className={ "cursor-pointer " + ((this.props.snakeSpeed === SnakeSpeed.fast) ? "selected-setting" : "") }>Fast</li>
                            </ul>
                        </div>
                    </li>

                    <li>
                        <div>
                            <ul className="settings-sublist">
                                <li>Wall:</li>
                                <li onClick={ () => this.props.onWallChanged(true) } className={ "cursor-pointer " + (this.props.isWallEnabled ? "selected-setting" : "") }>On</li>
                                <li onClick={ () => this.props.onWallChanged(false) } className={ "cursor-pointer " + (this.props.isWallEnabled ? "" : "selected-setting") }>Off</li>
                            </ul>
                        </div>
                    </li>
                    
                    <li className="cursor-pointer button"><p>Back</p></li>
                </ul>
            </div>
        );
    }
}