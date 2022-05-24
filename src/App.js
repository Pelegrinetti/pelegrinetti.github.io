import React, { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card/Card";

const App = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [battery, setBattery] = useState(null);

  const getConnection = () =>
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    navigator.msConnection;
  const handleOnBatteryStatusChange = (event) => {
    setBattery(() => event.target);
  };

  useEffect(() => {
    const connection = getConnection();

    if (connection) {
      connection.onchange = (event) => {
        setConnectionStatus({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          type: connection.type,
        });
      };
    }

    setConnectionStatus({
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      type: connection.type,
    });
  }, []);

  useEffect(() => {
    const getBattery = async () => {
      if ("getBattery" in navigator) {
        setBattery(await navigator.getBattery());
      } else {
        setBattery(navigator.battery);
      }
    };

    getBattery();

    if (battery) {
      battery.addEventListener("chargingchange", handleOnBatteryStatusChange);
      battery.addEventListener(
        "chargingtimechange",
        handleOnBatteryStatusChange
      );
      battery.addEventListener(
        "dischargingtimechange",
        handleOnBatteryStatusChange
      );
      battery.addEventListener("levelchange", handleOnBatteryStatusChange);
    }
  }, [battery]);

  return (
    <main className="app-content">
      <h1>Device Status</h1>
      <Card>
        <h2>Network connection</h2>
        <p>Connection type: {connectionStatus?.type || "Can't read"}.</p>
        <p>
          Effective type: {connectionStatus?.effectiveType || "Can't read"}.
        </p>
        <p>Downlink: {connectionStatus?.downlink || "Can't read"}.</p>
      </Card>
      {battery && (
        <Card>
          <h2>Battery status</h2>
          <p>Status: {battery.charging ? "Charging" : "Discharging"}.</p>
          <p>
            {battery.charging ? "Charging time:" : "Discharging time:"}{" "}
            {battery.charging ? battery.chargingTime : battery.dischargingTime}{" "}
            seconds.
          </p>
        </Card>
      )}
      <Card>
        <h2>Device memory</h2>
        <p>Your device has ~ {navigator.deviceMemory} GiB of memory.</p>
      </Card>
    </main>
  );
};

export default App;
