// app/_layout.tsx or wherever your tabs are defined
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      {/* <Tabs.Screen name="TrackerScreen" options={{ title: 'Live Tracker' }} /> */}
       {/* <Tabs.Screen name="tracker" options={{ title: 'Tracker' }} /> */}
       {/* <Tabs.Screen name="admin" options={{ title: 'Admin' }} /> */}

    </Tabs>
  );
}
