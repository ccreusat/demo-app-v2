import "react-native-gesture-handler";
import * as React from "react";
import { AppState, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//
// Screens
//
import NotificationScreen from "screens/notification";
import WebviewScreen from "screens/webview";
//
// Plugins
//
import NotificationManager from "react-native-check-notification-enable";

export const AuthContext = React.createContext();

const NotificationStack = createStackNavigator();
const MainStack = createStackNavigator();

function NotificationStackScreen() {
  return (
    <NotificationStack.Navigator>
      <NotificationStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <NotificationStack.Screen
        name="Guest"
        component={MainStackScreen}
        options={{ headerShown: false }}
      />
    </NotificationStack.Navigator>
  );
}
function MainStackScreen() {
  return (
    <MainStack.Navigator tabBarOptions={{ showLabel: false }}>
      <MainStack.Screen
        name="Home"
        component={WebviewScreen}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}

export default App = () => {
  const [user, setUser] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerPassword, setCustomerPassword] = React.useState("");
  const [action, setAction] = React.useState("");
  const [appState, setAppState] = React.useState(AppState.currentState);
  const [notification, setNotification] = React.useState(true);

  const store = {
    user: [user, setUser],
    email: [customerEmail, setCustomerEmail],
    password: [customerPassword, setCustomerPassword],
    action: [action, setAction],
    notification: [notification, setNotification],
    appState: [appState, setAppState],
  };

  const _handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
    NotificationManager.retrieveGlobalNotificationSettings()
      .then((settings) => {
        setNotification(settings.isEnabled);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    if (Platform.OS === "ios") {
      StatusBar.setBarStyle("dark-content");
    } else {
      StatusBar.setBarStyle("light-content");
    }
  }, []);

  React.useEffect(() => {
    if (Platform.OS === "android") {
      NotificationManager.areNotificationsEnabled()
        .then((status) => {
          setNotification(status);
        })
        .catch((status) => {
          console.log(status);
        });

      AppState.addEventListener("change", _handleAppStateChange);

      return () => {
        AppState.removeEventListener("change", _handleAppStateChange);
      };
    }
  }, [appState, notification]);

  return (
    <AuthContext.Provider value={store}>
      <StatusBar />
      <NavigationContainer>
        {Platform.OS === "android" && notification === false ? (
          <NotificationStackScreen />
        ) : (
          <MainStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};
