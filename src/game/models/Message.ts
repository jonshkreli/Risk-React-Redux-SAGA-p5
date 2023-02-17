import {MessageOrigins} from "./MessageOrigins";

export interface Message {
    message: string
    type: MessageType
    origin: MessageOrigins[]
}

export type MessageType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'