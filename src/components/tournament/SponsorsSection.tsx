import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Globe, Star, Sparkles, ExternalLink, Users, Trophy, Target } from 'lucide-react';
import { sponsorService, Sponsor } from '@/services/sponsorService';

interface SponsorsSectionProps {
  className?: string;
}

const SponsorsSection: React.FC<SponsorsSectionProps> = ({ className = "" }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const sponsorsData = await sponsorService.getSponsors();
        setSponsors(sponsorsData);
      } catch (error) {
        console.error('Failed to load sponsors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSponsors();
  }, []);

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (sponsors.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 relative overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Our Sponsors
            </span>
          </h2>
          
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mx-auto rounded-full shadow-lg mb-6"></div>
          
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Powered by industry leaders who believe in the future of esports and competitive gaming
          </p>
          
          <Badge variant="secondary" className="mt-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30 text-purple-200 px-4 py-2">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Official Partners
          </Badge>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sponsors.map((sponsor, index) => {
            const gradients = [
              "from-purple-500/30 via-purple-400/20 to-blue-500/30",
              "from-blue-500/30 via-cyan-400/20 to-teal-500/30", 
              "from-green-500/30 via-emerald-400/20 to-cyan-500/30",
              "from-yellow-500/30 via-orange-400/20 to-red-500/30",
              "from-pink-500/30 via-rose-400/20 to-purple-500/30",
              "from-indigo-500/30 via-blue-400/20 to-purple-500/30"
            ];
            
            const borderColors = [
              "border-purple-400/70 shadow-purple-500/30",
              "border-blue-400/70 shadow-blue-500/30",
              "border-green-400/70 shadow-green-500/30", 
              "border-orange-400/70 shadow-orange-500/30",
              "border-pink-400/70 shadow-pink-500/30",
              "border-indigo-400/70 shadow-indigo-500/30"
            ];

            const gradient = gradients[index % gradients.length];
            const borderColor = borderColors[index % borderColors.length];

            return (
              <div key={sponsor.id} className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-br opacity-75 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                     style={{
                       background: `linear-gradient(135deg, ${gradient.split(' ')[0].replace('from-', '').replace('/30', '/20')}, ${gradient.split(' ')[2].replace('to-', '').replace('/30', '/20')})`
                     }} />
                
                <Card className={`bg-gradient-to-br ${gradient} border-2 ${borderColor} backdrop-blur-sm relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl h-40`}>
                  {/* Dark overlay for better text contrast */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl" />
                  
                  <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
                    {/* Floating decorative elements */}
                    <div className="absolute top-3 right-3 w-6 h-6 bg-white/10 rounded-full animate-pulse" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 bg-white/5 rounded-full animate-pulse delay-500" />
                    
                    {/* Sponsor Logo/Name */}
                    <div className="flex items-center justify-center flex-1">
                      {sponsor.logo ? (
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name}
                          className="max-h-14 w-auto object-contain filter drop-shadow-2xl shadow-black/50 transform group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-14 h-14 bg-gradient-to-br from-white/25 to-white/15 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                            <Building className="w-7 h-7 text-white drop-shadow-lg" />
                          </div>
                          <div className="font-bold text-white text-base drop-shadow-lg">{sponsor.name}</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Sponsor Details */}
                    <div className="text-center">
                      <h4 className="text-white font-bold text-base mb-1 drop-shadow-lg text-shadow-lg">{sponsor.name}</h4>
                      
                      {sponsor.description && (
                        <p className="text-white text-xs leading-tight mb-2 font-semibold drop-shadow-md">
                          {sponsor.description.length > 35 
                            ? `${sponsor.description.substring(0, 35)}...` 
                            : sponsor.description}
                        </p>
                      )}
                      
                      {/* Website Link */}
                      {sponsor.website && (
                        <a 
                          href={sponsor.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-white hover:text-white/90 text-xs font-bold transition-colors duration-200 group-hover:scale-105 transform drop-shadow-lg"
                        >
                          <Globe className="w-3 h-3 mr-1 drop-shadow-md" />
                          Visit
                          <ExternalLink className="w-3 h-3 ml-1 drop-shadow-md" />
                        </a>
                      )}
                    </div>
                    
                    {/* Premium Badge for certain sponsors */}
                    {index < 2 && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 font-bold shadow-lg">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Premium
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30 border border-purple-500/30 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Interested in Sponsoring?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join our growing list of sponsors and reach thousands of passionate gamers in the esports community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Badge variant="outline" className="border-purple-400/50 text-purple-300 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                10K+ Active Players
              </Badge>
              <Badge variant="outline" className="border-blue-400/50 text-blue-300 px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                50+ Tournaments
              </Badge>
              <Badge variant="outline" className="border-green-400/50 text-green-300 px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Global Reach
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;