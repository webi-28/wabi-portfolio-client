// Lightweight CSS-only particles — zero external deps, never crashes
const Particles = () => {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    width:  Math.random() * 3 + 1,
    top:    Math.random() * 100,
    left:   Math.random() * 100,
    opacity:Math.random() * 0.25 + 0.05,
    duration: Math.random() * 20 + 15,
    delay:  Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map(d => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            width:  d.width,
            height: d.width,
            top:    `${d.top}%`,
            left:   `${d.left}%`,
            opacity: d.opacity,
            background: 'var(--primary, #2563EB)',
            animation: `float ${d.duration}s ease-in-out ${d.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
