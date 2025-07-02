
import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Users, Trophy, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { useGameStore } from '@/store/gameStore';
import { Tournament, Player, Match } from '@/types';

const Admin = () => {
  const {
    tournaments,
    players,
    matches,
    addTournament,
    updateTournament,
    deleteTournament,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addMatch,
    updateMatch,
    deleteMatch,
  } = useGameStore();

  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [showAddTournament, setShowAddTournament] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);

  // Tournament form state
  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    game: '',
    description: '',
    prizePool: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    status: 'upcoming' as const,
  });

  // Player form state
  const [playerForm, setPlayerForm] = useState({
    name: '',
    points: '',
    wins: '',
    losses: '',
    country: '',
    avatar: '',
  });

  // Match form state
  const [matchForm, setMatchForm] = useState({
    tournamentId: '',
    player1: '',
    player2: '',
    player1Score: '',
    player2Score: '',
    status: 'upcoming' as const,
    startTime: '',
    game: '',
  });

  const resetTournamentForm = () => {
    setTournamentForm({
      name: '',
      game: '',
      description: '',
      prizePool: '',
      maxParticipants: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
    });
    setEditingTournament(null);
    setShowAddTournament(false);
  };

  const resetPlayerForm = () => {
    setPlayerForm({
      name: '',
      points: '',
      wins: '',
      losses: '',
      country: '',
      avatar: '',
    });
    setEditingPlayer(null);
    setShowAddPlayer(false);
  };

  const resetMatchForm = () => {
    setMatchForm({
      tournamentId: '',
      player1: '',
      player2: '',
      player1Score: '',
      player2Score: '',
      status: 'upcoming',
      startTime: '',
      game: '',
    });
    setEditingMatch(null);
    setShowAddMatch(false);
  };

  const handleSaveTournament = () => {
    const tournamentData = {
      ...tournamentForm,
      maxParticipants: parseInt(tournamentForm.maxParticipants),
      currentParticipants: editingTournament?.currentParticipants || 0,
      image: '/lovable-uploads/feb97539-ef64-4950-81ec-d958016900ac.png',
    };

    if (editingTournament) {
      updateTournament(editingTournament.id, tournamentData);
    } else {
      addTournament({
        ...tournamentData,
        id: Date.now().toString(),
      });
    }
    resetTournamentForm();
  };

  const handleSavePlayer = () => {
    const playerData = {
      ...playerForm,
      points: parseInt(playerForm.points),
      wins: parseInt(playerForm.wins),
      losses: parseInt(playerForm.losses),
      avatar: playerForm.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    };

    if (editingPlayer) {
      updatePlayer(editingPlayer.id, playerData);
    } else {
      const newRank = Math.max(...players.map(p => p.rank), 0) + 1;
      addPlayer({
        ...playerData,
        id: Date.now().toString(),
        rank: newRank,
      });
    }
    resetPlayerForm();
  };

  const handleSaveMatch = () => {
    const matchData = {
      ...matchForm,
      player1Score: parseInt(matchForm.player1Score) || 0,
      player2Score: parseInt(matchForm.player2Score) || 0,
    };

    if (editingMatch) {
      updateMatch(editingMatch.id, matchData);
    } else {
      addMatch({
        ...matchData,
        id: Date.now().toString(),
      });
    }
    resetMatchForm();
  };

  const startEditTournament = (tournament: Tournament) => {
    setTournamentForm({
      name: tournament.name,
      game: tournament.game,
      description: tournament.description,
      prizePool: tournament.prizePool,
      maxParticipants: tournament.maxParticipants.toString(),
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      status: tournament.status,
    });
    setEditingTournament(tournament);
    setShowAddTournament(true);
  };

  const startEditPlayer = (player: Player) => {
    setPlayerForm({
      name: player.name,
      points: player.points.toString(),
      wins: player.wins.toString(),
      losses: player.losses.toString(),
      country: player.country,
      avatar: player.avatar,
    });
    setEditingPlayer(player);
    setShowAddPlayer(true);
  };

  const startEditMatch = (match: Match) => {
    setMatchForm({
      tournamentId: match.tournamentId,
      player1: match.player1,
      player2: match.player2,
      player1Score: match.player1Score.toString(),
      player2Score: match.player2Score.toString(),
      status: match.status,
      startTime: match.startTime,
      game: match.game,
    });
    setEditingMatch(match);
    setShowAddMatch(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Panel</h1>
          <p className="text-gray-400 text-lg">
            Manage tournaments, players, and matches
          </p>
        </div>

        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-purple-500">
              <Trophy className="w-4 h-4 mr-2" />
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-purple-500">
              <Users className="w-4 h-4 mr-2" />
              Players
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-purple-500">
              <Play className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
          </TabsList>

          {/* Tournaments Tab */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Tournaments</h2>
              <Button 
                onClick={() => setShowAddTournament(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tournament
              </Button>
            </div>

            {(showAddTournament || editingTournament) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingTournament ? 'Edit Tournament' : 'Add New Tournament'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tournament Name
                      </label>
                      <Input
                        value={tournamentForm.name}
                        onChange={(e) => setTournamentForm({...tournamentForm, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Game
                      </label>
                      <Input
                        value={tournamentForm.game}
                        onChange={(e) => setTournamentForm({...tournamentForm, game: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={tournamentForm.description}
                      onChange={(e) => setTournamentForm({...tournamentForm, description: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prize Pool
                      </label>
                      <Input
                        value={tournamentForm.prizePool}
                        onChange={(e) => setTournamentForm({...tournamentForm, prizePool: e.target.value})}
                        placeholder="e.g., $10,000"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Participants
                      </label>
                      <Input
                        type="number"
                        value={tournamentForm.maxParticipants}
                        onChange={(e) => setTournamentForm({...tournamentForm, maxParticipants: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <Select value={tournamentForm.status} onValueChange={(value: any) => setTournamentForm({...tournamentForm, status: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={tournamentForm.startDate}
                        onChange={(e) => setTournamentForm({...tournamentForm, startDate: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        End Date
                      </label>
                      <Input
                        type="date"
                        value={tournamentForm.endDate}
                        onChange={(e) => setTournamentForm({...tournamentForm, endDate: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTournament} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Tournament
                    </Button>
                    <Button onClick={resetTournamentForm} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">{tournament.name}</h3>
                        <p className="text-gray-400 mb-2">{tournament.description}</p>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>Game: {tournament.game}</span>
                          <span>Prize: {tournament.prizePool}</span>
                          <span>Participants: {tournament.currentParticipants}/{tournament.maxParticipants}</span>
                          <span>Status: {tournament.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => startEditTournament(tournament)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => deleteTournament(tournament.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Players</h2>
              <Button 
                onClick={() => setShowAddPlayer(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </div>

            {(showAddPlayer || editingPlayer) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingPlayer ? 'Edit Player' : 'Add New Player'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player Name
                      </label>
                      <Input
                        value={playerForm.name}
                        onChange={(e) => setPlayerForm({...playerForm, name: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <Input
                        value={playerForm.country}
                        onChange={(e) => setPlayerForm({...playerForm, country: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Points
                      </label>
                      <Input
                        type="number"
                        value={playerForm.points}
                        onChange={(e) => setPlayerForm({...playerForm, points: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Wins
                      </label>
                      <Input
                        type="number"
                        value={playerForm.wins}
                        onChange={(e) => setPlayerForm({...playerForm, wins: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Losses
                      </label>
                      <Input
                        type="number"
                        value={playerForm.losses}
                        onChange={(e) => setPlayerForm({...playerForm, losses: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Avatar URL (optional)
                    </label>
                    <Input
                      value={playerForm.avatar}
                      onChange={(e) => setPlayerForm({...playerForm, avatar: e.target.value})}
                      placeholder="https://example.com/avatar.jpg"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSavePlayer} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Player
                    </Button>
                    <Button onClick={resetPlayerForm} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {players.map((player) => (
                <Card key={player.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          #{player.rank}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{player.name}</h3>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>Points: {player.points}</span>
                            <span>W/L: {player.wins}/{player.losses}</span>
                            <span>Country: {player.country}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => startEditPlayer(player)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => deletePlayer(player.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Matches</h2>
              <Button 
                onClick={() => setShowAddMatch(true)}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Match
              </Button>
            </div>

            {(showAddMatch || editingMatch) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingMatch ? 'Edit Match' : 'Add New Match'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tournament
                      </label>
                      <Select value={matchForm.tournamentId} onValueChange={(value) => setMatchForm({...matchForm, tournamentId: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select Tournament" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {tournaments.map((tournament) => (
                            <SelectItem key={tournament.id} value={tournament.id}>
                              {tournament.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Game
                      </label>
                      <Input
                        value={matchForm.game}
                        onChange={(e) => setMatchForm({...matchForm, game: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 1
                      </label>
                      <Input
                        value={matchForm.player1}
                        onChange={(e) => setMatchForm({...matchForm, player1: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 2
                      </label>
                      <Input
                        value={matchForm.player2}
                        onChange={(e) => setMatchForm({...matchForm, player2: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 1 Score
                      </label>
                      <Input
                        type="number"
                        value={matchForm.player1Score}
                        onChange={(e) => setMatchForm({...matchForm, player1Score: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Player 2 Score
                      </label>
                      <Input
                        type="number"
                        value={matchForm.player2Score}
                        onChange={(e) => setMatchForm({...matchForm, player2Score: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status
                      </label>
                      <Select value={matchForm.status} onValueChange={(value: any) => setMatchForm({...matchForm, status: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time
                    </label>
                    <Input
                      type="datetime-local"
                      value={matchForm.startTime}
                      onChange={(e) => setMatchForm({...matchForm, startTime: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveMatch} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Match
                    </Button>
                    <Button onClick={resetMatchForm} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {matches.map((match) => (
                <Card key={match.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            match.status === 'live' 
                              ? 'bg-red-500 text-white' 
                              : match.status === 'upcoming'
                              ? 'bg-yellow-500 text-black'
                              : 'bg-green-500 text-white'
                          }`}>
                            {match.status.toUpperCase()}
                          </span>
                          <span className="text-gray-400 text-sm">{match.game}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">
                          {match.player1} vs {match.player2}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span>Score: {match.player1Score} - {match.player2Score}</span>
                          <span>Start: {new Date(match.startTime).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => startEditMatch(match)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => deleteMatch(match.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
