import React from "react";

const ProfessionalWeatherBackground = ({ condition = 'Default', isDay = true }) => {
    // Determine gradient colors and effects based on weather condition
    const getWeatherTheme = () => {
        switch (condition) {
            case 'Clear':
                return {
                    gradient: { top: isDay ? '#60a5fa' : '#1e3a8a', bottom: isDay ? '#0284c7' : '#4c1d95' },
                    particles: 'stars',
                    particleColor: isDay ? '#fef3c7' : '#f8fafc',
                    effect: 'aurora',
                };
            case 'Clouds':
            case 'Rain':
            case 'Drizzle':
                return {
                    gradient: { top: isDay ? '#4b5563' : '#374151', bottom: isDay ? '#9ca3af' : '#6b7280' },
                    particles: 'clouds',
                    particleColor: '#d1d5db',
                    effect: 'clouds',
                };
            case 'Thunderstorm':
                return {
                    gradient: { top: '#1e293b', bottom: '#0f172a' },
                    particles: 'stars',
                    particleColor: '#fef3c7',
                    effect: 'lightning',
                };
            case 'Snow':
                return {
                    gradient: { top: '#e0f2fe', bottom: '#bfdbfe' },
                    particles: 'snow',
                    particleColor: '#f0f8ff',
                    effect: 'snow',
                };
            case 'Mist':
            case 'Fog':
                return {
                    gradient: { top: '#d1d5db', bottom: '#9ca3af' },
                    particles: 'clouds',
                    particleColor: '#e5e7eb',
                    effect: 'clouds',
                };
            default:
                return {
                    gradient: { top: '#1e40af', bottom: '#6b21a8' },
                    particles: 'stars',
                    particleColor: '#f8fafc',
                    effect: 'aurora',
                };
        }
    };

    const theme = getWeatherTheme();

    return (
        <svg
            className="absolute inset-0 w-full h-full z-[-1]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 800 600"
        >
            <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={theme.gradient.top} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={theme.gradient.bottom} stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="cloudGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background Gradient */}
            <rect width="800" height="600" fill="url(#skyGradient)" />

            {/* Particles (Stars, Clouds, Snow) */}
            {[...Array(12)].map((_, i) => {
                const cx = (i * 800) / 12 + Math.random() * 100 - 50;
                const cy = Math.random() * 200 + 50; // keep clouds higher in the sky

                if (theme.particles === "clouds") {
                    return (
                        <g
                            key={`cloud-${i}`}
                            style={{
                                animation: `drift ${30 + Math.random() * 20}s linear infinite`,
                                animationDelay: `${Math.random() * -20}s`,
                            }}
                        >
                            {/* Wrapper holds animation */}
                            <g
                                transform={`translate(${cx}, ${cy}) scale(${0.6 + Math.random() * 1})`}
                                opacity={0.3 + Math.random() * 0.4}
                            >
                                <circle cx="-25" cy="0" r="25" fill={theme.particleColor} filter="url(#cloudGlow)" />
                                <circle cx="0" cy="-10" r="30" fill={theme.particleColor} filter="url(#cloudGlow)" />
                                <circle cx="25" cy="0" r="25" fill={theme.particleColor} filter="url(#cloudGlow)" />
                                <circle cx="-10" cy="10" r="20" fill={theme.particleColor} filter="url(#cloudGlow)" />
                                <circle cx="15" cy="12" r="18" fill={theme.particleColor} filter="url(#cloudGlow)" />
                            </g>
                        </g>
                    );
                }
                return null;
            })}


            {/* Weather-Specific Effects */}
            {theme.effect === 'aurora' && (
                <path
                    d="M0,550 Q200,450 400,550 T800,550 L800,600 L0,600 Z"
                    fill="rgba(96,165,250,0.3)"
                    opacity={0.5}
                    filter="url(#glow)"
                    style={{
                        animation: `aurora 10s ease-in-out infinite alternate`,
                    }}
                />
            )}
            {theme.effect === 'lightning' && (
                <path
                    d={`M${Math.random() * 160 + 320},120 L${Math.random() * 40 + 340},200 L${Math.random() * 40 + 320},280 L${Math.random() * 40 + 360},360`}
                    stroke="#fef3c7"
                    strokeWidth="2"
                    fill="none"
                    opacity={0.5}
                    style={{
                        animation: `lightning ${2 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            )}
            {theme.effect === 'snow' && (
                <circle
                    cx={Math.random() * 800}
                    cy={Math.random() * 600}
                    r="2"
                    fill={theme.particleColor}
                    opacity="0.8"
                    style={{
                        animation: `snowfall ${3 + Math.random() * 2}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            )}

            <style>{`
                @keyframes twinkle {
                    0% { opacity: 0.3; transform: scale(0.8); }
                    100% { opacity: 0.9; transform: scale(1); }
                }
                @keyframes drift {
                    0% { transform: translateX(-200px); }
                    100% { transform: translateX(1000px); }
                }
                @keyframes aurora {
                    0% { opacity: 0.3; transform: translateY(10px); }
                    100% { opacity: 0.5; transform: translateY(-10px); }
                }
                @keyframes snowfall {
                    0% { transform: translateY(-600px); opacity: 0.8; }
                    100% { transform: translateY(600px); opacity: 0; }
                }
                @keyframes lightning {
                    0%, 90% { opacity: 0; }
                    95% { opacity: 0.5; }
                    100% { opacity: 0; }
                }
            `}</style>
        </svg>
    );
};

export default ProfessionalWeatherBackground;