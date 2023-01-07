import React from 'react';
import {GameStatusView} from "../components/GameStatusView";
import {ButtonsContainer} from "./ButtonsContainer";
import {SoldersMovingTo} from "../components/SoldersMovingTo";

export const SideBar = () => {

    return <div className='sidebar'>
            <ButtonsContainer/>
            <GameStatusView/>
        <SoldersMovingTo/>
    </div>
}