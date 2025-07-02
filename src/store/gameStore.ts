
import { create } from 'zustand';
import { Tournament, Player, Match, WalletTransaction } from '../types';

interface GameStore {
  tournaments: Tournament[];
  players: Player[];
  matches: Match[];
  walletTransactions: WalletTransaction[];
  walletBalance: number;
  
  // Tournament actions
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, tournament: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  
  // Player actions
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  
  // Match actions
  addMatch: (match: Match) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  
  // Wallet actions
  addTransaction: (transaction: WalletTransaction) => void;
  updateBalance: (amount: number) => void;
}

// Mock data
const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Battle Royale Championship',
    game: 'Battle Royale',
    description: 'Ultimate championship with top players worldwide',
    prizePool: '$50,000',
    maxParticipants: 100,
    currentParticipants: 87,
    startDate: '2024-07-15',
    endDate: '2024-07-20',
    status: 'ongoing',
    image: '/lovable-uploads/feb97539-ef64-4950-81ec-d958016900ac.png'
  },
  {
    id: '2',
    name: 'FPS Masters Cup',
    game: 'FPS Arena',
    description: 'Fast-paced action tournament for FPS enthusiasts',
    prizePool: '$25,000',
    maxParticipants: 64,
    currentParticipants: 45,
    startDate: '2024-07-25',
    endDate: '2024-07-28',
    status: 'upcoming',
    image: '/lovable-uploads/feb97539-ef64-4950-81ec-d958016900ac.png'
  }
];

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'ProGamer_X',
    rank: 1,
    points: 2450,
    wins: 89,
    losses: 11,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    country: 'USA'
  },
  {
    id: '2',
    name: 'EliteSniper',
    rank: 2,
    points: 2380,
    wins: 76,
    losses: 24,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
    country: 'UK'
  },
  {
    id: '3',
    name: 'DigitalWarrior',
    rank: 3,
    points: 2290,
    wins: 68,
    losses: 32,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    country: 'Canada'
  }
];

const mockMatches: Match[] = [
  {
    id: '1',
    tournamentId: '1',
    player1: 'ProGamer_X',
    player2: 'EliteSniper',
    player1Score: 15,
    player2Score: 12,
    status: 'live',
    startTime: '2024-07-02T14:00:00Z',
    game: 'Battle Royale'
  },
  {
    id: '2',
    tournamentId: '1',
    player1: 'DigitalWarrior',
    player2: 'CyberNinja',
    player1Score: 0,
    player2Score: 0,
    status: 'upcoming',
    startTime: '2024-07-02T16:00:00Z',
    game: 'Battle Royale'
  }
];

const mockTransactions: WalletTransaction[] = [
  {
    id: '1',
    type: 'prize',
    amount: 500,
    description: 'Tournament win - Battle Royale',
    date: '2024-07-01',
    status: 'completed'
  },
  {
    id: '2',
    type: 'deposit',
    amount: 100,
    description: 'Wallet top-up',
    date: '2024-06-28',
    status: 'completed'
  }
];

export const useGameStore = create<GameStore>((set) => ({
  tournaments: mockTournaments,
  players: mockPlayers,
  matches: mockMatches,
  walletTransactions: mockTransactions,
  walletBalance: 750,
  
  addTournament: (tournament) =>
    set((state) => ({ tournaments: [...state.tournaments, tournament] })),
  
  updateTournament: (id, updatedTournament) =>
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === id ? { ...t, ...updatedTournament } : t
      ),
    })),
  
  deleteTournament: (id) =>
    set((state) => ({
      tournaments: state.tournaments.filter((t) => t.id !== id),
    })),
  
  addPlayer: (player) =>
    set((state) => ({ players: [...state.players, player] })),
  
  updatePlayer: (id, updatedPlayer) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, ...updatedPlayer } : p
      ),
    })),
  
  deletePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),
  
  addMatch: (match) =>
    set((state) => ({ matches: [...state.matches, match] })),
  
  updateMatch: (id, updatedMatch) =>
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === id ? { ...m, ...updatedMatch } : m
      ),
    })),
  
  deleteMatch: (id) =>
    set((state) => ({
      matches: state.matches.filter((m) => m.id !== id),
    })),
  
  addTransaction: (transaction) =>
    set((state) => ({
      walletTransactions: [...state.walletTransactions, transaction],
    })),
  
  updateBalance: (amount) =>
    set((state) => ({ walletBalance: state.walletBalance + amount })),
}));
