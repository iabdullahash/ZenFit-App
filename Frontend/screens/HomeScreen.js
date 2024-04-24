import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import { UserContext } from "../config/global/UserContext";
import Colors from "../constants/Colors";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Fonts from "../constants/Fonts";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BarChart, LineChart } from "react-native-chart-kit";
import GoogleFit, { Scopes } from "react-native-google-fit";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import api from "../config/api";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userData } = useContext(UserContext);
  const [calories, setCalories] = useState(0);
  const [dailySteps, setdailySteps] = useState(0);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);

  // const [androidauth, setAndroidAuth] = useState(false)
  // const [time,setTime] = useState(1000);
  const width = Dimensions.get("window").width;

  var today = new Date();
  var lastWeekDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 8
  );

  const opt = {
    startDate: lastWeekDate.toISOString(), // required ISO8601Timestamp
    endDate: today.toISOString(), // required ISO8601Timestamp
    bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
    bucketInterval: 1, // optional - default 1.
  };

  const chartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: weeklyData,
      },
    ],
  };

  // useEffect(() => {
  //   if (GoogleFit.isAuthorized) {
  //     fetchWeeklyData();
  //   }
  // },[fetchWeeklyData])

  useEffect(() => {
    // fetchCaloriesData();
    getAllDataFromAndroid();
    const interval = setInterval(() => {
      // fetchCaloriesData();
      getAllDataFromAndroid();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [dailySteps]);

  const fetchWeeklyData = useCallback(async () => {
    // if (weeklyData.length === 0){/

    const res = await GoogleFit.getDailyStepCountSamples(opt);
    if (res.length !== 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].source === "com.google.android.gms:estimated_steps") {
          // setWeeklyData(res[i].steps)
          let tempchartdata = [0, 0, 0, 0, 0, 0, 0];
          res[i].steps.forEach((dataPoint) => {
            const dayOfWeek = new Date(dataPoint.date).getDay();

            tempchartdata[dayOfWeek] = dataPoint.value;
          });
          setWeeklyData(tempchartdata);
          // console.log(weeklyData)
          // console.log(chartData.datasets)
          return;
        }
      }
    } else {
      console.log("Not Found");
    }
    // }
  }, [weeklyData]);

  const fetchStepsData = useCallback(async () => {
    // console.log('fetch steps called')

    const res = await GoogleFit.getDailyStepCountSamples(opt);
    console.log(res);
    if (res.length !== 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].source === "com.google.android.gms:estimated_steps") {
          // console.log(res[i].steps)
          let data = res[i].steps.reverse();
          dailyStepCount = res[i].steps;
          setdailySteps(data[0].value);
          // console.log(data);
          fetchCaloriesData(data[0].value);
          return;
        }
      }
    } else {
      console.log("Not Found");
    }
  }, [dailySteps]);

  const fetchCaloriesData = useCallback(
    async (steps) => {
      if (steps) {
        try {
          const response = await api.post("/calories", {
            steps,
            weight: userData.weight,
          });
          const data = await response.data;
          setCalories(data);
          userData.calories = data;
          return;
        } catch (error) {
          console.error("Error fetching calories:", error);
          return;
        }
      }
    },
    [calories]
  );

  const getAllDataFromAndroid = useCallback(() => {
    // if (time === 1000){
    //   setTime(10000)
    // }
    const options = {
      clientId:
        "935642738467-0r27k9ie48iif7pvgm7jtk4duevgmhah.apps.googleusercontent.com",
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
        Scopes.FITNESS_BLOOD_PRESSURE_READ,
        Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
        Scopes.FITNESS_BLOOD_GLUCOSE_READ,
        Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
        Scopes.FITNESS_NUTRITION_WRITE,
        Scopes.FITNESS_SLEEP_READ,
      ],
    };
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      console.log(authorized);
      if (authorized) {
        fetchWeeklyData();
        fetchStepsData();
        return;
      } else {
        // Authentication if already not authorized for a particular device
        GoogleFit.authorize(options)
          .then((authResult) => {
            if (authResult.success) {
              console.log("AUTH_SUCCESS");
              fetchWeeklyData();
              fetchStepsData();
              return;
              // if successfully authorized, fetch data
            } else {
              console.log("AUTH_DENIED " + authResult.message);
            }
          })
          .catch(() => {
            console.log("AUTH_ERROR");
          });
      }
    });
  }, [dailySteps]);

  const handlerefresh = () => {
    getAllDataFromAndroid();
    fetchCaloriesData();
  };

  const chartConfig = {
    backgroundColor: Colors.primary,
    backgroundGradientFrom: Colors.primary,
    backgroundGradientTo: Colors.accent,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: Spacing,
    },
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        paddingBottom: Spacing * 8,
      }}
    >
      <ScrollView
        style={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            exiting={FadeInUp.delay(400).duration(500)}
          >
            <View style={styles.profileContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: userData.avatar }}
                  style={styles.profileImage}
                />
                <View style={styles.profileTextContainer}>
                  <Text style={styles.profileText}>Hello</Text>
                  <Text style={styles.profileName}>
                    {userData?.name || "Guest"}
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.profileIconContainer}
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Ionicons name="menu" color={Colors.onPrimary} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          <View style={styles.sectionContainer}>
            <Animated.View entering={FadeInDown.delay(800).duration(500)}>
              <Text style={styles.sectionTitle}>Today's Target</Text>
              <View>
                <TouchableOpacity
                  style={styles.targetContainer}
                  onPress={handlerefresh}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.targetTitle}>Total calories</Text>
                    <Text style={styles.targetValue}>
                      {userData?.goals?.dailyCalorieBurnGoal || "0"}{" "}
                      <Text style={styles.calText}>cal</Text>
                    </Text>
                  </View>

                  <Image
                    source={require("../assets/images/fire.png")}
                    style={styles.targetIcon}
                  />

                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.targetTitle}>Burnt calories</Text>
                    <Text style={styles.targetValue}>
                      {calories} <Text style={styles.calText}>cal</Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(1200).duration(500)}>
              <TouchableOpacity
                style={styles.targetContainer}
                onPress={handlerefresh}
              >
                <View
                  style={{ flexDirection: "column", justifyContent: "center" }}
                >
                  <Text style={styles.targetTitle}>Total steps</Text>
                  <Text style={styles.targetValue}>
                    {userData?.goals?.dailyStepsGoal || "0"}
                  </Text>
                </View>

                <Image
                  source={require("../assets/images/running.png")}
                  style={styles.targetIcon}
                />

                <View
                  style={{ flexDirection: "column", justifyContent: "center" }}
                >
                  <Text style={styles.targetTitle}>Finished steps</Text>
                  <Text style={styles.targetValue}>{dailySteps}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(1600).duration(500)}>
            <View>
              <Text style={styles.sectionTitle}>Activities report</Text>
              {/* <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:Spacing*2}}> */}
              <View style={styles.chartContainer}>
                <LineChart
                  data={chartData}
                  width={380}
                  height={280}
                  chartConfig={chartConfig}
                  bezier
                  withInnerLines={false}
                  withOuterLines={false}
                  yLabelsOffset={20}
                  xLabelsOffset={12}
                  // transparent
                  style={{ marginVertical: 8, ...chartConfig.style }}
                />
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: Spacing * 1.6,
    paddingTop: Spacing * 6,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing * 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileTextContainer: {
    marginLeft: Spacing * 1.6,
  },
  profileText: {
    fontFamily: Fonts["poppins-regular"],
    fontSize: FontSize.small,
    color: Colors.text,
  },
  profileName: {
    fontFamily: Fonts["poppins-semiBold"],
    fontSize: FontSize.medium,
    color: Colors.text,
  },
  profileIconContainer: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 10,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Fonts["poppins-bold"],
    fontSize: FontSize.large,
    color: Colors.text,
    marginBottom: Spacing * 1.5,
  },
  targetContainer: {
    height: Spacing * 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.primary,
    padding: Spacing * 1.2,
    borderRadius: 12,
    marginBottom: Spacing * 1.7,
  },
  targetTitle: {
    // flex: 1,
    fontFamily: Fonts["poppins-regular"],
    fontSize: FontSize.small,
    color: "lightgrey",
  },
  targetIcon: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
    alignSelf: "center",
    tintColor: Colors.accent,
  },
  targetValue: {
    fontFamily: Fonts["poppins-bold"],
    fontSize: 25,
    color: Colors.onPrimary,
  },
  calText: {
    fontFamily: Fonts["poppins-bold"],
    fontSize: 23,
    color: Colors.onPrimary,
  },
  chartContainer: {
    flex: 1,
    marginHorizontal: Spacing * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  graphStyle: {
    marginVertical: 8,
  },
});

export default HomeScreen;
