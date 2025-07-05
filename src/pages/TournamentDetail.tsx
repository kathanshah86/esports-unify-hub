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
                  <div className="space-y-6">
                    {/* Hero Description */}
                    <Card className="bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-indigo-900/50 border-purple-500/30 backdrop-blur-sm overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
                      <CardContent className="relative p-8">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                            <Gamepad className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white">About the Tournament</h3>
                        </div>
                        <p className="text-gray-200 text-lg leading-relaxed">
                          {tournament.description || 'Join the ultimate Free Fire tournament and compete against the best players from around the world! Show your skills, strategy, and teamwork to win the grand prize.'}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Tournament Details Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Gamepad className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-blue-400 font-semibold mb-2 text-sm uppercase tracking-wide">Format</h4>
                          <p className="text-white font-bold text-lg">{tournament.format || 'Battle Royale'}</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-400/30 hover:border-green-400/50 transition-all duration-300 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trophy className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-green-400 font-semibold mb-2 text-sm uppercase tracking-wide">Entry Fee</h4>
                          <p className="text-white font-bold text-lg">{tournament.entry_fee || '₹10'}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-orange-400 font-semibold mb-2 text-sm uppercase tracking-wide">Region</h4>
                          <p className="text-white font-bold text-lg">{tournament.region || 'Global'}</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-purple-400 font-semibold mb-2 text-sm uppercase tracking-wide">Organizer</h4>
                          <p className="text-white font-bold text-lg">{tournament.organizer || 'Battle Mitra Official'}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Key Highlights */}
                    {tournament.highlights && (
                      <Card className="bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-red-600/20 border-yellow-400/30 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                              <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold text-white">Key Highlights</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            {tournament.highlights.map((highlight, index) => (
                              <div key={index} className="flex items-center p-4 bg-black/20 rounded-lg border-l-4 border-yellow-400">
                                <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mr-4 flex-shrink-0"></div>
                                <span className="text-gray-200 font-medium">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="rules" className="mt-6">
                  <Card className="bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/30 border-red-500/30 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5" />
                    <CardContent className="relative p-8">
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">Tournament Rules</h3>
                          <p className="text-gray-300">Important guidelines for all participants</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-xl p-8 border border-red-500/20">
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
                            {tournament.rules || `📋 Tournament Rules

🎯 General Guidelines:
• All participants must follow fair play rules
• No cheating, hacking, or exploiting allowed
• Respect all players and organizers
• Use only approved devices and software

⏰ Match Rules:
• Be present 15 minutes before match time
• Late arrivals may result in disqualification
• Match settings will be announced beforehand
• Screenshots required for dispute resolution

🏆 Prize Distribution:
• Winners will be announced after verification
• Prize money will be distributed within 7 days
• Valid ID proof required for prize claim
• Organizers' decision is final in all disputes

📱 Communication:
• Join our official Discord/WhatsApp group
• Check announcements regularly
• Contact support for any queries

⚠️ Violations may lead to immediate disqualification.`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="schedule" className="mt-6">
                  <Card className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-blue-900/30 border-indigo-500/30 backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-blue-600/5" />
                    <CardContent className="relative p-8">
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-6 shadow-lg">
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2">Tournament Schedule</h3>
                          <p className="text-gray-300">Complete timeline and match schedule</p>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-xl p-8 border border-indigo-500/20">
                        <div className="space-y-6">
                          {tournament.schedule ? (
                            <div className="text-gray-200 text-lg leading-relaxed whitespace-pre-line">
                              {tournament.schedule}
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-600/20 to-blue-600/20 rounded-lg border-l-4 border-indigo-400">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-indigo-300 font-semibold text-lg mb-2">Registration Phase</h4>
                                  <p className="text-gray-300">Open registration for all participants</p>
                                  <span className="text-sm text-indigo-400">{new Date(tournament.start_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border-l-4 border-purple-400">
                                <div className="w-3 h-3 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-purple-300 font-semibold text-lg mb-2">Qualification Rounds</h4>
                                  <p className="text-gray-300">Initial screening and team formation</p>
                                  <span className="text-sm text-purple-400">Day 1-2</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg border-l-4 border-blue-400">
                                <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-blue-300 font-semibold text-lg mb-2">Semi-Finals</h4>
                                  <p className="text-gray-300">Top teams compete for final spots</p>
                                  <span className="text-sm text-blue-400">Day 3</span>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg border-l-4 border-yellow-400">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="text-yellow-300 font-semibold text-lg mb-2">Grand Finals</h4>
                                  <p className="text-gray-300">Ultimate showdown for the championship</p>
                                  <span className="text-sm text-yellow-400">{new Date(tournament.end_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="prizes" className="mt-6">
                  <div className="space-y-6">
                    <PrizeDistribution prizesContent={tournament.prizes_content} />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Winners Announcement for Completed Tournaments */}
              {(tournament.status === 'completed' || tournament.status === 'ongoing') && (tournament as any)?.winners && (
                <div className="mt-8">
                  {/* Celebration Banner */}
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-1 rounded-xl mb-6 shadow-2xl">
                    <Card className="bg-gray-900 border-0 rounded-lg overflow-hidden">
                      <CardContent className="p-0">
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-red-500/30 p-8 text-center relative overflow-hidden">
                          {/* Animated background elements */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(45,100%,70%,0.1)_0%,_transparent_50%)]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(25,100%,60%,0.1)_0%,_transparent_50%)]" />
                          
                          <div className="relative z-10">
                            {/* Trophy Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-xl animate-bounce">
                              <Trophy className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                            
                            {/* Title */}
                            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                              🏆 TOURNAMENT CHAMPIONS 🏆
                            </h2>
                            
                            {/* Subtitle */}
                            <p className="text-xl text-yellow-200 font-semibold mb-2">
                              {tournament.name}
                            </p>
                            
                            {/* Decorative line */}
                            <div className="flex justify-center mb-4">
                              <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full shadow-lg" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Winners Content */}
                        <div className="p-8 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                          <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-xl p-6 border-2 border-yellow-400/40 shadow-inner">
                            <div className="text-center mb-6">
                              <h3 className="text-2xl font-bold text-yellow-300 mb-2">🥇 Winners List 🥇</h3>
                            </div>
                            
                            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/50 shadow-lg">
                              <div className="text-white text-xl leading-loose whitespace-pre-wrap font-semibold text-center">
                                {(tournament as any).winners}
                              </div>
                            </div>
                            
                            {/* Celebration Footer */}
                            <div className="text-center mt-8 space-y-2">
                              <p className="text-2xl font-bold text-yellow-300">
                                🎉 CONGRATULATIONS! 🎉
                              </p>
                              <p className="text-lg text-orange-200 font-medium">
                                Amazing performance by our champions!
                              </p>
                              <div className="flex justify-center space-x-4 mt-4 text-2xl">
                                <span>🏆</span>
                                <span>🥇</span>
                                <span>🎊</span>
                                <span>🔥</span>
                                <span>⭐</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Debug Info - Remove after testing */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-800 rounded text-white text-sm">
                  <p>Debug Info:</p>
                  <p>Status: {tournament.status}</p>
                  <p>Winners: {(tournament as any)?.winners || 'No winners data'}</p>
                  <p>Show winners: {((tournament.status === 'completed' || tournament.status === 'ongoing') && (tournament as any)?.winners) ? 'YES' : 'NO'}</p>
                </div>
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