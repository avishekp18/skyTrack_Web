import { topCities } from "../constants/topCity";

import { FaMapMarkerAlt } from "react-icons/fa"; // Font Awesome


const TopButtons = ({ onSearchChange, currentLocation, locationPermission, onRequestLocation, isRequestingPermission }) => {
	const handleCityClick = (city) => {
		if (onSearchChange && city?.lat && city?.lon) {
			onSearchChange({
				value: `${city.lat} ${city.lon}`,
				label: city.title || "Your City",
			});
		}
	};

	const handleCurrentLocationClick = () => {
		if (currentLocation?.lat && currentLocation?.lon) {
			handleCityClick(currentLocation);
		} else if (onRequestLocation) {
			onRequestLocation(); // Trigger browser's permission prompt
		}
	};

	// Determine button state and tooltip message
	let buttonClass = "font-SecondaSoft text-sm sm:text-base font-medium px-3 py-1 rounded-lg transition-all duration-300 relative";
	let tooltipMessage = "";
	let isDisabled = false;

	if (isRequestingPermission) {
		buttonClass += " text-gray-300 cursor-wait";
		tooltipMessage = "Requesting location access...";
	} else if (currentLocation?.lat && currentLocation?.lon) {
		buttonClass += " hover:bg-gray-700 hover:text-white";
		tooltipMessage = "View weather for your current location";
	} else if (locationPermission === 'denied') {
		buttonClass += " text-gray-300 cursor-pointer";
		tooltipMessage = "Location access denied. Click to retry.";
	} else if (locationPermission === 'unsupported') {
		buttonClass += " text-gray-500 cursor-not-allowed";
		tooltipMessage = "Geolocation is not supported by this browser.";
		isDisabled = true;
	} else {
		buttonClass += " text-gray-300 cursor-pointer";
		tooltipMessage = "Click to allow location access.";
	}

	return (
		<div className="fixed inset-x-0 flex items-center justify-around my-6 max-[350px]:my-0 max-[370px]:text-[11px] top-14 text-white px-4 py-1 bg-white/10 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-grey z-[150] animate-[fadeIn_0.5s_ease-out]">
			{/* Current Location Button */}
			<div className="relative group">
				<button
					onClick={handleCurrentLocationClick}
					disabled={isDisabled || isRequestingPermission}
					className={buttonClass}
				>
					{isRequestingPermission ? (
						<span className="flex items-center">
							<svg className="animate-spin h-4 w-4 mr-2" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"></path>
							</svg>
							Loading...
						</span>
					) : (
						<>
							<FaMapMarkerAlt className="w-5 h-5 text-grey-200" tooltipMessage="location" />

						</>
					)}
				</button>
				<span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-[200]">
					{tooltipMessage}
				</span>
			</div>

			{/* Top Cities */}
			{topCities.map((city) => (
				<button
					key={city.id}
					onClick={() => handleCityClick(city)}
					className="font-SecondaSoft text-sm sm:text-base font-medium hover:bg-gray-700 hover:text-white px-3 py-1 rounded-lg transition-all duration-300"
				>
					{city.title}
				</button>
			))}
		</div>
	);
};

export default TopButtons;