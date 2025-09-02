import React from "react";
import {
    FiMapPin,
    FiMap,
    FiCompass,
    FiNavigation,
} from "react-icons/fi"; // Feather Icons
import {
    MdLocationOn,
    MdMyLocation,
    MdPlace,
} from "react-icons/md"; // Material Design
import {
    FaMapMarkerAlt,
    FaMapMarkedAlt,
    FaLocationArrow,
} from "react-icons/fa"; // Font Awesome
import {
    BiMap,
    BiCurrentLocation,
    BiMapPin,
} from "react-icons/bi"; // BoxIcons

export default function LocationIconsPage() {
    const icons = [
        { icon: <FiMapPin />, name: "FiMapPin" },
        { icon: <FiMap />, name: "FiMap" },
        { icon: <FiCompass />, name: "FiCompass" },
        { icon: <FiNavigation />, name: "FiNavigation" },
        { icon: <MdLocationOn />, name: "MdLocationOn" },
        { icon: <MdMyLocation />, name: "MdMyLocation" },
        { icon: <MdPlace />, name: "MdPlace" },
        { icon: <FaMapMarkerAlt />, name: "FaMapMarkerAlt" },
        { icon: <FaMapMarkedAlt />, name: "FaMapMarkedAlt" },
        { icon: <FaLocationArrow />, name: "FaLocationArrow" },
        { icon: <BiMap />, name: "BiMap" },
        { icon: <BiCurrentLocation />, name: "BiCurrentLocation" },
        { icon: <BiMapPin />, name: "BiMapPin" },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Location Icons Test</h1>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {icons.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:scale-110 transition-transform duration-200"
                    >
                        <div className="text-4xl text-blue-500 mb-2">{item.icon}</div>
                        <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
