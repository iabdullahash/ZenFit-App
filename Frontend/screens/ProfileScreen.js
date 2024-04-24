import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "../components/AppTextInput";
import api from "../config/api/index";
import { useContext } from "react";
import { UserContext } from "../config/global/UserContext";

const Stack = createStackNavigator();

const ArrowButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons name="chevron-back" size={24} color="black" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userData, clearUserContext } = useContext(UserContext);

  const handleLogout = () => {
    clearUserContext();
    // navigation.navigate('Welcome');
  };

  //------------------------------------------------------Flat list-----------------------------------------
  const Flat_data = [
    { id: "1", title: "Personal Information", screen: "Personal_info" },
    { id: "2", title: "Security & Passwords", screen: "Password_chg" },
    { id: "3", title: "Goals", screen: "Goals" },
  ];

  const Render_flat_item = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.screen, { item })}
    >
      <View
        style={{
          flex: 1,
          alignitems: "center",
          marginTop: 15,
          paddingHorizontal: 16,
          width: "100%",
          height: 80,
          backgroundColor: Colors.background,
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
          // paddingBottom:Spacing*1
        }}
      >
        <Text
          style={{
            fontSize: FontSize.medium,
            color: Colors.text,
            fontFamily: Fonts["poppins-regular"],
            textAlign: "left",
            marginTop: Spacing * 2,
          }}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
  //-------------------------------------------------------------------------------------------------------

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 6,
          paddingBottom: Spacing * 5,
        }}
      >
        <Text style={styles.title}>Profile</Text>
        <View style={[styles.infoContainer, { paddingTop: Spacing * 1 }]}>
          <Image source={{ uri: userData.avatar }} style={styles.Image} />
        </View>
        <View style={[styles.infoContainer, { paddingTop: Spacing * 1 }]}>
          <TouchableOpacity onPress={() => navigation.navigate("Avatar")}>
            <Text
              style={{
                color: "#079ef0",
              }}
            >
              Change Avatar
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.infoContainer,
            { marginBottom: Spacing * 2, marginTop: Spacing * 1 },
          ]}
        >
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.text,
              fontFamily: Fonts["poppins-semiBold"],
            }}
          >
            {userData.name}
          </Text>
        </View>

        <FlatList
          data={Flat_data}
          renderItem={Render_flat_item}
          keyExtractor={(item) => item.id}
        />
        <View>
          <TouchableOpacity style={styles.Logout_btn} onPress={handleLogout}>
            <Text
              style={{
                fontFamily: Fonts["poppins-bold"],
                color: Colors.onPrimary,
                textAlign: "center",
                fontSize: FontSize.medium,
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Personal_info = () => {
  const navigation = useNavigation();
  const { userData, updateUser } = useContext(UserContext);
  const [name_chg, setname_chg] = useState(userData.name);
  const [email_chg, setemail_chg] = useState(userData.email);
  const [age_chg, setage_chg] = useState(userData.age.toString());
  const [height_chg, setheight_chg] = useState(userData.height.toString());
  const [weight_chg, setweight_chg] = useState(userData.weight.amount);

  const info_chng = async () => {
    try {
      const response = await api.post("/info_chg", {
        user_email: userData.email,
        name_chg,
        email_chg,
        age_chg,
        height_chg,
        weight_chg,
      });

      if (response.status === 200) {
        // Password updated successfully
        console.log(response.data);
        const data = response.data;
        updateUser(data.result);
        navigation.navigate("Profile_");
      } else {
        // Other error occurred
        const data = response.data;
        console.log("Password change failed");
      }
    } catch (error) {
      if (error.response) {
        // Request was made and server responded with an error status code
        const errorMessage = error.response.data.Error;
        console.log(errorMessage);
        Alert.alert(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        const errorMessage = error.response.data.error;
        console.log("response request baby");
      } else {
        // Other error occurred
        const errorMessage = error.response.data.error;
        console.log("don't know wtf is happening baby");
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Personal Information</Text>
          <View style={styles.infoContainer}>
            <Image source={{ uri: userData.avatar }} style={styles.Image} />
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingTop: Spacing * 3,
              }}
            >
              <Text style={styles.personal_txt}>Name</Text>

              <AppTextInput
                placeholder="Holy Cow"
                value={name_chg}
                onChangeText={setname_chg}
                inputMode="email-address"
              />
            </View>

            <View>
              <Text style={styles.personal_txt}>E-Mail</Text>

              <AppTextInput
                placeholder="holycow@farm.com"
                value={email_chg}
                onChangeText={setemail_chg}
                inputMode="email-address"
              />
            </View>
            <View>
              <Text style={styles.personal_txt}>Age</Text>

              <AppTextInput
                placeholder="21"
                value={age_chg}
                onChangeText={setage_chg}
                inputMode="number-pad"
              />
            </View>
            <View>
              <Text style={styles.personal_txt}>Height (cm)</Text>

              <AppTextInput
                placeholder="180.34 cm"
                value={height_chg}
                onChangeText={setheight_chg}
                inputMode="number-pad"
              />
            </View>
            <View>
              <Text style={styles.personal_txt}>
                Weight ({userData.weight.unit})
              </Text>

              <AppTextInput
                placeholder="68 kg"
                value={weight_chg}
                onChangeText={setweight_chg}
                inputMode="number-pad"
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={
                styles.backButton
                // styles.per_info_btn_back
              }
            >
              <ArrowButton onPress={() => navigation.navigate("Profile_")} />
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.saveButton
                // styles.per_info_btn_save
              }
              onPress={info_chng}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingBottom: Spacing * 5 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Password_chg = () => {
  const navigation = useNavigation();
  const { userData } = useContext(UserContext);
  const [old_pass, set_old_pass] = useState("");
  const [new_pass, set_new_pass] = useState("");
  const [confirm_pass, set_confirm_pass] = useState("");

  const pass_chng = async () => {
    try {
      const response = await api.post("/pass_chg", {
        user_email: userData.email,
        old_password: old_pass,
        new_password: new_pass,
        confirm_password: confirm_pass,
      });

      if (response.status === 200) {
        // Password updated successfully
        console.log(response.data);
        navigation.navigate("Profile_");
      } else {
        // Other error occurred
        const data = response.data;
        console.log("Password change failed");
      }
    } catch (error) {
      if (error.response) {
        // Request was made and server responded with an error status code
        const errorMessage = error.response.data.Error;
        console.log(errorMessage);
        Alert.alert(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        const errorMessage = error.response.data.error;
        console.log("response request baby");
      } else {
        // Other error occurred
        const errorMessage = error.response.data.error;
        console.log("don't know wtf is happening baby");
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Security & Password</Text>
        <View style={styles.infoContainer}>
          <Image source={{ uri: userData.avatar }} style={styles.Image} />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingTop: Spacing * 3,
            }}
          >
            <Text style={styles.personal_txt}>Old Password</Text>

            <AppTextInput
              placeholder="Password"
              inputMode="password"
              value={old_pass}
              onChangeText={set_old_pass}
            />
          </View>

          <View>
            <Text style={styles.personal_txt}>New Password</Text>

            <AppTextInput
              placeholder="New Password"
              inputMode="password"
              value={new_pass}
              onChangeText={set_new_pass}
            />
          </View>

          <View>
            <Text style={styles.personal_txt}>Confirm Password</Text>

            <AppTextInput
              placeholder="Confirm Password"
              inputMode="password"
              value={confirm_pass}
              onChangeText={set_confirm_pass}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton}>
            <ArrowButton onPress={() => navigation.navigate("Profile_")} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={pass_chng}>
            <Text
              style={{
                fontFamily: Fonts["poppins-bold"],
                color: Colors.onPrimary,
                textAlign: "center",
                fontSize: FontSize.medium,
              }}
            >
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Goals = () => {
  const navigation = useNavigation();
  const { userData, updateUser } = useContext(UserContext);
  const [calories_chg, setcalories_chg] = useState(
    userData.goals.dailyCalorieBurnGoal.toString()
  );
  const [steps_chg, setsteps_chg] = useState(
    userData.goals.dailyStepsGoal.toString()
  );
  const goal_chng = async () => {
    try {
      const response = await api.post("/calories_goal_chg", {
        user_email: userData.email,
        calories_chg,
        steps_chg,
      });

      if (response.status === 200) {
        // Password updated successfully
        console.log(response.data);
        const data = response.data;
        updateUser(data.result);
        navigation.navigate("Profile_");
      } else {
        // Other error occurred
        const data = response.data;
        console.log("Password change failed");
      }
    } catch (error) {
      if (error.response) {
        // Request was made and server responded with an error status code
        const errorMessage = error.response.data.Error;
        console.log(errorMessage);
        Alert.alert(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        const errorMessage = error.response.data.error;
        console.log("response request baby");
      } else {
        // Other error occurred
        const errorMessage = error.response.data.error;
        console.log("don't know wtf is happening baby");
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        paddingBottom: Spacing * 6,
      }}
    >
      <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Goals</Text>
          <View style={styles.infoContainer}>
            <Image source={{ uri: userData.avatar }} style={styles.Image} />
          </View>

          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                paddingTop: Spacing * 3,
                paddingBottom: Spacing * 3,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: FontSize.xxLarge,
                  color: Colors.primary,
                  fontFamily: Fonts["poppins-regular"],
                }}
              >
                {userData.goals.dailyStepsGoal.toString()}
              </Text>
            </View>

            <View>
              <Text style={styles.personal_txt}>Change steps</Text>

              <AppTextInput
                placeholder=""
                value={steps_chg}
                onChangeText={setsteps_chg}
                inputMode="email-address"
              />
            </View>

            <View>
              <Text
                style={[
                  styles.personal_txt,
                  { paddingTop: Spacing * 1, paddingBottom: Spacing * 2 },
                ]}
              >
                Calories burnt
              </Text>

              <Text
                style={{
                  fontSize: FontSize.xxLarge,
                  color: Colors.primary,
                  fontFamily: Fonts["poppins-regular"],
                  textAlign: "center",

                  paddingBottom: Spacing * 2,
                }}
              >
                {userData.goals.dailyCalorieBurnGoal.toString()}
              </Text>

              <View>
                <Text style={styles.personal_txt}>Change calories burn</Text>

                <AppTextInput
                  placeholder=""
                  value={calories_chg}
                  onChangeText={setcalories_chg}
                  inputMode="email-address"
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton}>
              <ArrowButton onPress={() => navigation.navigate("Profile_")} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={goal_chng}>
              <Text
                style={{
                  fontFamily: Fonts["poppins-bold"],
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.medium,
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Avatar_scrn = () => {
  const navigation = useNavigation();
  const { userData, updateUser } = useContext(UserContext);
  const [image_data, setimage_data] = useState([]);
  const [prof_avatar, set_prof_avatar] = useState();
  useEffect(() => {
    api
      .get("/avatars_array")
      .then((response) => {
        const avatar_array = response.data;
        console.log(response.data);

        setimage_data(avatar_array);
      })
      .catch((error) => {
        console.error("Error fetching image data:", error);
      });
  }, []);

  const Avatar_chg = useCallback(() => {
    console.log(prof_avatar);
    api
      .post("/avatar_chg", { user_email: userData.email, prof_avatar })
      .then((response) => {
        console.log("Image URL sent to the server:", prof_avatar);
        const data = response.data;

        updateUser(data.result);
        navigation.navigate("Profile_");
      })
      .catch((error) => {
        console.error("Error sending image URL:", error);
      });
  }, [userData.email, prof_avatar]);

  const render_array = ({ item }) => (
    <View style={{ flex: 1, flexDirection: "column", margin: 5 }}>
      <TouchableOpacity onPress={() => set_prof_avatar(item.url)}>
        <Image
          style={prof_avatar === item.url ? styles.Imagev2 : styles.Image}
          source={{ uri: item.url }}
        />
      </TouchableOpacity>
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{ paddingRight: Spacing * 1.6 }}
            onPress={Avatar_chg}
          >
            <MaterialCommunityIcons name="check" size={24} color="grey" />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, Avatar_chg]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: Spacing * 9,
      }}
    >
      {/* <ScrollView contentContainerStyle={styles.scrollViewContainer}> */}
      <View
        style={{
          width: "100%",
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 8,
          paddingBottom: Spacing * 5,
        }}
      >
        <Text style={styles.titlev2}>Choose Your Avatar</Text>
        <View
          style={{ ...styles.separator, marginBottom: Spacing, height: 1 }}
        />

        <FlatList
          data={image_data}
          renderItem={render_array}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  Image: {
    // marginRight:Spacing*2,
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: "contain",
  },
  Imagev2: {
    // marginRight:Spacing*2,
    width: 100,
    height: 100,
    borderRadius: 20,
    resizeMode: "contain",
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  contentContainer: {
    width: "100%",
    paddingHorizontal: Spacing * 2,
    paddingTop: Spacing * 8,
    paddingBottom: Spacing * 5,
    alignItems: "center",
  },
  title: {
    alignSelf: "flex-start",
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    fontFamily: Fonts["poppins-bold"],
    marginBottom: Spacing * 3,
  },
  titlev2: {
    alignSelf: "center",
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    fontFamily: Fonts["poppins-bold"],
    marginBottom: Spacing * 3,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: Spacing * 3,
  },
  backButton: {
    padding: Spacing * 1.5,
    height: Spacing * 6,
    backgroundColor: Colors.primary,
    marginVertical: Spacing * 1,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  saveButton: {
    padding: Spacing * 1.5,
    height: Spacing * 6,
    backgroundColor: Colors.primary,
    marginVertical: Spacing * 1,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  saveButtonText: {
    fontFamily: Fonts["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.medium,
  },
  personal_txt: {
    fontSize: FontSize.small,
    color: Colors.primary,
    fontFamily: Fonts["poppins-regular"],
  },

  Logout_btn: {
    padding: Spacing * 1.5,
    height: Spacing * 6,
    backgroundColor: "red",
    marginVertical: Spacing * 5,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  separator: {
    height: 3,
    alignSelf: "flex-start",
    padding: 0,
    backgroundColor: Colors.accent,
    marginBottom: 24,
    width: "100%",
    borderRadius: Spacing,
  },
});

const App = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile_" component={ProfileScreen} />

      <Stack.Screen name="Personal_info" component={Personal_info} />
      <Stack.Screen name="Password_chg" component={Password_chg} />
      <Stack.Screen name="Goals" component={Goals} />
      <Stack.Screen
        name="Avatar"
        component={Avatar_scrn}
        options={{
          headerShown: true,
          title: "Change Avatar",
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: {
            paddingTop: 5,
            fontFamily: Fonts["poppins-regular"],
            color: Colors.onPrimary,
          },
          headerTintColor: "grey",
          headerStatusBarHeight: Spacing * 3.5,
          tabBarVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
