"use client";

const GrainOverlay = () => {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          opacity: 0.6,
          mixBlendMode: "screen",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none z-0 dark:hidden"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
                       radial-gradient(circle at 70% 70%, rgba(250,250,250,0.2) 0%, transparent 50%)`,
          mixBlendMode: "overlay",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none z-0 hidden dark:block"
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(25,20,15,0.4) 0%, transparent 50%),
                       radial-gradient(circle at 70% 70%, rgba(20,15,10,0.3) 0%, transparent 50%)`,
          mixBlendMode: "multiply",
        }}
      />
    </>
  );
};

export default GrainOverlay;
