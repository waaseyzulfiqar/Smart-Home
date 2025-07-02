import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const App = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4211/");
      if (response.data) {
        setData(response.data.appliances);
      }
    } catch (error) {
      console.log("Fetch Data Error", error.message);
    }
  };

  console.log("data", data);

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplianceState = async (applianceId, state) => {
    try {
      await axios.post(`http://localhost:4211/update/${applianceId}`, {
        state,
      });
      fetchData();
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Creative Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2 retro-heading">
          SMART<span className="text-yellow-500">CONTROL</span>
        </h1>
        <p className="text-gray-600 italic">Now You Can Control Your Appliances with Just ONE CLICK</p>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Retro Switches Grid */}
      <div className="flex flex-col md:flex-row md:justify-center gap-10 md:gap-40 p-10 max-w-6xl mx-auto">
        {data?.map((item) => (
          <div key={item._id} className="flex flex-col items-center">
            {/* Appliance Name - Retro Style */}
            <div className="mb-4 px-4 py-2 bg-gray-800 rounded-lg shadow-inner">
              <span className="text-yellow-300 font-bold text-sm sm:text-base retro-font tracking-wider">
                {item.name.toUpperCase()}
              </span>
            </div>

            {/* 3D Retro Toggle Switch */}
            <button
              onClick={() =>
                handleApplianceState(
                  item._id,
                  item.state === "on" ? "off" : "on"
                )
              }
              className={`
            relative h-14 w-28 rounded-full border-4 border-gray-800
            shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-all duration-200
            ${item.state === "on" ? "bg-green-500" : "bg-red-500"}
          `}
            >
              {/* Switch Knob - 3D Bevel Effect */}
              <div
                className={`
            absolute top-1/2 h-10 w-10 rounded-full border-2 border-gray-800
            transform -translate-y-1/2 transition-all duration-300
            flex items-center justify-center
            shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]
            ${
              item.state === "on"
                ? "left-[calc(100%-3rem)] bg-green-300"
                : "left-1 bg-red-300"
            }
          `}
              >
                <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-white/50"></div>
              </div>
              <div className="absolute inset-0 rounded-full border-b-4 border-gray-600/50"></div>
            </button>

            {/* Status Indicator */}
            <div className="mt-2 px-3 py-1 bg-gray-800 rounded-full">
              <span
                className={`text-xs font-bold ${
                  item.state === "on" ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.state.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Attribution */}
      <div className="mt-24 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
          <span className="text-gray-700">Created with</span>
          <span className="text-red-500 text-xl">❤</span>
          <span className="font-bold text-gray-800">NoorSwitch</span>
        </div>
      </div>
    </div>
  );
};

export default App;
