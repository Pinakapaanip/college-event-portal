import { useEffect, useState } from 'react';

const slides = [
  { title: 'OJAS 2K26', src: 'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=1200&h=220&fit=crop' },
  { title: 'School of Law', src: 'https://images.unsplash.com/photo-1541339907198-e83de08ba9ad?w=1200&h=220&fit=crop' },
  { title: 'Indian Art Event', src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=220&fit=crop' },
  { title: 'Chanakya Campus', src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1200&h=220&fit=crop' },
  { title: 'Samyuti Celebration', src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&h=220&fit=crop' },
];

export default function CampusHighlightsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="portal-panel p-3 sm:p-4">
      <div className="portal-table-shell relative overflow-hidden rounded-[1.5rem]">
        <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {slides.map((slide, index) => (
            <article key={slide.title} className="min-w-full">
              <div className="relative h-[160px] overflow-hidden sm:h-[190px] lg:h-[220px]">
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  draggable="false"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,8,23,0.55),rgba(2,8,23,0.10)_55%,rgba(2,8,23,0.34)),linear-gradient(180deg,rgba(2,8,23,0.08),rgba(2,8,23,0.44))]" />
                <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(2,8,23,0.72))]" />
                <div className="absolute bottom-4 left-4 z-10">
                  <p className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
                    {slide.title}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/25 px-2 py-2 backdrop-blur-sm">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-[var(--portal-accent)]' : 'w-2.5 bg-white/40 hover:bg-white/65'}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}