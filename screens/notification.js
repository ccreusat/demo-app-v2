import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
/* Modules */
import NotificationSetting from "react-native-open-notification";

const NotificationScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("assets/notification.jpg")}
        style={styles.backgroundImage}
      >
        <View style={{ marginBottom: 30 }}>
          <TouchableOpacity
            onPress={() => NotificationSetting.open()}
            style={styles.notificationButton}
          >
            <Text style={styles.notificationButtonText}>
              Modifier les paramètres
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Guest")}
            style={styles.guestButton}
          >
            <Text style={styles.skip}>Continuer vers l'application</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  notificationButton: {
    backgroundColor: "#02A0AE",
    width: 315,
    borderRadius: 5,
    padding: 20,
  },
  notificationButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  guestButton: {
    marginTop: 10,
    width: 315,
    borderRadius: 5,
  },
  skip: {
    textAlign: "center",
    color: "#37474F",
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#37474F",
  },
});

export default NotificationScreen;
