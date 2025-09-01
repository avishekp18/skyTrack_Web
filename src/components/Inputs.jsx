import { useState } from "react";
import AsyncSelect from "react-select/async";
import { WEATHER_API_KEY } from "../components/Api";

function Inputs({ onSearchChange, isLoading }) {
	const [value, setValue] = useState(null);
	const [error, setError] = useState(null);

	// Load options for AsyncSelect without debounce
	const loadOptions = async (input) => {
		if (input.length < 2) {
			return [];
		}
		try {
			setError(null);
			const response = await fetch(
				`https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${WEATHER_API_KEY}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch city data");
			}
			const data = await response.json();
			console.log("API response:", data); // Debug
			return data.map((city) => ({
				value: `${city.lat} ${city.lon}`,
				label: `${city.name}, ${city.country}${city.state ? `, ${city.state}` : ""}`,
			}));
		} catch (err) {
			console.error(err);
			setError("Failed to load cities. Please check your API key or try again.");
			return [];
		}
	};

	// Handle selection change and clear input
	const handleChange = (selected) => {
		setValue(null); // Clear input after selection
		console.log("Selected:", selected); // Debug
		onSearchChange(selected); // Trigger parent callback
	};

	return (
		<div className="w-full max-w-[95%] xs:max-w-[90%] sm:max-w-md md:max-w-lg mx-auto">
			{error && <div className="text-red-500 text-sm mb-2">{error}</div>}
			<AsyncSelect
				cacheOptions
				defaultOptions={false}
				loadOptions={loadOptions}
				onChange={handleChange}
				value={value}
				isDisabled={isLoading}
				placeholder="Search for a city..."
				classNamePrefix="react-select"
				className="text-sm sm:text-base"

				loadingMessage={() => <span className="text-white text-sm">Searching...</span>}
				aria-label="Search for a city to view weather details"
				styles={{
					control: (base, { isFocused, isDisabled }) => ({
						...base,
						backgroundColor: isDisabled
							? "rgba(255, 255, 255, 0.1)"
							: "rgba(255, 255, 255, 0.2)",
						borderRadius: "1.25rem", // rounded-xl
						padding: "0.5rem", // p-2
						border: isFocused ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
						boxShadow: isFocused ? "0 0 8px rgba(255, 255, 255, 0.2)" : "none",
						"&:hover": {
							backgroundColor: "rgba(255, 255, 255, 0.25)",
						},
					}),
					input: (base) => ({
						...base,
						color: "white",
						fontSize: "0.875rem", // text-sm
					}),
					singleValue: (base) => ({
						...base,
						color: "white",
						fontSize: "0.875rem", // text-sm
					}),
					menu: (base) => ({
						...base,
						backgroundColor: "rgba(7, 7, 7, 0.2)",
						backdropFilter: "blur(100px)",
						borderRadius: "1.25rem", // rounded-xl
						marginTop: "0.25rem", // mt-1
						border: "1px solid rgba(255, 255, 255, 0.2)",
						zIndex: 1000,
						maxHeight: "200px",
						overflowY: "auto",
					}),
					option: (base, { isFocused, isSelected }) => ({
						...base,
						backgroundColor: isSelected
							? "rgba(255, 255, 255, 0.3)"
							: isFocused
								? "rgba(255, 255, 255, 0.25)"
								: "transparent",
						color: "white",
						padding: "0.5rem 0.75rem", // py-2 px-3
						fontSize: "0.875rem", // text-sm
						cursor: "pointer",
						"&:hover": {
							backgroundColor: "rgba(255, 255, 255, 0.25)",
						},
					}),
					placeholder: (base) => ({
						...base,
						color: "rgba(255, 255, 255, 0.7)",
						fontSize: "0.875rem", // text-sm
					}),
					noOptionsMessage: (base) => ({
						...base,
						color: "white",
						fontSize: "0.875rem", // text-sm
						padding: "0.5rem", // p-2
						textAlign: "center",
						backgroundColor: "transparent",
					}),
					loadingMessage: (base) => ({
						...base,
						color: "white",
						fontSize: "0.875rem", // text-sm
						padding: "0.5rem", // p-2
						textAlign: "center",
						backgroundColor: "transparent",
					}),
				}}
			/>
		</div>
	);
}

export default Inputs;