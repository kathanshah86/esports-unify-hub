
import { Link } from 'react-router-dom';
import { Trophy, Users, DollarSign, Gamepad2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useGameStore } from '@/store/gameStore';

const Index = () => {
  const { tournaments, players, matches } = useGameStore();

  const stats = [
    {
      label: 'Tournaments',
      value: '500+',
      icon: Trophy,
      color: 'text-purple-400',
    },
    {
      label: 'Players',
      value: '50k+',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      label: 'Prize Pool',
      value: '₹1M+',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      label: 'Games',
      value: '20+',
      icon: Gamepad2,
      color: 'text-orange-400',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e')] bg-cover bg-center opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Compete. Dominate.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Conquer.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the ultimate esports tournament platform. Participate in competitions,
              climb the leaderboards, and win amazing prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-6"
              >
                <Link to="/tournaments">Join a Tournament Now!</Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 py-6"
              >
                <Link to="/tournaments">Browse Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Tournaments</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the most exciting tournaments happening right now
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.slice(0, 3).map((tournament) => (
              <Card key={tournament.id} className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tournament.status === 'ongoing' 
                        ? 'bg-green-500/20 text-green-400' 
                        : tournament.status === 'upcoming'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tournament.status.toUpperCase()}
                    </span>
                    <span className="text-purple-400 font-bold">{tournament.prizePool}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">
                    {tournament.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{tournament.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{tournament.currentParticipants}/{tournament.maxParticipants} players</span>
                    <span>{tournament.game}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
              <Link to="/tournaments" className="inline-flex items-center">
                View All Tournaments <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Compete?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of players in epic tournaments and climb your way to the top
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Link to="/tournaments">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
