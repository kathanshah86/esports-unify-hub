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

interface TournamentRegistrationProps {
  tournament: Tournament;
}

const TournamentRegistrationComponent: React.FC<TournamentRegistrationProps> = ({ tournament }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userRegistration, setUserRegistration] = useState<TournamentRegistration | null>(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [roomDetails, setRoomDetails] = useState<TournamentRoom | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
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

    setIsLoading(true);

    try {
      const registrationData = {
        tournament_id: tournament.id,
        player_name: userProfile.name || user.email || 'Unknown Player',
        player_game_id: userProfile.game_id || 'Unknown ID',
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
      {/* Registration Status Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            Tournament Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-white">Entry Fee: {tournament.entry_fee || 'Free'}</p>
              <p className="text-sm text-gray-400">
                {registrations.length} / {tournament.max_participants} participants
              </p>
            </div>
            {getRegistrationStatus()}
          </div>

          {!userRegistration ? (
            <Button 
              onClick={handleRegister} 
              disabled={isLoading || registrations.length >= tournament.max_participants}
              className="w-full"
            >
              {isLoading ? 'Registering...' : 
               registrations.length >= tournament.max_participants ? 'Tournament Full' :
               isFree ? 'Register Now' : `Register & Pay ${tournament.entry_fee}`}
              {!isFree && <CreditCard className="w-4 h-4 ml-2" />}
            </Button>
          ) : userRegistration.payment_status === 'pending' ? (
            <Button variant="outline" className="w-full">
              <Clock className="w-4 h-4 mr-2" />
              Payment Pending
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Room Details Card - Only show if registered and payment completed */}
      {userRegistration?.payment_status === 'completed' && roomDetails && (roomDetails.room_id || roomDetails.room_password) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="w-5 h-5" />
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roomDetails.room_id && (
              <div>
                <p className="text-sm font-medium text-gray-400">Room ID</p>
                <p className="font-mono text-lg text-white">{roomDetails.room_id}</p>
              </div>
            )}
            {roomDetails.room_password && (
              <div>
                <p className="text-sm font-medium text-gray-400">Password</p>
                <p className="font-mono text-lg text-white">{roomDetails.room_password}</p>
              </div>
            )}
            <p className="text-sm text-gray-400">
              Keep these details safe. You'll need them to join the tournament room.
            </p>
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
    </div>
  );
};

export default TournamentRegistrationComponent;