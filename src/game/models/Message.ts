import {MessageOriginType} from "./MessageOriginType";

export interface Message {
    message: string
    type: MessageType
    origin: MessageOriginType[]
}

export type MessageType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'