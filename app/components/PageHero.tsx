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
  height = 'h-[40vh] min-h-[300px]',
  overlayOpacity = 'bg-black/40',
}: PageHeroProps) {
  return (
    <div className={`relative ${height} bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 flex items-center justify-center text-white overflow-hidden`}>
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div className="relative z-10 text-center px-6">
        {badge && (
          <span className="text-yellow-400 font-semibold tracking-wide uppercase text-sm mb-2 block">
            {badge}
          </span>
        )}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl max-w-2xl mx-auto text-blue-100">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
