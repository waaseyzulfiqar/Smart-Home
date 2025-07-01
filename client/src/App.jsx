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
    <div>
      {data &&
        data.length > 0 &&
        data.map((item) => (
          <button
            key={item._id}
            onClick={() =>
              handleApplianceState(item._id, item.state === "on" ? "off" : "on")
            }
          >
            {item.name} - {item.state.toUpperCase()}{" "}
          </button>
        ))}
    </div>
  );
};

export default App;
