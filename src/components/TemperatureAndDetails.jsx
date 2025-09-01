import React from "react";
import { GoLocation } from "react-icons/go";
import { temp, wind, humid } from "../assets/images";

const TemperatureAndDetails = ({ data }) => {
	// Function to get current date and time in IST
	const getCurrentDateTime = () => {
		const now = new Date();
		const options = {
			weekday: "short",
			day: "2-digit",
			month: "short",
			year: "numeric",
			timeZone: "Asia/Kolkata",
		};
		return now.toLocaleString("en-US", options).replace(",", "") + " IST";
	};

	// Weather icon URL with fallback
	const weatherIcon = data.weather && data.weather[0]?.icon;
	const iconUrl = weatherIcon
		? `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
		: "https://openweathermap.org/img/wn/01d@2x.png";

	// Dynamic background gradient based on weather condition

	return (
		<div
			className={`
                w-full max-w-[95%] sm:max-w-md md:max-w-lg mx-auto
                bg-gradient-to-br
                backdrop-blur-md
                rounded-2xl
                border border-white/20
                shadow-[inset_0_0_20px_rgba(255,255,255,0.15),0_4px_20px_rgba(0,0,0,0.1)]
                p-3 xs:p-4 sm:p-6 md:p-8
                text-white
                font-sans
                relative
                overflow-hidden
                transition-all duration-300 ease-in-out
                hover:shadow-[inset_0_0_30px_rgba(255,255,255,0.2),0_6px_24px_rgba(0,0,0,0.15)]
            `}
			style={{
				WebkitBackdropFilter: "blur(8px) saturate(150%)",
				backdropFilter: "blur(8px) saturate(150%)",
			}}
		>
			{/* Header: Location and Date */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
				<div className="flex items-center space-x-3">
					<GoLocation size={20} className="text-gray-200 animate-pulse" />
					<h2 className="text-xl sm:text-2xl font-bold truncate max-w-[200px] tracking-tight">
						{data.city || "Loading..."}
					</h2>
				</div>
				<p className="text-sm text-gray-300 font-light tracking-wide">
					{getCurrentDateTime()}
				</p>
			</div>

			{/* Main Weather Info */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
				{/* Weather Icon */}
				<div className="relative">
					<img
						src={iconUrl}
						alt={data.weather[0]?.description || "weather icon"}
						className="h-28 w-28 object-contain transition-transform duration-300 hover:scale-110"
						onError={(e) => {
							e.target.src = "https://openweathermap.org/img/wn/01d@2x.png";
						}}
					/>
					{/* <div className="absolute inset-0 bg-white/10 rounded-full blur-md -z-10" /> */}
				</div>

				{/* Temperature and Description */}
				<div className="text-center sm:text-right space-y-2">
					<div className="flex items-baseline justify-center sm:justify-end gap-2">
						<p className="text-6xl sm:text-7xl font-extrabold leading-none tracking-tight">
							{Math.round(data.main?.temp) || "--"}
						</p>
						<span className="text-3xl sm:text-4xl font-light text-gray-200">°C</span>
					</div>
					<p className="text-base sm:text-lg font-medium capitalize text-gray-100">
						{data.weather[0]?.description || "No description"}
					</p>
				</div>
			</div>

			{/* Additional Details */}
			<div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 bg-white/10 rounded-xl p-4 sm:p-6 border border-white/20 shadow-inner transition-all duration-300 hover:bg-white/15">
				{/* Feels Like */}
				<div className="flex flex-col items-center space-y-1 group">
					<img
						src={temp}
						alt="Temperature Feel"
						className="w-8 h-8 mb-2 transition-transform duration-300 group-hover:scale-110"
					/>
					<p className="text-base font-semibold">
						{Math.round(data.main?.feels_like) || "--"}°C
					</p>
					<p className="text-xs text-gray-300 tracking-wide">Feels Like</p>
				</div>

				{/* Humidity */}
				<div className="flex flex-col items-center space-y-1 group">
					<img
						src={humid}
						alt="Humidity"
						className="w-8 h-8 mb-2 transition-transform duration-300 group-hover:scale-110"
					/>
					<p className="text-base font-semibold">
						{data.main?.humidity || "--"}%
					</p>
					<p className="text-xs text-gray-300 tracking-wide">Humidity</p>
				</div>

				{/* Wind Speed */}
				<div className="flex flex-col items-center space-y-1 group">
					<img
						src={wind}
						alt="Wind Speed"
						className="w-8 h-8 mb-2 transition-transform duration-300 group-hover:scale-110"
					/>
					<p className="text-base font-semibold">
						{data.wind?.speed ? (data.wind.speed * 3.6).toFixed(1) : "--"} km/h
					</p>
					<p className="text-xs text-gray-300 tracking-wide">Wind Speed</p>
				</div>
			</div>
		</div>
	);
};

export default TemperatureAndDetails;