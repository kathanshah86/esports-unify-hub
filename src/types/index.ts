export interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string;
  prizePool: string;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  banner?: string; // New field for tournament banner
}

export interface Player {
  id: string;
  name: string;
  rank: number;
  points: number;
  wins: number;
  losses: number;
  avatar: string;
  country: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
  status: 'live' | 'upcoming' | 'completed';
  startTime: string;
  game: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'prize';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}
