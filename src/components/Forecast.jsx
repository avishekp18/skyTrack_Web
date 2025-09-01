// src/components/Forecast.jsx
import React from "react";

const WEEK_DAYS = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const Forecast = ({ data, title }) => {
	const currentDay = new Date().getDay();
	const forecastDays = WEEK_DAYS.slice(currentDay, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, currentDay));

	// Ensure data.list exists and slice the first 7 items
	const forecastItems = data?.list?.slice(0, 7).map((item) => ({
		day: forecastDays[item.dt_txt ? new Date(item.dt_txt).getDay() : 0], // Use dt_txt for accurate day
		temp: Math.round(item.main.temp), // Round temperature to nearest integer
		icon: item.weather[0].icon,
		description: item.weather[0].description,
	})) || [];

	return (
		<div className="font-SecondaSoft text-white w-full">
			{/* Title Section */}
			<div className="flex items-center justify-center my-4 mt-6">
				<h2 className="text-xl sm:text-2xl font-semibold capitalize text-center">{title}</h2>
			</div>

			{/* Forecast Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-2 sm:px-4">
				{forecastItems.map((item, idx) => (
					<div
						key={idx}
						className="sidebarr bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 animate-[fadeIn_0.5s_ease-out]"
						style={{ animationDelay: `${idx * 100}ms` }}
					>
						<p className="text-gray-400 font-light text-sm sm:text-base text-center">
							{item.day}
						</p>
						<p className="text-lg sm:text-xl font-medium text-center mt-2">
							{item.temp}°C
						</p>
						<img
							src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
							alt={item.description}
							className="w-12 h-12 mx-auto my-2"
						/>
						<p className="text-gray-400 font-light text-sm sm:text-base text-center capitalize">
							{item.description}
						</p>
					</div>
				))}

			</div>
		</div>
	);
};

export default Forecast;