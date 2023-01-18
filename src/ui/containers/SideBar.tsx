import React from 'react';
import {GameStatusView} from "../components/GameStatusView";
import {ButtonsContainer} from "./ButtonsContainer";
import {SoldersMovingTo} from "../components/SoldersMovingTo";
import {SettingsContainer} from "./SettingsContainer";
import './containerStyles.scss'

export const SideBar = () => {

    return <div className='sidebar'>
        <ButtonsContainer/>
        <GameStatusView/>
        <SettingsContainer/>
        <SoldersMovingTo/>
    </div>
}