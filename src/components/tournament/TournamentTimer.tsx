import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Tournament } from '@/types';

interface TournamentTimerProps {
  tournament: Tournament;
}

const TournamentTimer: React.FC<TournamentTimerProps> = ({ tournament }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const checkTimer = () => {
      if (!tournament.timer_duration || !tournament.timer_start_time) {
        setIsActive(false);
        return;
      }

      const startTime = new Date(tournament.timer_start_time).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = tournament.timer_duration - elapsed;

      if (remaining > 0 && tournament.timer_is_running) {
        setTimeLeft(remaining);
        setIsActive(true);
      } else {
        setTimeLeft(0);
        setIsActive(false);
      }
    };

    checkTimer();

    if (isActive) {
      interval = setInterval(checkTimer, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tournament, isActive]);

  if (!isActive || timeLeft <= 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-red-900/20 border-red-600/50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-3">
          <Clock className="w-6 h-6 text-red-400 animate-pulse" />
          <div className="text-center">
            <p className="text-red-300 text-sm font-medium">Tournament Timer</p>
            <p className="text-red-100 text-2xl font-bold font-mono">{formatTime(timeLeft)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentTimer;