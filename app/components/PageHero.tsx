import Image from 'next/image';

interface PageHeroProps {
  image: string;
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  height?: string;
  overlayOpacity?: string;
}

export default function PageHero({
  image,
  badge,
  title,
  subtitle,
  height = 'h-[50vh] min-h-[380px]',
  overlayOpacity = 'bg-gradient-to-b from-brand-950/70 via-brand-950/65 to-brand-950/90',
}: PageHeroProps) {
  return (
    <div className={`relative ${height} flex items-center justify-center text-white overflow-hidden wave-bottom`}>
      <Image
        src={image}
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      <div className={`absolute inset-0 ${overlayOpacity}`} />

      {/* Decorative side line */}
      <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-20">
        <span className="w-px h-16 bg-white/20" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="w-px h-16 bg-white/20" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {badge && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 text-xs font-semibold tracking-[0.15em] uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/15">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            {badge}
          </div>
        )}
        <h1 className="font-display font-light text-5xl md:text-6xl lg:text-7xl mb-5 leading-tight">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className="w-12 h-px bg-accent/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="w-12 h-px bg-accent/50" />
        </div>
        {subtitle && (
          <p className="font-sans text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
