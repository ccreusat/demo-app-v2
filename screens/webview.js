import * as React from "react";
import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";

import { APP_URL, APP_URL_WEBVIEW } from "@env";

import AsyncStorage from "@react-native-community/async-storage";
import ReactNativeBiometrics from "react-native-biometrics";

import { AuthContext } from "../App";

export default function WebviewScreen() {
  const [color, setColor] = React.useState("#CFE9EC");
  const [url, setUrl] = React.useState(APP_URL_WEBVIEW);
  const [action, setAction] = React.useState("loggout");
  const [visible, setVisible] = React.useState(false);
  const webviewRef = React.useRef(null);

  const {
    user: [user, setUser],
  } = React.useContext(AuthContext);
  const {
    email: [customerEmail, setCustomerEmail],
  } = React.useContext(AuthContext);
  const {
    password: [customerPassword, setCustomerPassword],
  } = React.useContext(AuthContext);

  const _onNavigationStateChange = (webViewState) => {
    switch (webViewState.url) {
      case APP_URL_WEBVIEW:
        setColor("#CFE9EC");
        break;
      default:
        setColor("#FFF");
    }
  };

  const backButtonHandler = () => {
    if (webviewRef.current) webviewRef.current.goBack();
  };

  const signInBiometric = () => {
    ReactNativeBiometrics.simplePrompt({
      promptMessage: "Connexion avec empreinte digitale.",
    })
      .then((resultObject) => {
        const { success } = resultObject;
        if (success) {
          console.log("successful biometrics provided");
          getBiometric();
        } else {
          console.log("user cancelled biometric prompt");
        }
      })
      .catch(() => {
        console.log("biometrics failed");
      });
  };

  getBiometric = async () => {
    try {
      const biometric_email = await AsyncStorage.getItem("@biometric_email");
      const biometric_password = await AsyncStorage.getItem(
        "@biometric_password"
      );

      setCustomerEmail(biometric_email);
      setCustomerPassword(biometric_password);
      if (biometric_email && biometric_password) {
        setUrl(APP_URL);
      }
    } catch (e) {
      // save error
      console.log(e);
    }
  };

  const storeBiometric = async (email, pwd) => {
    try {
      await AsyncStorage.setItem("@biometric_email", email);
      await AsyncStorage.setItem("@biometric_password", pwd);
    } catch (e) {
      // save error
      console.log(e);
    }
  };

  const onLoad = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    const backAction = () => {
      backButtonHandler();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    if (user) {
      const newUser = user;
      const parseUser = JSON.parse(newUser);
      const email = parseUser.email;
      const password = parseUser.password;
      const status = parseUser.action;

      // global
      setAction(status);
      setCustomerEmail(email);
      setCustomerPassword(password);

      if (status === "logged") {
        // biometric
        storeBiometric(email, password);

        if (Platform.OS === "ios") {
          NativeModules.RNString.getEmail(email);
        } else {
          NativeModules.LpbModule.show(email);
        }
      }
    }
  }, []);

  React.useEffect(() => {
    switch (action) {
      case "logged":
        setUrl(APP_URL);
        break;
      case "loggout":
        setCustomerEmail("");
        setCustomerPassword("");
        setColor("");
        break;
      case "loginBiometric":
        signInBiometric();
        break;
      default:
        setUrl(APP_URL_WEBVIEW);
    }
  }, [action]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <View style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          userAgent={"PRIVATE"}
          source={{
            uri: url,
            headers: {
              "webview-email": customerEmail,
              "webview-password": customerPassword,
            },
          }}
          onLoad={() => onLoad()}
          onLoadEnd={() => {
            [10, 50, 100, 500, 1000].forEach((timeout) => {
              setTimeout(() => {
                if (Platform.OS === "ios") {
                  StatusBar.setBarStyle("dark-content");
                } else {
                  StatusBar.setBarStyle("light-content");
                }
              }, timeout);
            });
          }}
          onLoadStart={() => setVisible(true)}
          onNavigationStateChange={_onNavigationStateChange.bind(this)}
          onMessage={(event) => {
            setUser(event.nativeEvent.data);
          }}
        />
        {visible && (
          <>
            <ActivityIndicator
              color="#02a0ae"
              style={styles.activity}
              size="large"
            />
            <View style={styles.loader}></View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.40)",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
