import { FiSunrise, FiSunset } from "react-icons/fi";
import { TbSunHigh, TbSunLow } from "react-icons/tb";
import { WiBarometer } from "react-icons/wi"; // Weather Icons
import { FaEye, FaWind } from "react-icons/fa"; // Font Awesome



const SunriseAndSunset = ({ data }) => {
	// Format Unix timestamp to time string
	const formatTime = (unixTimestamp) => {
		if (!unixTimestamp) return "--";
		const date = new Date(unixTimestamp * 1000);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
			timeZone: "Asia/Kolkata",
		});
	};


	// Card style with responsive padding and hover effect
	const cardClass = `
        relative
        flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2
        bg-white/10
        backdrop-blur-md
        rounded-xl
        border border-white/20
        shadow-[inset_0_0_8px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.1)]
        p-3 xs:p-3.5 sm:p-4 md:p-5
        transition-all duration-300 ease-in-out
        hover:bg-white/15
        group
        min-h-[80px]
    `;

	const labelClass = "text-[0.65rem] xs:text-xs sm:text-sm text-gray-200 font-light tracking-wide";
	const valueClass = "text-xs xs:text-sm sm:text-base font-semibold text-white";

	const items = [
		{
			label: "Sunrise",
			value: formatTime(data.sys?.sunrise),
			icon: (
				<FiSunrise
					size={18}
					className="text-yellow-400 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
					aria-label="Sunrise time"
				/>
			),
		},
		{
			label: "Sunset",
			value: formatTime(data.sys?.sunset),
			icon: (
				<FiSunset
					size={18}
					className="text-orange-400 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
					aria-label="Sunset time"
				/>
			),
		},
		{
			label: "High",
			value: data.main?.temp_max ? `${Math.round(data.main.temp_max)}°C` : "--",
			icon: (
				<TbSunHigh
					size={18}
					className="text-yellow-500 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
					aria-label="Daily high temperature"
				/>
			),
		},
		{
			label: "Low",
			value: data.main?.temp_min ? `${Math.round(data.main.temp_min)}°C` : "--",
			icon: (
				<TbSunLow
					size={18}
					className="text-blue-400 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
					aria-label="Daily low temperature"
				/>
			),
		},
		// {
		// 	label: "Pressure",
		// 	value: data.main?.pressure ? `${data.main.pressure} hPa` : "--",
		// 	icon: (
		// 		<WiBarometer
		// 			size={18}
		// 			className="text-gray-300 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
		// 			aria-label="Atmospheric pressure"
		// 		/>
		// 	),
		// },
		{
			label: "Visibility",
			value: data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : "--",
			icon: (
				<FaEye
					size={18}
					className="text-blue-300 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
					aria-label="Visibility distance"
				/>
			),
		},
		{
			label: "Wind Gust",
			value: data.wind?.gust ? `${(data.wind.gust * 3.6).toFixed(1)} km/h` : "N/A",
			icon: (
				<FaWind
					size={18}
					className="text-blue-200 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-105"
					aria-label="Wind gust speed"
				/>
			),
		},
	];

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
			{/* Crystal shine highlight */}
			<div
				className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl"
				style={{
					background: "linear-gradient(135deg, rgba(224, 25, 25, 0) 0%, rgba(255, 255, 255, 0) 70%)",
					mixBlendMode: "screen",
					filter: "blur(50px)",
					zIndex: 0,
				}}
			></div>

			<div className="relative z-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-4 xl:gap-8 xl:py-6 sm:bg-gradient-to-br
                backdrop-blur-md w-full">
				{items.map((item, index) => (
					<div key={index} className={cardClass}>
						{item.icon && <div className="relative">{item.icon}</div>}
						<p className={valueClass}>{item.value}</p>
						<p className={labelClass}>{item.label}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default SunriseAndSunset;