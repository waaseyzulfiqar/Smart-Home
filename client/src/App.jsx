import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Memoized axios instance
  const apiClient = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:4211",
        timeout: 1000,
      }),
    []
  );

  // Fetch data with error handling and loading states
  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) setIsLoading(true);
        const response = await apiClient.get("/");

        if (response.data?.appliances) {
          setData(response.data.appliances);
          setLastUpdate(new Date());
          setIsOnline(true);
        }
      } catch (error) {
        console.error("Fetch Data Error:", error.message);
        setIsOnline(false);
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [apiClient]
  );

  // Handle appliance state changes with optimistic updates
  const handleApplianceState = useCallback(
    async (applianceId, newState) => {
      try {
        setIsLoading(true);

        // Optimistic update - update UI immediately
        setData((prevData) =>
          prevData.map((item) =>
            item._id === applianceId ? { ...item, state: newState } : item
          )
        );

        // Make API call
        await apiClient.post(`/update/${applianceId}`, {
          state: newState,
        });

        // Fetch fresh data after successful update
        setTimeout(() => fetchData(false), 200);
      } catch (error) {
        console.error("Update Error:", error.message);
        // Revert optimistic update on error
        fetchData(false);
      } finally {
        setIsLoading(false);
      }
    },
    [apiClient, fetchData]
  );

  // Real-time polling effect
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling every 2 seconds
    const interval = setInterval(() => {
      fetchData(false); // Don't show loading for background updates
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [fetchData]);

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Creative Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2 retro-heading">
          SMART<span className="text-yellow-500">CONTROL</span>
        </h1>
        <p className="text-gray-600 italic">
          Now You Can Control Your Appliances with Just ONE CLICK
        </p>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>

        {/* Real-time status indicator */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              } ${isLoading ? "animate-pulse" : ""}`}
            ></div>
            <span className="text-sm text-gray-600">
              {isLoading
                ? "Updating..."
                : isOnline
                ? "Connected"
                : "Disconnected"}
            </span>
          </div>

          {/* Manual refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            Refresh
          </button>

          {/* Last update time */}
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Connection status banner */}
      {!isOnline && (
        <div className="max-w-4xl mx-auto mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          <span className="font-semibold">Connection Lost!</span> Trying to
          reconnect...
        </div>
      )}

      {/* Loading state */}
      {isLoading && data.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-600">Loading appliances...</p>
        </div>
      )}

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
              disabled={isLoading || !isOnline}
              className={`
                relative h-14 w-28 rounded-full border-4 border-gray-800
                shadow-[0_6px_0_rgba(0,0,0,0.2)] transition-all duration-200
                ${item.state === "on" ? "bg-green-500" : "bg-red-500"}
                ${
                  isLoading || !isOnline
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg hover:scale-105"
                }
                ${!isOnline ? "grayscale" : ""}
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

            {/* Individual appliance status */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              {item.lastUpdated ? (
                <span>
                  Updated: {new Date(item.lastUpdated).toLocaleTimeString()}
                </span>
              ) : (
                <span>Ready</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No data state */}
      {!isLoading && data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No appliances found</div>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Footer Attribution */}
      <div className="mt-16 text-center">
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
