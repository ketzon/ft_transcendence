export interface Game {
    date: string;
    starts_at: string,
    player1: Player | null;
    player2Name : string;
    score: string;
    score1?: number;
    score2?: number;
    result: 'Win' | 'Loss'
    duration?: string;
    is_completed: boolean;
    is_bye?: boolean;
    gameStats: Game;
    gameDuration: string;     // Total game duration
    totalMoves: number;       // Total number of moves
    avgMoveTime: string;      // Average time between moves
    totalGames?: number;      // Total number of games played
}

export interface Player {
    id: number;
    username: string;
    avatar: string;
    avatar_url?: string;
    rating?: number;
}

export interface Round {
    players: Player[];
    games: Game[];
}

export interface Tournament {
    id: number;
    name: string;
    start_time: string;
    players: Player[];
    rounds: Round[];
    isInvitationPhase?: boolean;
    tournamentName: string;
}

// Declare global window interface augmentation
declare global {
    interface Window {
        myChart?: any;
    }
} 