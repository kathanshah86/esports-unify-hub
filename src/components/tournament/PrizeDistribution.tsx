import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { PrizesContent } from '@/types';

interface PrizeDistributionProps {
  prizesContent?: PrizesContent;
  isPreview?: boolean;
}

const PrizeDistribution: React.FC<PrizeDistributionProps> = ({ 
  prizesContent, 
  isPreview = false 
}) => {
  // Default prize structure if no content provided
  const defaultPrizes = {
    positions: [
      {
        position: 1,
        title: "1st Place",
        amount: "₹6000",
        description: "60% of Prize Pool + Champion Trophy",
        color: "from-yellow-400 to-yellow-600"
      },
      {
        position: 2,
        title: "2nd Place", 
        amount: "₹3000",
        description: "30% of Prize Pool + Silver Medal",
        color: "from-gray-300 to-gray-500"
      },
      {
        position: 3,
        title: "3rd Place",
        amount: "₹1000", 
        description: "10% of Prize Pool + Bronze Medal",
        color: "from-orange-400 to-orange-600"
      }
    ],
    additional_rewards: [
      {
        title: "MVP Award",
        description: "Special recognition and in-game cosmetic items for the Most Valuable Player."
      },
      {
        title: "Participation Rewards",
        description: "All participants receive exclusive in-game items and Battle Mitra profile badges."
      }
    ]
  };

  const prizes = prizesContent || defaultPrizes;

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Award className="w-8 h-8 text-orange-400" />;
      default:
        return <Trophy className="w-8 h-8 text-purple-400" />;
    }
  };

  const getPositionColors = (position: number) => {
    switch (position) {
      case 1:
        return {
          bg: "from-yellow-500/20 to-yellow-600/20",
          border: "border-yellow-500/50",
          text: "text-yellow-400",
          number: "bg-yellow-500"
        };
      case 2:
        return {
          bg: "from-gray-400/20 to-gray-500/20", 
          border: "border-gray-400/50",
          text: "text-gray-300",
          number: "bg-gray-500"
        };
      case 3:
        return {
          bg: "from-orange-400/20 to-orange-500/20",
          border: "border-orange-400/50", 
          text: "text-orange-400",
          number: "bg-orange-500"
        };
      default:
        return {
          bg: "from-purple-400/20 to-purple-500/20",
          border: "border-purple-400/50",
          text: "text-purple-400", 
          number: "bg-purple-500"
        };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Prize Distribution</h3>
        
        {/* Prize Position Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {prizes.positions.slice(0, 3).map((prize, index) => {
            const colors = getPositionColors(prize.position);
            return (
              <Card 
                key={index}
                className={`bg-gradient-to-br ${colors.bg} ${colors.border} border backdrop-blur-sm relative overflow-hidden`}
              >
                <CardContent className="p-6 text-center relative">
                  {/* Position number circle */}
                  <div className={`w-12 h-12 ${colors.number} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white font-bold text-xl">{prize.position}</span>
                  </div>
                  
                  {/* Prize icon */}
                  <div className="mb-4">
                    {getPositionIcon(prize.position)}
                  </div>
                  
                  {/* Prize title */}
                  <h4 className={`text-xl font-bold ${colors.text} mb-2`}>
                    {prize.title}
                  </h4>
                  
                  {/* Prize amount */}
                  <div className="text-3xl font-bold text-white mb-3">
                    {prize.amount}
                  </div>
                  
                  {/* Prize description */}
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {prize.description}
                  </p>
                  
                  {/* Decorative background element */}
                  <div className={`absolute -top-4 -right-4 w-24 h-24 ${colors.number} rounded-full opacity-10`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional positions if any */}
        {prizes.positions.length > 3 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {prizes.positions.slice(3).map((prize, index) => {
              const colors = getPositionColors(prize.position);
              return (
                <Card key={index + 3} className={`bg-gradient-to-br ${colors.bg} ${colors.border} border`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${colors.number} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">{prize.position}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-semibold ${colors.text}`}>{prize.title}</h5>
                        <p className="text-white font-bold">{prize.amount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Additional Rewards */}
      {prizes.additional_rewards && prizes.additional_rewards.length > 0 && (
        <div>
          <h4 className="text-xl font-bold text-white mb-4">Additional Rewards</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {prizes.additional_rewards.map((reward, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h5 className="text-lg font-semibold text-white mb-2">{reward.title}</h5>
                  <p className="text-gray-300 text-sm leading-relaxed">{reward.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrizeDistribution;