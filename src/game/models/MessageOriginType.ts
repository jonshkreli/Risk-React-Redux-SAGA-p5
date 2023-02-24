export const MESSAGE_ORIGINS = [
        'ATTACK',
        'ATTACK WILL START',
        'ATTACK RESULT',
        'SOLDERS LEFT',
        'TERRITORY INVADED',
        'TERRITORY NOT INVADED',
        'PLAYER OUT OF GAME',

    ] as const
export type MessageOriginType = typeof MESSAGE_ORIGINS[number];
