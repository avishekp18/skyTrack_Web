import React, { useState, useCallback, useEffect } from 'react';
import { Inputs, TemperatureAndDetails, SunriseAndSunset, Forecast, TopButtons } from '../components';
import { WEATHER_API_URL, WEATHER_API_KEY } from '../components/Api';
import ErrorBoundary from '../components/ErrorBoundary';
import ProfessionalWeatherBackground from '../components/ProfessionalWeatherBackground';

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
    const fetchWeatherByCoords = useCallback(async (lat, lon, cityLabel = 'your city') => {
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 md:p-6 font-SecondaSoft relative">
            {/* <ProfessionalWeatherBackground
                condition={currentWeather?.weather?.[0]?.main}
                isDay={currentWeather?.weather?.[0]?.icon?.endsWith('d')}
            /> */}
            <ProfessionalWeatherBackground
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
                    <div id="forecast"
                        className="bg-gray-200/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-gray-400/0 animate-[slideUp_0.6s_ease-out]">
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