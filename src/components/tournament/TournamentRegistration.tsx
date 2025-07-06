import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { tournamentRegistrationService, TournamentRegistration, TournamentRoom } from '@/services/tournamentRegistrationService';
import { supabase } from '@/integrations/supabase/client';
import { Tournament } from '@/types';
import { Users, Lock, Key, CreditCard, CheckCircle, Clock } from 'lucide-react';
import GameIdInputDialog from './GameIdInputDialog';
import TournamentTimer from './TournamentTimer';

interface TournamentRegistrationProps {
  tournament: Tournament;
}

const TournamentRegistrationComponent: React.FC<TournamentRegistrationProps> = ({ tournament }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRegistration, setUserRegistration] = useState<TournamentRegistration | null>(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [roomDetails, setRoomDetails] = useState<TournamentRoom | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showGameIdDialog, setShowGameIdDialog] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const isFree = !tournament.entry_fee || tournament.entry_fee === 'Free' || tournament.entry_fee === '0';

  useEffect(() => {
    if (user) {
      loadUserData();
      loadRegistrations();
    }
  }, [user, tournament.id]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setUserProfile(profile);

      // Check if user is already registered
      const registration = await tournamentRegistrationService.checkUserRegistration(user.id, tournament.id);
      setUserRegistration(registration);

      // If registered and payment completed, load room details
      if (registration && registration.payment_status === 'completed') {
        const room = await tournamentRegistrationService.getTournamentRoom(tournament.id);
        setRoomDetails(room);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadRegistrations = async () => {
    try {
      const regs = await tournamentRegistrationService.getTournamentRegistrations(tournament.id);
      setRegistrations(regs);
    } catch (error) {
      console.error('Error loading registrations:', error);
    }
  };

  const handleRegister = async () => {
    if (!user || !userProfile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile first.",
        variant: "destructive"
      });
      return;
    }

    // Show game ID input dialog
    setShowGameIdDialog(true);
  };

  const handleGameIdSubmit = async (gameId: string) => {
    setIsLoading(true);
    setShowGameIdDialog(false);

    try {
      const registrationData = {
        tournament_id: tournament.id,
        player_name: userProfile.name || user.email || 'Unknown Player',
        player_game_id: gameId,
        payment_amount: isFree ? 0 : parseInt(tournament.entry_fee?.replace(/[^0-9]/g, '') || '0')
      };

      const registration = await tournamentRegistrationService.registerForTournament(registrationData);
      
      setUserRegistration(registration);
      
      if (isFree) {
        toast({
          title: "Registration Successful!",
          description: "You've been registered for the tournament.",
        });
        loadRegistrations();
        loadUserData(); // Reload to get room details
      } else {
        toast({
          title: "Registration Created",
          description: "Please complete payment to confirm your registration.",
          variant: "default"
        });
      }

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for tournament",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRegistrationStatus = () => {
    if (!userRegistration) return null;
    
    switch (userRegistration.payment_status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Registered</Badge>;
      case 'pending':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Payment Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Payment Failed</Badge>;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-300">Please log in to register for this tournament.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tournament Timer */}
      {tournament.timer_duration && tournament.timer_duration > 0 && (
        <TournamentTimer
          tournament={tournament}
        />
      )}

      {/* Registration Status Card */}
      <Card className="bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-indigo-900/40 border-purple-500/30 backdrop-blur-sm shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-white text-xl drop-shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            Tournament Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/20">
            <div className="space-y-1">
              <p className="font-bold text-white text-lg drop-shadow-sm">Entry Fee: {tournament.entry_fee || 'Free'}</p>
              <p className="text-sm text-purple-200 font-medium">
                {registrations.length} / {tournament.max_participants} participants
              </p>
            </div>
            {getRegistrationStatus()}
          </div>

          {!userRegistration ? (
            <Button 
              onClick={handleRegister} 
              disabled={isLoading || registrations.length >= tournament.max_participants}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-3 text-lg shadow-xl"
            >
              {isLoading ? 'Registering...' : 
               registrations.length >= tournament.max_participants ? 'Tournament Full' :
               isFree ? 'Register Now' : `Register & Pay ${tournament.entry_fee}`}
              {!isFree && <CreditCard className="w-5 h-5 ml-2 drop-shadow-sm" />}
            </Button>
          ) : userRegistration.payment_status === 'pending' ? (
            <Button variant="outline" className="w-full border-yellow-400/50 text-yellow-200 bg-yellow-500/10 hover:bg-yellow-500/20 font-bold py-3">
              <Clock className="w-4 h-4 mr-2" />
              Payment Pending
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Room Details Card - Only show if registered and payment completed */}
      {userRegistration?.payment_status === 'completed' && roomDetails && (roomDetails.room_id || roomDetails.room_password) && (
        <Card className="bg-gradient-to-br from-green-900/40 via-emerald-900/30 to-teal-900/40 border-green-500/30 backdrop-blur-sm shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-white text-xl drop-shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Lock className="w-5 h-5 text-white drop-shadow-sm" />
              </div>
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {roomDetails.room_id && (
              <div className="p-4 bg-black/20 rounded-lg border border-green-500/20">
                <p className="text-sm font-bold text-green-200 mb-2">Room ID</p>
                <p className="font-mono text-xl text-white font-bold drop-shadow-sm">{roomDetails.room_id}</p>
              </div>
            )}
            {roomDetails.room_password && (
              <div className="p-4 bg-black/20 rounded-lg border border-emerald-500/20">
                <p className="text-sm font-bold text-emerald-200 mb-2">Password</p>
                <p className="font-mono text-xl text-white font-bold drop-shadow-sm">{roomDetails.room_password}</p>
              </div>
            )}
            <div className="p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
              <p className="text-sm text-yellow-200 font-medium drop-shadow-sm">
                ⚠️ Keep these details safe. You'll need them to join the tournament room.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registered Players Card */}
      {registrations.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              Registered Players ({registrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {registrations.map((reg, index) => (
                <div key={reg.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-white">{reg.player_name}</p>
                      <p className="text-sm text-gray-400">Game ID: {reg.player_game_id}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Confirmed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game ID Input Dialog */}
      <GameIdInputDialog
        open={showGameIdDialog}
        onOpenChange={setShowGameIdDialog}
        onSubmit={handleGameIdSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TournamentRegistrationComponent;