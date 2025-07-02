
import { useState } from 'react';
import { Trophy, Medal, Award, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useGameStore } from '@/store/gameStore';

const Leaderboards = () => {
  const { players } = useGameStore();
  const [selectedGame, setSelectedGame] = useState('all');

  const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-yellow-600';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Leaderboards</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See where you stand among the best players in the world
          </p>
        </div>

        {/* Game Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['all', 'Battle Royale', 'FPS Arena', 'MOBA', 'RTS'].map((game) => (
            <Button
              key={game}
              variant={selectedGame === game ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedGame(game)}
              className={selectedGame === game 
                ? 'bg-purple-500 hover:bg-purple-600' 
                : 'border-gray-600 text-gray-300 hover:bg-gray-800'
              }
            >
              {game === 'all' ? 'All Games' : game}
            </Button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {sortedPlayers.slice(0, 3).map((player, index) => (
            <Card 
              key={player.id} 
              className={`bg-gray-800 border-2 transition-all duration-300 ${
                index === 0 
                  ? 'border-yellow-500 shadow-yellow-500/20 shadow-lg' 
                  : index === 1
                  ? 'border-gray-400 shadow-gray-400/20 shadow-lg'
                  : 'border-amber-600 shadow-amber-600/20 shadow-lg'
              } ${index === 0 ? 'md:order-2 md:scale-105' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${getRankBadgeColor(player.rank)}`}>
                  {getRankIcon(player.rank)}
                </div>
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white/20">
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="text-white font-bold text-lg mb-2">{player.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <Flag className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-gray-400 text-sm">{player.country}</span>
                </div>
                <div className="text-2xl font-bold text-purple-400 mb-2">{player.points}</div>
                <div className="text-sm text-gray-400">
                  {player.wins}W / {player.losses}L
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-xl">Global Rankings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id}
                  className={`flex items-center p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors ${
                    index < 3 ? 'bg-gray-700/30' : ''
                  }`}
                >
                  <div className="w-12 flex justify-center">
                    {getRankIcon(player.rank)}
                  </div>
                  
                  <Avatar className="w-12 h-12 mx-4">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{player.name}</h3>
                      <Flag className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{player.country}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-purple-400 font-bold text-lg">{player.points}</div>
                    <div className="text-gray-400 text-sm">
                      {player.wins}W / {player.losses}L
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboards;
