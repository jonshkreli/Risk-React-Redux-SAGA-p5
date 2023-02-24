import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {DefaultReducerStateType} from "../../../redux/reducers";
import './style.scss'
import {MESSAGE_ORIGINS, MessageOriginType} from "../../../game/models/MessageOriginType";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Experimental_CssVarsProvider, FormControlLabel,
    Typography
} from "@mui/material";
import {MessageType} from "../../../game/models/Message";

export const ActivityLog = () => {
    const {messages} = useSelector((state: DefaultReducerStateType) => state);

    // @ts-ignore
    let checksObj: { [K in MessageOriginType]: boolean } = {}
    for (const mo of MESSAGE_ORIGINS) {
        checksObj[mo] = true
    }

    const [checkedOrigins, setCheckedOrigins] = useState<{ [K in MessageOriginType]: boolean }>(checksObj)
    const [checkedTypes, setCheckedTypes] = useState<{ [K in MessageType]: boolean }>({
        INFO: false,
        SUCCESS: true,
        WARNING: true,
        ERROR: true,
    })

    const handleChangeMessageOrigin = (messageType: MessageOriginType, checked: boolean) => {
        const checkedObject = {...checkedOrigins}
        checkedObject[messageType] = checked
        setCheckedOrigins(checkedObject)
    };
    const handleChangeMessageType = (messageType: MessageType, checked: boolean) => {
        const checkedObject = {...checkedTypes}
        checkedObject[messageType] = checked
        setCheckedTypes(checkedObject)
    };

    return <div className='ActivityLog'>
            <Accordion className='Selectors-container'>
                <AccordionSummary className="panel-header">
                    <div className='Selectors-title'>Selectors</div>
                </AccordionSummary>
                <AccordionDetails className='AccordionDetails'>
                    <div className='Selectors-checkboxes'>
                        {Object.entries(checkedOrigins).map(([o, checked]) => <FormControlLabel
                                className='checkbox-container'
                                label={o}
                                control={<Checkbox
                                    checked={checked}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChangeMessageOrigin(o, event.target.checked)
                                    }}
                                    inputProps={{'aria-label': 'controlled'}}
                                />}
                            />
                        )}
                    </div>
                    <div className='Selectors-checkboxes'>
                        {Object.entries(checkedTypes).map(([o, checked]) => <FormControlLabel
                                className='checkbox-container'
                                label={o}
                                control={<Checkbox
                                    checked={checked}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChangeMessageType(o, event.target.checked)
                                    }}
                                    inputProps={{'aria-label': 'controlled'}}
                                />}
                            />
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>
        <div className='messages-container'>
            {messages.map(({type, message, origin}) => (
                <div className={`message ${type}`}>
                    {message}
                </div>
            ))}
        </div>
    </div>
}