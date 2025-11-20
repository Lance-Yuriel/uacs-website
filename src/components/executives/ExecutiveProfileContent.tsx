import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Instagram } from 'lucide-react';
import { Executive } from '@/types/executive';
import { Badge } from '@/components/ui';

interface ExecutiveProfileContentProps {
  executive: Executive;
  variant?: 'modal' | 'preview';
  className?: string;
}

const ExecutiveProfileContent: React.FC<ExecutiveProfileContentProps> = ({
  executive,
  variant = 'modal',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [executive.image]);

  const initials = useMemo(() => {
    return executive.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [executive.name]);

  const socialLinks = useMemo(
    () => [
      { platform: 'Email', href: `mailto:${executive.email}`, icon: 'mail' },
      ...(executive.instagram
        ? [{ platform: 'Instagram', href: executive.instagram, icon: 'instagram' as const }]
        : []),
    ],
    [executive.email, executive.instagram]
  );

  const showPlaceholders = variant === 'preview';

  const bioLength = executive.bio?.length ?? 0;
  const bioIsCompact = bioLength < 80;
  const bioPaddingClass = bioIsCompact ? 'py-5' : 'py-3';
  const bioMinHeightStyle = bioIsCompact ? { minHeight: 78 } : undefined;

  const introLength = executive.introduction?.length ?? 0;
  const introIsCompact = introLength < 280;
  const introPaddingClass = introIsCompact ? 'py-5' : 'py-3';
  const introMinHeightStyle = !executive.introduction
    ? { minHeight: 56 }
    : introIsCompact
    ? { minHeight: 104 }
    : undefined;

  const responsibilitiesCount = executive.responsibilities?.length ?? 0;
  const responsibilitiesIsCompact = responsibilitiesCount <= 2;
  const responsibilitiesPaddingClass = responsibilitiesIsCompact ? 'py-5' : 'py-3';
  const responsibilitiesMinHeightStyle = responsibilitiesIsCompact ? { minHeight: 88 } : undefined;
  const responsibilitiesList = useMemo(() => {
    if (executive.responsibilities && executive.responsibilities.length > 0) {
      return executive.responsibilities;
    }
    return showPlaceholders ? ['Add responsibilities to preview them here.'] : [];
  }, [executive.responsibilities, showPlaceholders]);

  const educationHasContent = Boolean(executive.degree);
  const educationPaddingClass = educationHasContent ? 'py-3' : 'py-2.5';
  const educationPreview = educationHasContent
    ? executive.degree
    : showPlaceholders
    ? 'Add an education highlight to show it here.'
    : '';
  const favouriteSkillsHasContent = Boolean(executive.favouriteSkills && executive.favouriteSkills.length > 0);
  const favouriteSkillsPaddingClass =
    favouriteSkillsHasContent ? 'py-3' : 'py-2.5';
  const favouriteSkillsPreview = favouriteSkillsHasContent
    ? executive.favouriteSkills
    : showPlaceholders
    ? ['Skill One', 'Skill Two']
    : [];

  const headerImageSize = 'w-28 h-28 md:w-32 md:h-32';

  return (
    <div className={`flex flex-col gap-5 ${className}`} style={{ minHeight: 'fit-content' }}>
      <div className="flex items-start gap-5">
        <div className={`relative ${headerImageSize} flex-shrink-0`}>
          {executive.image && !imageError ? (
            <Image
              src={executive.image}
              alt={`${executive.name} - ${executive.position}`}
              fill
              className="rounded-full object-cover border-4 border-primary-400/50"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-white/60 bg-[#111111] flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-white font-display tracking-tight">{initials}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-1.5 mb-2.5">
            <h2 className="text-2xl md:text-[32px] font-extrabold text-white leading-tight font-display tracking-tight">{executive.name}</h2>
            <p className="text-base md:text-lg text-text-secondary font-medium leading-snug">
              {executive.position}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              {executive.isCoFounder && (
                <Badge variant="co-founder" size="sm">
                  Co-Founder
                </Badge>
              )}
              <Badge variant="co-founder" size="sm">
                {executive.title}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-primary-400 transition-colors p-1.5 rounded-lg hover:bg-primary-500/10"
                aria-label={`${executive.name}'s ${social.platform}`}
              >
                {social.icon === 'mail' ? <Mail className="h-5 w-5" /> : <Instagram className="h-5 w-5" />}
              </a>
            ))}
            <span className="px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] font-medium tracking-[0.18em] uppercase text-text-secondary">
              Joined {executive.joinedYear}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5 pb-1.5">
        <div className="flex flex-col flex-1 gap-3.5">
          <div className="border-t border-white/20">
            <div className={`flex flex-col justify-center ${bioPaddingClass}`} style={bioMinHeightStyle}>
              <h3 className="text-lg md:text-[20px] font-semibold text-white mb-1.5 font-display tracking-tight">Bio</h3>
              <p className="text-[15px] md:text-[16px] text-text-secondary leading-normal">
                {executive.bio || (showPlaceholders ? 'Add a short bio to preview it here.' : '')}
              </p>
            </div>
          </div>

          <div className="border-t border-white/20">
            <div
              className={`flex flex-col justify-center ${introPaddingClass}`}
              style={introMinHeightStyle}
            >
              <h3 className="text-lg md:text-[20px] font-semibold text-white mb-1.5 font-display tracking-tight">Introduction</h3>
              <p className="text-[15px] md:text-[16px] text-text-secondary leading-relaxed">
                {executive.introduction || (showPlaceholders ? 'Write an introduction to see how it will appear.' : '')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 mt-auto">
          <div className="border-t border-white/20">
            <div
              className={`flex flex-col justify-center ${responsibilitiesPaddingClass}`}
              style={responsibilitiesMinHeightStyle}
            >
              <h3 className="text-lg md:text-[20px] font-semibold text-white mb-1.5 font-display tracking-tight">Key Responsibilities</h3>
              {responsibilitiesList.length > 0 && (
                <ul className="space-y-1.5">
                  {responsibilitiesList.map((responsibility, index) => (
                    <li key={`${responsibility}-${index}`} className="text-[15px] md:text-[16px] text-text-secondary flex items-start">
                      <span className="leading-relaxed">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="border-t border-white/20">
            <div className={`flex flex-col justify-center ${educationPaddingClass}`}>
              <h3 className="text-lg md:text-[20px] font-semibold text-white mb-1.5 font-display tracking-tight">Education</h3>
              {educationPreview ? (
                <p className="text-[15px] md:text-[16px] text-text-secondary leading-normal">
                  {educationPreview}
                </p>
              ) : null}
            </div>
          </div>

          <div className="border-t border-white/20">
            <div className={`flex flex-col justify-center ${favouriteSkillsPaddingClass}`}>
              <h3 className="text-lg md:text-[20px] font-semibold text-white mb-1.5 font-display tracking-tight">Favourite Skills</h3>
              {favouriteSkillsPreview && favouriteSkillsPreview.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {favouriteSkillsPreview.slice(0, 3).map((skill, index) => (
                    <Badge key={`${skill}-${index}`} variant="co-founder" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveProfileContent;
