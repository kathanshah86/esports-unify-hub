
export interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string;
  prize_pool: string;
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  banner?: string;
  entry_fee?: string;
  region?: string;
  format?: string;
  team_size?: string;
  organizer?: string;
  rules?: string;
  schedule?: string;
  prizes?: string;
  highlights?: string[];
  registration_opens?: string;
  registration_closes?: string;
  created_at?: string;
  updated_at?: string;
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
  team?: string;
  earnings: number;
  win_rate: number;
  tournaments_won: number;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id: string;
  tournament_id: string;
  player1: string;
  player2: string;
  player1_score: number;
  player2_score: number;
  status: 'live' | 'upcoming' | 'completed';
  start_time: string;
  game: string;
  thumbnail?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'prize';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}
