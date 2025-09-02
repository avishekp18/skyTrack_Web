import React from "react";

const WEEK_DAYS = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const Forecast = ({ data, title }) => {
	const today = new Date();
	const currentDayIndex = today.getDay();
	const forecastDays = WEEK_DAYS.slice(currentDayIndex, WEEK_DAYS.length).concat(
		WEEK_DAYS.slice(0, currentDayIndex)
	);

	// Function to get date key (YYYY-MM-DD)
	const getDateKey = (dt_txt) => {
		if (!dt_txt) return null;
		return new Date(dt_txt).toISOString().split("T")[0];
	};

	// Group data by day and compute aggregates
	const dailyData = (() => {
		if (!data?.list?.length) return {};

		const groups = {};
		const todayKey = today.toISOString().split("T")[0];

		data.list.forEach((item) => {
			const dateKey = getDateKey(item.dt_txt);
			if (!dateKey || new Date(dateKey) < new Date(todayKey)) return; // Skip past days

			if (!groups[dateKey]) {
				groups[dateKey] = [];
			}
			groups[dateKey].push(item);
		});

		return groups;
	})();

	// Prepare forecast items for up to 5 days
	const forecastItems = [];
	let dayIndex = 0;
	const maxDays = 5;
	const seenDays = Object.keys(dailyData).sort();

	while (forecastItems.length < maxDays) {
		let item = {
			day: forecastDays[dayIndex],
			highTemp: 0,
			lowTemp: 0,
			humidity: 0,
			windSpeed: 0,
			precip: 0,
			icon: "01d",
			description: "No data available",
		};

		const currentDateKey = seenDays[dayIndex];
		if (currentDateKey && dailyData[currentDateKey]) {
			const dayItems = dailyData[currentDateKey];

			// Find midday item for icon and description (closest to 12:00)
			let middayItem = dayItems[0];
			let minHourDiff = Math.abs(new Date(dayItems[0].dt_txt).getHours() - 12);
			dayItems.forEach((it) => {
				const hourDiff = Math.abs(new Date(it.dt_txt).getHours() - 12);
				if (hourDiff < minHourDiff) {
					minHourDiff = hourDiff;
					middayItem = it;
				}
			});

			// Aggregates
			const temps = dayItems.map((it) => it.main.temp);
			const humidities = dayItems.map((it) => it.main.humidity);
			const winds = dayItems.map((it) => it.wind.speed);
			const pops = dayItems.map((it) => (it.pop || 0) * 100);

			item.highTemp = Math.round(Math.max(...temps));
			item.lowTemp = Math.round(Math.min(...temps));
			item.humidity = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length);
			item.windSpeed = Math.round((winds.reduce((a, b) => a + b, 0) / winds.length) * 3.6); // m/s to km/h
			// item.precip = Math.round(Math.max(...pops));
			item.icon = middayItem.weather?.[0]?.icon ?? "01d";
			item.description = middayItem.weather?.[0]?.description ?? "No data";
		}

		forecastItems.push(item);
		dayIndex++;
	}

	// Background class based on weather condition
	const getWeatherBackground = (description) => {
		const lowerDesc = description.toLowerCase();
		if (lowerDesc.includes("clear")) return "bg-gradient-to-br from-blue-400 to-blue-600";
		if (lowerDesc.includes("cloud")) return "bg-gradient-to-br from-gray-400 to-gray-600";
		if (lowerDesc.includes("rain") || lowerDesc.includes("shower")) return "bg-gradient-to-br from-blue-600 to-gray-700";
		if (lowerDesc.includes("thunder")) return "bg-gradient-to-br from-yellow-600 to-gray-800";
		if (lowerDesc.includes("snow")) return "bg-gradient-to-br from-blue-200 to-gray-300";
		return "bg-gradient-to-br from-gray-500 to-gray-700";
	};

	return (
		<div className="font-sans text-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			{/* Title Section */}
			<div className="flex items-center justify-center my-6">
				<h2 className="text-2xl sm:text-3xl font-bold capitalize text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
					{title || "5-Day Weather Forecast"}
				</h2>
			</div>

			{/* Forecast Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
				{forecastItems.map((item, idx) => (
					<div
						key={idx}
						className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-[fadeIn_0.5s_ease-out] ${getWeatherBackground(
							item.description
						)}`}
						style={{ animationDelay: `${idx * 100}ms` }}
						role="article"
						aria-label={`Weather forecast for ${idx === 0 ? "Today" : item.day}`}
					>
						{/* Subtle Overlay */}
						<div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

						{/* Day Label */}
						<p className="relative text-gray-200 font-medium text-sm sm:text-base text-center">
							{idx === 0 ? "Today" : item.day}
						</p>

						{/* Weather Icon */}
						<img
							src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
							alt={item.description}
							className="w-16 h-16 mx-auto my-3"
						/>

						{/* Description */}
						<p className="relative text-gray-300 font-light text-sm text-center capitalize">
							{item.description}
						</p>

						{/* Temperature */}
						<p className="relative text-xl sm:text-2xl font-semibold text-center mt-3">
							<span className="text-blue-100">{item.highTemp}°C</span>{" "}
							<span className="text-gray-400 text-base">/ {item.lowTemp}°C</span>
						</p>

						{/* Additional Details */}
						<div className="relative mt-4 space-y-2 text-sm sm:text-base text-gray-300 text-center">
							<p>
								<span className="font-medium">Humidity:</span> {item.humidity}%
							</p>
							<p>
								<span className="font-medium">Wind:</span> {item.windSpeed} km/h
							</p>
							{/* <p>
								<span className="font-medium">Precipitation:</span> {item.precip}%
							</p> */}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Forecast;