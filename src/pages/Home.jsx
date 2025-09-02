import React, { useState, useCallback, useEffect } from 'react';
import { Inputs, TemperatureAndDetails, SunriseAndSunset, Forecast, TopButtons } from '../components';
import { WEATHER_API_URL, WEATHER_API_KEY } from '../components/Api';
import ErrorBoundary from '../components/ErrorBoundary';

const Home = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('current');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationPermission, setLocationPermission] = useState('prompt');
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);

    // Fetch weather by coordinates helper
    const fetchWeatherByCoords = useCallback(async (lat, lon, cityLabel = 'Current Location') => {
        setIsLoading(true);
        setError(null);

        try {
            const [weatherRes, forecastRes] = await Promise.all([
                fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
                fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
            ]);

            if (weatherRes.cod !== 200 || forecastRes.cod !== '200') {
                throw new Error(weatherRes.message || forecastRes.message || 'Failed to fetch weather data');
            }

            // Aggregate daily high/low from forecast for accurate temp_max/temp_min
            const dailyForecast = forecastRes.list.slice(0, 8); // First 24 hours (3-hour intervals)
            const tempMax = Math.max(...dailyForecast.map(item => item.main.temp_max));
            const tempMin = Math.min(...dailyForecast.map(item => item.main.temp_min));

            const cityName = weatherRes.name || cityLabel;
            setCurrentWeather({ city: cityName, ...weatherRes, main: { ...weatherRes.main, temp_max: tempMax, temp_min: tempMin } });
            setForecast({ city: cityName, ...forecastRes });
        } catch (err) {
            setError(err.message || 'Unable to fetch weather data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch user's geolocation
    const fetchLocation = useCallback((onSuccess, onError) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lon: longitude });
                    setLocationPermission('granted');
                    onSuccess?.(latitude, longitude);
                },
                (err) => {
                    if (err.code === err.PERMISSION_DENIED) {
                        setLocationPermission('denied');
                        onError?.('Location access denied. Please allow location access in your browser settings.');
                    } else {
                        setLocationPermission('unsupported');
                        onError?.('Geolocation is not supported by this browser.');
                    }
                }
            );
        } else {
            setLocationPermission('unsupported');
            onError?.('Geolocation is not supported by this browser.');
        }
    }, []);

    // Request location permission
    const requestLocationPermission = useCallback(() => {
        setIsRequestingPermission(true);
        setError(null);
        fetchLocation(
            (lat, lon) => {
                fetchWeatherByCoords(lat, lon);
                setIsRequestingPermission(false);
            },
            (errorMessage) => {
                setError(errorMessage);
                setIsRequestingPermission(false);
            }
        );
    }, [fetchLocation, fetchWeatherByCoords]);

    // Trigger fetching location once on mount
    useEffect(() => {
        requestLocationPermission();
    }, [requestLocationPermission]);

    // Handle search changes from the search input
    const handleOnSearchChange = useCallback(async (searchData) => {
        setIsLoading(true);
        setError(null);

        try {
            const [lat, lon] = searchData.value.split(' ');
            await fetchWeatherByCoords(lat, lon, searchData.label);
        } catch (err) {
            setError(err.message || 'Failed to fetch weather data');
        } finally {
            setIsLoading(false);
        }
    }, [fetchWeatherByCoords]);

    // Dynamic Weather Background SVG component
    const DynamicWeatherBackground = ({ condition = 'Default', isDay = true }) => {
        let topColor, bottomColor;
        switch (condition) {
            case 'Clear':
                topColor = isDay ? '#87CEEB' : '#191970'; // Sky blue day, midnight blue night
                bottomColor = isDay ? '#3a588aff' : '#4f4fb2ff';
                break;
            case 'Clouds':
                topColor = isDay ? '#323030ff' : '#696969'; // Light gray day, dark gray night
                bottomColor = isDay ? '#A9A9A9' : '#514646ff';
                break;
            case 'Rain':
            case 'Drizzle':
                topColor = '#4682B4'; // Steel blue
                bottomColor = '#1E90FF';
                break;
            case 'Thunderstorm':
                topColor = '#2F4F4F'; // Dark slate
                bottomColor = '#000000';
                break;
            case 'Snow':
                topColor = '#F0F8FF'; // Alice blue
                bottomColor = '#A9A9A9';
                break;
            case 'Mist':
            case 'Fog':
                topColor = '#D3D3D3'; // Light gray
                bottomColor = '#808080';
                break;
            default:
                topColor = '#000000';
                bottomColor = '#000000';
        }

        return (
            <svg
                className="absolute inset-0 w-full h-full z-[-1]"
                xmlns="https://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                viewBox="0 0 800 600"
            >
                <defs>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={topColor} />
                        <stop offset="100%" stopColor={bottomColor} />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect width="800" height="600" fill="url(#skyGradient)" />
                {/* Stars for night or clear night */}
                {(!isDay || condition === 'Clear') && [...Array(70)].map((_, i) => (
                    <circle
                        key={i}
                        cx={Math.random() * 800}
                        cy={Math.random() * 600}
                        r={Math.random() * 1.5 + 0.3}
                        fill="#FFFFFF"
                        opacity={Math.random() * 0.8 + 0.1}
                        filter="url(#glow)"
                        style={{
                            animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
                        }}
                    />
                ))}
                {/* Clouds for cloudy weather */}
                {condition === 'Clouds' && (
                    <>
                        <ellipse cx="200" cy="200" rx="100" ry="50" fill="#FFFFFF" opacity="0.6" />
                        <ellipse cx="300" cy="180" rx="120" ry="60" fill="#FFFFFF" opacity="0.5" />
                        <ellipse cx="500" cy="250" rx="80" ry="40" fill="#FFFFFF" opacity="0.7" />
                        <ellipse cx="600" cy="220" rx="110" ry="55" fill="#FFFFFF" opacity="0.4" />
                    </>
                )}
                {/* Rain lines for rain/drizzle */}
                {(condition === 'Rain' || condition === 'Drizzle') && [...Array(50)].map((_, i) => (
                    <line
                        key={i}
                        x1={Math.random() * 800}
                        y1="0"
                        x2={Math.random() * 800}
                        y2="600"
                        stroke="#FFFFFF"
                        strokeWidth="1"
                        opacity="0.5"
                        style={{
                            animation: `rain 1s linear infinite`,
                            animationDelay: `${Math.random() * 1}s`,
                        }}
                    />
                ))}
                {/* Snowflakes for snow */}
                {condition === 'Snow' && [...Array(40)].map((_, i) => (
                    <circle
                        key={i}
                        cx={Math.random() * 800}
                        cy={Math.random() * 600}
                        r={Math.random() * 3 + 1}
                        fill="#FFFFFF"
                        opacity="0.8"
                        style={{
                            animation: `snow 5s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
                <style>{`
                    @keyframes twinkle {
                        0% { opacity: 0.1; }
                        100% { opacity: 0.9; }
                    }
                    @keyframes rain {
                        0% { transform: translateY(-600px); }
                        100% { transform: translateY(600px); }
                    }
                    @keyframes snow {
                        0% { transform: translateY(-600px); }
                        100% { transform: translateY(600px); }
                    }
                `}</style>
            </svg>
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 md:p-6 font-SecondaSoft relative">
            <DynamicWeatherBackground
                condition={currentWeather?.weather?.[0]?.main}
                isDay={currentWeather?.weather?.[0]?.icon?.endsWith('d')}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/10 to-gray-900/20 backdrop-blur-md animate-[weatherShift_20s_ease-in-out_infinite] opacity-70 z-0" />
            <div className="flex justify-center mb-4 sm:mb-6 z-20 w-full px-2 sm:px-4">
                <TopButtons
                    onSearchChange={handleOnSearchChange}
                    currentLocation={currentLocation}
                    locationPermission={locationPermission}
                    onRequestLocation={requestLocationPermission}
                    isRequestingPermission={isRequestingPermission}
                />
            </div>
            <div className="w-full max-w-[95%] sm:max-w-5xl md:max-w-6xl space-y-6 sm:space-y-8 animate-[fadeIn_0.8s_ease-out] z-10 relative">
                <div className="bg-gray-800/0 backdrop-blur-xl rounded-2xl p-4 sm:p-6 mt-36 md:p-8 mt-16 sm:mt-20 md:mt-24 shadow-xl sidebar relative z-30 border border-gray-700/30">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white text-center mb-4 sm:mb-6 animate-[slideDown_0.5s_ease-out]">
                        Weather Insight
                    </h1>
                    <div className="flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6 space-x-3 sm:space-x-4">
                        <button
                            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-colors duration-300 ${activeTab === 'current' ? 'bg-gray-700/70 text-white' : 'bg-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'} backdrop-blur-md touch-manipulation`}
                            onClick={() => setActiveTab('current')}
                            aria-label="View current weather"
                        >
                            Current Weather
                        </button>
                        <button
                            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-colors duration-300 ${activeTab === 'forecast' ? 'bg-gray-700/70 text-white' : 'bg-gray-600/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'} backdrop-blur-md touch-manipulation`}
                            onClick={() => setActiveTab('forecast')}
                            aria-label="View 5-day forecast"
                        >
                            Forecast
                        </button>
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <Inputs onSearchChange={handleOnSearchChange} isLoading={isLoading} />
                    </div>
                    {error && (
                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-200 bg-red-800/50 rounded-lg p-2 text-center animate-[fadeIn_0.5s_ease-out] backdrop-blur-md">
                            {error}
                            {locationPermission === 'denied' && (
                                <span>
                                    <br />
                                    <a
                                        href="https://support.google.com/chrome/answer/142065?hl=en"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline text-red-100 text-xs"
                                    >
                                        Learn how to enable location access.
                                    </a>
                                </span>
                            )}
                        </p>
                    )}
                    {isLoading && (
                        <div className="mt-3 sm:mt-4 flex justify-center">
                            <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-2 border-white border-t-transparent rounded-full" />
                        </div>
                    )}
                    {currentWeather && !isLoading && !error && (
                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm bg-white/10 text-gray-300 border-none rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-center animate-[fadeIn_0.7s_ease-out] backdrop-blur-md">
                            Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                    )}
                </div>
                {currentWeather && !isLoading && !error && activeTab === 'current' && (
                    <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4 md:px-8 animate-[slideUp_0.6s_ease-out]">
                        <div className="flex-1 min-w-[100%] sm:min-w-[280px]">
                            <ErrorBoundary>
                                <TemperatureAndDetails data={currentWeather} />
                            </ErrorBoundary>
                        </div>
                        <div className="flex-1 min-w-[100%] sm:min-w-[280px] mt-4 sm:mt-0">
                            <ErrorBoundary>
                                <SunriseAndSunset data={currentWeather} />
                            </ErrorBoundary>
                        </div>
                    </div>
                )}
                {forecast && !isLoading && !error && activeTab === 'forecast' && (
                    <div className="bg-gray-200/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-400/0 animate-[slideUp_0.6s_ease-out]">
                        <ErrorBoundary>
                            <Forecast title="5-Day Forecast" data={forecast} />
                        </ErrorBoundary>
                    </div>
                )}
                {!currentWeather && !isLoading && !error && (
                    <p className="text-center text-gray-400 text-sm sm:text-base mt-8 sm:mt-10 select-none">
                        Search for a location to see weather details.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;