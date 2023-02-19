import React from 'react';
import {GameStatusView} from "../components/GameStatusView";
import {ButtonsContainer} from "./ButtonsContainer";
import {SoldersMovingTo} from "../components/SoldersMovingTo";
import {SettingsContainer} from "./SettingsContainer";
import './containerStyles.scss'
import {ActivityLog} from "../components/ActivityLog/ActivityLog";

export const SideBar = () => {

    return <div className='sidebar'>
        <ButtonsContainer/>
        <GameStatusView/>
        <ActivityLog/>
        <SettingsContainer/>
        <SoldersMovingTo/>
    </div>
}