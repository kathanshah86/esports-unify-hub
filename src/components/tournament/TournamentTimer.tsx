import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Play, Pause, Square } from 'lucide-react';

interface TournamentTimerProps {
  tournamentId: string;
  initialTime?: number; // in seconds
  isRunning?: boolean;
  onTimerUpdate?: (timeLeft: number, isRunning: boolean) => void;
}

const TournamentTimer: React.FC<TournamentTimerProps> = ({
  tournamentId,
  initialTime = 0,
  isRunning = false,
  onTimerUpdate
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [running, setRunning] = useState(isRunning);

  useEffect(() => {
    setTimeLeft(initialTime);
    setRunning(isRunning);
  }, [initialTime, isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setRunning(false);
            onTimerUpdate?.(0, false);
            return 0;
          }
          onTimerUpdate?.(newTime, true);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [running, timeLeft, onTimerUpdate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 0) return 'text-red-400';
    if (timeLeft <= 300) return 'text-yellow-400'; // Last 5 minutes
    if (timeLeft <= 600) return 'text-orange-400'; // Last 10 minutes
    return 'text-green-400';
  };

  const getTimerStatus = () => {
    if (timeLeft <= 0) return 'Time\'s Up!';
    if (running) return 'Tournament in Progress';
    return 'Tournament Timer';
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <Clock className={`w-6 h-6 mr-2 ${getTimerColor()}`} />
          <h3 className="text-lg font-semibold text-white">{getTimerStatus()}</h3>
        </div>
        
        <div className={`text-4xl font-mono font-bold mb-4 ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>

        {timeLeft > 0 && (
          <div className="flex items-center justify-center gap-2">
            {running ? (
              <div className="flex items-center gap-2 text-green-400">
                <Play className="w-4 h-4" />
                <span className="text-sm">Timer Running</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Pause className="w-4 h-4" />
                <span className="text-sm">Timer Paused</span>
              </div>
            )}
          </div>
        )}

        {timeLeft <= 0 && (
          <div className="flex items-center justify-center gap-2 text-red-400">
            <Square className="w-4 h-4" />
            <span className="text-sm">Tournament Ended</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentTimer;