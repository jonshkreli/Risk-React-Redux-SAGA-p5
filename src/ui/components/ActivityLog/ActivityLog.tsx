import React from 'react';
import {useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import './style.scss'

export const ActivityLog = () => {
    const {messages} = useSelector((state: DefaultReducerStateType) => state);

    return <div className='ActivityLog'>
        <div className='Selectors-container'>
            <div className='Selectors-title'>Selectors</div>
            <div className='Selectors-checkboxes'>

            </div>
        </div>
        <div className='messages-container'>
            {messages.map(({type, message, origin}) => (
                <div className={`message ${type}`}>
                    {message}
                </div>
            ))}
        </div>
    </div>
}