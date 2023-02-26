export const MESSAGE_ORIGINS = [
        'ATTACK',
        'ATTACK WILL START',
        'ATTACK RESULT',
        'SOLDERS LEFT',
        'TERRITORY INVADED',
        'TERRITORY NOT INVADED',
        'AFTER ATTACK',
        'PLAYER OUT OF GAME',
        'MOVE SOLDERS',

    ] as const
export type MessageOriginType = typeof MESSAGE_ORIGINS[number];
