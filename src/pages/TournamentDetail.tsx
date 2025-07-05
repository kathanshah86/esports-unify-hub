import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, Clock, Trophy, ArrowLeft, Gamepad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import TournamentRegistrationComponent from '@/components/tournament/TournamentRegistration';
import TournamentTimer from '@/components/tournament/TournamentTimer';
import PrizeDistribution from '@/components/tournament/PrizeDistribution';
import { useGameStore } from '@/store/gameStore';

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tournaments, initialize } = useGameStore();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    initialize();
  }, [initialize]);

  const tournament = tournaments.find(t => t.id === id);

  useEffect(() => {
    if (!tournament) return;

    const calculateTimeLeft = () => {
      const targetDate = new Date(tournament.start_date).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [tournament]);

  if (!tournament) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Tournament not found</h1>
            <Button onClick={() => navigate('/tournaments')}>
              Back to Tournaments
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[500px] overflow-hidden">
          {tournament.banner ? (
            <img 
              src={tournament.banner} 
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50"></div>
          )}
          <div className="absolute inset-0 bg-black/50"></div>
          
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="p-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/tournaments')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tournaments
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-purple-500 text-white">
                  {tournament.game || 'battle-royale'}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={
                    tournament.status === 'upcoming' ? 'bg-blue-500 text-white' :
                    tournament.status === 'ongoing' ? 'bg-green-500 text-white' :
                    'bg-gray-500 text-white'
                  }
                >
                  {tournament.status.toUpperCase()}
                </Badge>
                {tournament.entry_fee && (
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    Entry: {tournament.entry_fee}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {tournament.name}
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    {tournament.current_participants}/{tournament.max_participants} Participants
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-sm">{tournament.region || 'Global'}</span>
                </div>
                <div className="flex items-center">
                  <Gamepad className="w-5 h-5 mr-2" />
                  <span className="text-sm">{tournament.format || 'Battle Royale'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Prize Pool Card */}
          <div className="absolute top-6 right-6">
            <Card className="bg-black/20 border-gray-600 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <p className="text-white text-sm mb-1">Prize Pool</p>
                <p className="text-yellow-400 text-2xl font-bold">{tournament.prize_pool}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tournament Countdown */}
        {tournament.status === 'upcoming' && (
          <div className="bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 mr-2 text-purple-400" />
                <h2 className="text-white text-lg">Tournament starts in</h2>
              </div>
              
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                  <div className="text-gray-400 text-sm">DAYS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
                  <div className="text-gray-400 text-sm">HOURS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
                  <div className="text-gray-400 text-sm">MINUTES</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
                  <div className="text-gray-400 text-sm">SECONDS</div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mt-2">
                Registration closes 1 hour before the tournament starts
              </p>
            </div>
          </div>
        )}

        {/* Tournament Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Tournament Timer */}
              <TournamentTimer tournament={tournament} />
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="prizes">Prizes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="register" className="mt-6">
                  <TournamentRegistrationComponent tournament={tournament} />
                </TabsContent>
                
                <TabsContent value="overview" className="mt-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">About the Tournament</h3>
                      <p className="text-gray-300 mb-6">
                        {tournament.description || 'Join the ultimate Free Fire tournament and compete against the best players from around the world! Show your skills, strategy, and teamwork to win the grand prize.'}
                      </p>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-gray-900 border-gray-600">
                          <CardContent className="p-4">
                            <h4 className="text-purple-400 font-semibold mb-2">Format</h4>
                            <p className="text-white">{tournament.format || 'Battle Royale'}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-600">
                          <CardContent className="p-4">
                            <h4 className="text-purple-400 font-semibold mb-2">Entry Fee</h4>
                            <p className="text-white">{tournament.entry_fee || '₹10'}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-600">
                          <CardContent className="p-4">
                            <h4 className="text-purple-400 font-semibold mb-2">Region</h4>
                            <p className="text-white">{tournament.region || 'Global'}</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-600">
                          <CardContent className="p-4">
                            <h4 className="text-purple-400 font-semibold mb-2">Organizer</h4>
                            <p className="text-white">{tournament.organizer || 'Battle Mitra Official'}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {tournament.highlights && (
                        <div>
                          <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                            Key Highlights
                          </h4>
                          <ul className="space-y-2">
                            {tournament.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-center text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="rules" className="mt-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Tournament Rules</h3>
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {tournament.rules || 'Tournament rules will be updated soon.'}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="schedule" className="mt-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Tournament Schedule</h3>
                      <div className="text-gray-300 whitespace-pre-wrap">
                        {tournament.schedule || 'Tournament schedule will be updated soon.'}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="prizes" className="mt-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <PrizeDistribution prizesContent={tournament.prizes_content} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Winners Announcement for Completed Tournaments */}
              {tournament.status === 'completed' && (tournament as any).winners && (
                <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-600/50 mt-6">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                      <Trophy className="w-6 h-6 mr-2" />
                      Tournament Winners
                    </h3>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {(tournament as any).winners}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-yellow-400" />
                    Tournament Format
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span className="text-white">{tournament.format || 'Battle Royale'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Fee:</span>
                      <span className="text-white">{tournament.entry_fee || '₹10'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Team Size:</span>
                      <span className="text-white">{tournament.team_size || 'Solo'}</span>
                    </div>
                    {tournament.start_time && tournament.end_time && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-white">{tournament.start_time} - {tournament.end_time}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-400" />
                    Timeline
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-blue-400 font-semibold">Registration Opens</p>
                      <p className="text-gray-300">
                        {tournament.registration_opens ? 
                          new Date(tournament.registration_opens).toLocaleDateString() : 
                          new Date(tournament.start_date).toLocaleDateString()
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-yellow-400 font-semibold">Registration Closes</p>
                      <p className="text-gray-300">
                        {tournament.registration_closes ? 
                          new Date(tournament.registration_closes).toLocaleDateString() : 
                          new Date(tournament.start_date).toLocaleDateString()
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-green-400 font-semibold">Tournament Starts</p>
                      <p className="text-gray-300">
                        {new Date(tournament.start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TournamentDetail;