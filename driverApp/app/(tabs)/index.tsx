"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://192.168.1.31:4000";

type Coords = {
  latitude: number;
  longitude: number;
};

export default function TrackerScreen() {
  const [location, setLocation] = useState<Coords | null>(null);
  const [tracking, setTracking] = useState<boolean>(false);
  const [path, setPath] = useState<Coords[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const watcherRef = useRef<Location.LocationSubscription | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const userId = useMemo(
    () => `walker-${Math.floor(Math.random() * 10000)}`,
    []
  );

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const startTracking = async () => {
    console.log("📍 Requesting location permission...");
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location access is required.");
      return;
    }

    console.log("✅ Permission granted. Starting tracking...");
    setTracking(true);
    const currentLoc = await Location.getCurrentPositionAsync({});
    const coords = currentLoc.coords;
    console.log("📍 Current position:", coords);

    setLocation(coords);
    setPath([coords]);

    mapRef.current?.animateToRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });

    const watcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (loc) => {
        const coords = loc.coords;
        console.log("📍 New location update:", coords);
        setLocation(coords);
        setPath((prev) => [...prev, coords]);

        console.log("📤 Sending location to server...");
        socketRef.current?.emit("locationUpdate", {
          userId,
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: new Date().toISOString(),
        });

        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    );

    watcherRef.current = watcher;
  };

  const stopTracking = () => {
    console.log("🛑 Stopping tracking...");
    setTracking(false);
    if (watcherRef.current) {
      watcherRef.current.remove();
      watcherRef.current = null;
      console.log("✅ Watcher removed");
    }

    socketRef.current?.emit("stopTracking", { userId: userId });
    
  };

  return (
    <View style={{ flex: 1 }}>
      {location && (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          showsUserLocation
          followsUserLocation
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker coordinate={location} title="You" />
          <Polyline coordinates={path} strokeColor="blue" strokeWidth={4} />
        </MapView>
      )}
      <View style={styles.buttons}>
        {!tracking ? (
          <Button title="Start Tracking" onPress={startTracking} />
        ) : (
          <Button title="Stop Tracking" onPress={stopTracking} color="red" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
});
