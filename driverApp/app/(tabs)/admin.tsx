// 'use client';
// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import { socket } from '../../socket'; // ✅ using shared socket

// type Walker = {
//   userId: string;
//   latitude: number;
//   longitude: number;
//   updatedAt?: string;
// };

// export default function AdminDashboardScreen() {
//   const [walkers, setWalkers] = useState<Record<string, Walker>>({});
//   const [selectedWalker, setSelectedWalker] = useState<Walker | null>(null);
//   const mapRef = useRef<MapView>(null);

//   useEffect(() => {
//     socket.on('walkerLocation', (data: Walker) => {
//       setWalkers((prev) => ({
//         ...prev,
//         [data.userId]: data,
//       }));
//     });

//     socket.on('walkerDisconnected', (userId: string) => {
//       setWalkers((prev) => {
//         const updated = { ...prev };
//         delete updated[userId];
//         return updated;
//       });
//     });

//     return () => {
//       socket.off('walkerLocation');
//       socket.off('walkerDisconnected');
//     };
//   }, []);

//   const handleSelectWalker = (walker: Walker) => {
//     setSelectedWalker(walker);
//     mapRef.current?.animateToRegion({
//       latitude: walker.latitude,
//       longitude: walker.longitude,
//       latitudeDelta: 0.01,
//       longitudeDelta: 0.01,
//     }, 1000);
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: 31.4107,
//           longitude: 73.1070,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         {Object.values(walkers).map((walker) => (
//           <Marker
//             key={walker.userId}
//             coordinate={{
//               latitude: walker.latitude,
//               longitude: walker.longitude,
//             }}
//             title={`Walker: ${walker.userId}`}
//             description={`Updated: ${walker.updatedAt ? new Date(walker.updatedAt).toLocaleTimeString() : ''}`}
//             pinColor={selectedWalker?.userId === walker.userId ? 'blue' : 'green'}
//           />
//         ))}
//       </MapView>

//       {/* Sidebar for PC */}
//       <View style={styles.sidebar}>
//         <Text style={styles.header}>👣 Active Walkers ({Object.keys(walkers).length})</Text>
//         <FlatList
//           data={Object.values(walkers)}
//           keyExtractor={(item) => item.userId}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={[
//                 styles.walkerCard,
//                 selectedWalker?.userId === item.userId && styles.selectedWalker,
//               ]}
//               onPress={() => handleSelectWalker(item)}
//             >
//               <Text style={styles.walkerId}>{item.userId}</Text>
//               <Text style={styles.coords}>
//                 📍 {item.latitude.toFixed(3)}, {item.longitude.toFixed(3)}
//               </Text>
//               {item.updatedAt && (
//                 <Text style={styles.time}>🕒 {new Date(item.updatedAt).toLocaleTimeString()}</Text>
//               )}
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     </View>
//   );
// }

// const { width } = Dimensions.get('window');
// const SIDEBAR_WIDTH = width * 0.4;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   map: {
//     flex: 1,
//   },
//   sidebar: {
//     position: 'absolute',
//     right: 0,
//     top: 0,
//     width: SIDEBAR_WIDTH,
//     height: '100%',
//     backgroundColor: '#ffffffee',
//     padding: 10,
//     borderLeftWidth: 1,
//     borderColor: '#ccc',
//     zIndex: 999,
//   },
//   header: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   walkerCard: {
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//     marginBottom: 8,
//   },
//   selectedWalker: {
//     backgroundColor: '#d0e8ff',
//     borderWidth: 1,
//     borderColor: '#3399ff',
//   },
//   walkerId: {
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   coords: {
//     fontSize: 12,
//     color: '#555',
//   },
//   time: {
//     fontSize: 11,
//     color: '#888',
//     marginTop: 2,
//   },
// });
