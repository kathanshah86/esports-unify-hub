
import { useState } from 'react';
import { Search, Filter, Calendar, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { useGameStore } from '@/store/gameStore';

const Tournaments = () => {
  const { tournaments } = useGameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Tournaments</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover and join exciting esports tournaments from around the world
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status 
                  ? 'bg-purple-500 hover:bg-purple-600' 
                  : 'border-gray-600 text-gray-300 hover:bg-gray-800'
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Tournament Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tournament.status === 'ongoing' 
                      ? 'bg-green-500 text-white' 
                      : tournament.status === 'upcoming'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {tournament.status.toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {tournament.prizePool}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                  {tournament.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {tournament.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    {tournament.game}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    {tournament.currentParticipants}/{tournament.maxParticipants} players
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(tournament.startDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    disabled={tournament.status === 'completed'}
                  >
                    {tournament.status === 'completed' ? 'Completed' : 'Join Now'}
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800">
                    <Trophy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No tournaments found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tournaments;
