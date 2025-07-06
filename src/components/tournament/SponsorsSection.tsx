import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Globe, ExternalLink, Users, Trophy, Target, Sparkles } from 'lucide-react';
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
    <section className={`py-20 relative overflow-hidden bg-gradient-to-b from-gray-900/50 to-black/50 ${className}`}>
      {/* Modern Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Our Sponsors
            </span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Powered by industry leaders who believe in the future of esports and competitive gaming
          </p>
        </div>

        {/* Modern Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sponsors.map((sponsor, index) => (
            <div key={sponsor.id} className="group relative">
              {/* Modern Card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-40 flex flex-col items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center">
                  {/* Sponsor Logo */}
                  <div className="flex items-center justify-center mb-3">
                    {sponsor.logo ? (
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name}
                        className="max-h-12 w-auto object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-white/80" />
                      </div>
                    )}
                  </div>
                  
                  {/* Sponsor Details - Centered */}
                  <div className="text-center space-y-2">
                    {/* Brand Name - Always shown once, centered and bold */}
                    <h4 className="text-white/90 font-semibold text-sm tracking-wide">{sponsor.name}</h4>
                    
                    {/* Description */}
                    {sponsor.description && (
                      <p className="text-white/70 text-xs leading-tight">
                        {sponsor.description.length > 30 
                          ? `${sponsor.description.substring(0, 30)}...` 
                          : sponsor.description}
                      </p>
                    )}
                    
                    {/* Website Link */}
                    {sponsor.website && (
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-white/60 hover:text-white text-xs transition-colors duration-200 group-hover:scale-105 transform mt-2"
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        Visit
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                  
                  {/* Premium Badge for first few sponsors */}
                  {index < 2 && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 font-bold shadow-lg border-0">
                        ⭐ Premium
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Interested in Sponsoring?</h3>
            <p className="text-gray-400 mb-6">
              Join our growing list of sponsors and reach thousands of passionate gamers in the esports community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center text-gray-300">
                <Users className="w-4 h-4 mr-2 text-blue-400" />
                10K+ Active Players
              </div>
              <div className="flex items-center text-gray-300">
                <Trophy className="w-4 h-4 mr-2 text-purple-400" />
                50+ Tournaments
              </div>
              <div className="flex items-center text-gray-300">
                <Target className="w-4 h-4 mr-2 text-green-400" />
                Global Reach
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;