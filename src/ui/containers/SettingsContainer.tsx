import React, {ChangeEvent, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../redux/reducers";
import {Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import {SettingsInterface} from "../../game/constants/settingsConfig";
import {setSettings} from "../../redux/actions";

export const SettingsContainer = () => {
    const {settings, game} = useSelector((state: DefaultReducerStateType) => state);
    const dispatch = useDispatch()

    const dicesOptions: (1 | 2 | 3 | 'max')[] = [1, 2, 3, 'max']

    const onDiceChange = (d: 1 | 2 | 3 | 'max') => {

        const modifiedSettings = {...settings}

        modifiedSettings.dicesNumber.value = d;

        dispatch(setSettings(modifiedSettings))
    }

    const onContinueAttackChange = (c: ChangeEvent<HTMLInputElement>) => {
        const modifiedSettings = {...settings}

        modifiedSettings.continueAttack.value = c.target.checked;

        dispatch(setSettings(modifiedSettings))
    }
    const onMoveSoldersChange = (c: ChangeEvent<HTMLInputElement>) => {
        const modifiedSettings = {...settings}

        modifiedSettings.moveAllSoldersAfterAttack.value = c.target.checked;

        dispatch(setSettings(modifiedSettings))
    }
    const ContinuousAndMoveAll = (c: ChangeEvent<HTMLInputElement>) => {
        const modifiedSettings = {...settings}

        const checked = c.target.checked

        modifiedSettings.ContinuousAndMoveAll.value = checked;
        modifiedSettings.moveAllSoldersAfterAttack.value = checked;
        modifiedSettings.continueAttack.value = checked;
        modifiedSettings.dicesNumber.value = "max";

        dispatch(setSettings(modifiedSettings))
    }

    useEffect(() => {
        const modifiedSettings = {...settings}

        modifiedSettings.ContinuousAndMoveAll.value = settings.continueAttack.value && settings.moveAllSoldersAfterAttack.value && settings.dicesNumber.value === "max";

        dispatch(setSettings(modifiedSettings))
    }, [settings.continueAttack.value, settings.moveAllSoldersAfterAttack.value, settings.dicesNumber.value])

    return <div className='SettingsContainer'>
        <div>
            <div>How many dices do you want to use?</div>
            <div>
                <FormGroup className='dicesSettings'>
                    {dicesOptions.map(d => {
                        return <FormControlLabel onChange={() => {
                            onDiceChange(d)
                        }} label={d} key={d} control={<Checkbox value={d}
                                                                checked={settings.dicesNumber.value === d}/>}/>
                    })}
                </FormGroup>
            </div>
        </div>
        <div>
            <span>Continuous attack?</span>
            <Checkbox onChange={onContinueAttackChange} checked={settings.continueAttack.value}/>
        </div>
        <div>
            <span>Move all solders after attack?</span>
            <Checkbox onChange={onMoveSoldersChange} checked={settings.moveAllSoldersAfterAttack.value}/>
        </div>
        <div>
            <span>Continuous and Move all solders?</span>
            <Checkbox onChange={ContinuousAndMoveAll} checked={settings.ContinuousAndMoveAll.value}/>
        </div>
    </div>
}