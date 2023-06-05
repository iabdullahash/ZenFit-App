import { StatusBar } from 'expo-status-bar';
import { useEffect,useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GoogleFit, { Scopes } from 'react-native-google-fit';

export default function App() {
  var [dailySteps, setdailySteps] = useState(0);
  var [heartRate, setHeartRate] = useState(0);
  var [calories, setCalories] = useState(0);
  var [hydration, setHydration] = useState(0);
  var [sleep, setSleep] = useState(0);
  var [weight, setWeight] = useState(0);
  var [bloodPressure, setBloodPressure] = useState({});
  var [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState('');
  

  useEffect(() => {
    getAllDataFromAndroid();
    
    // fetchStepsData();
    // fetchCaloriesData();
    }, []);


    
    
    const fetchStepsData = async (opt) => {
      const res = await GoogleFit.getDailyStepCountSamples(opt);
      if (res.length !== 0) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].source === 'com.google.android.gms:estimated_steps') {
            let data = res[i].steps.reverse();
            dailyStepCount = res[i].steps;
            setdailySteps(data[0].value);
            return
          }
        }
      } else {
        console.log('Not Found');
      }
    };
    
    const fetchCaloriesData = async (opt) => {
      const res = await GoogleFit.getDailyCalorieSamples(opt);
      let data = res.reverse();
      if (data.length === 0) {
        setCalories('Not Found');
      } else {
        setCalories(Math.round(data[0].calorie * 1 * 100) / 100);
        console.log(data)
      }
    };
    
    const getAllDataFromAndroid = () =>{
    const options = {
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
    var today = new Date();
    var lastWeekDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 8,
    );
    
    const opt = {
      startDate: lastWeekDate.toISOString(), // required ISO8601Timestamp
      endDate: today.toISOString(), // required ISO8601Timestamp
      bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    
      var authorized = GoogleFit.isAuthorized;
      console.log(authorized);
      if (authorized) {
        fetchStepsData(opt);
        fetchCaloriesData(opt);
      } else {
        // Authentication if already not authorized for a particular device
        GoogleFit.authorize(options)
          .then(authResult => {
            if (authResult.success) {
              console.log('AUTH_SUCCESS');
              fetchStepsData(opt);
              fetchCaloriesData(opt);
  
  
              // if successfully authorized, fetch data
            } else {
              console.log('AUTH_DENIED ' + authResult.message);
            }
          })
          .catch(() => {
            console.log('AUTH_ERROR');
          });
      }
  });
    }

  return (
    <View style={[{flex: 1}]}>
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Step Count - Today</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{dailySteps}</Text>
        </View>
      </View>
 
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Heart Rate</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{heartRate}</Text>
        </View>
      </View>
 
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>BP- Systolic </Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>
            {bloodPressure.systolic}
          </Text>
        </View>
      </View>
 
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>BP - Diastolic </Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>
            {bloodPressure.diastolic}
          </Text>
        </View>
      </View>
 
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Calories</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{calories}</Text>
        </View>
      </View>
 
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Sleep - Today</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{sleep} hours</Text>
        </View>
      </View>
 
      <View style={styles.row}>
        <View style={[styles.row_2, styles.containerBlue]}>
          <Text style={styles.textContainerBlue}>Weight</Text>
        </View>
        <View style={[styles.row_2, styles.containerWhite]}>
          <Text style={styles.textContainerWhite}>{weight} Kg</Text>
        </View>
      </View>
      <View style={styles.row}>
      <TouchableOpacity style={{backgroundColor:"black"}} onPress={getAllDataFromAndroid}>
        <Text>Refresh</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    height: 30,
    margin: 10,
    marginTop: 12,
  },
  rowBlue: {
    padding: 2,
  },
  row_1: {
    flex: 1,
  },
  row_2: {
    flex: 2,
  },
  containerBlue: {
    marginTop: 10,
    height: 50,
    backgroundColor: '#187FA1',
    color: 'white',
  },
  containerWhite: {
    marginTop: 10,
    height: 50,
    backgroundColor: 'white',
    color: '#187FA1',
  },
  textContainerBlue: {
    paddingTop: 15,
    paddingLeft: 15,
    color: 'white',
  },
  textContainerWhite: {
    paddingTop: 15,
    paddingLeft: 70,
    color: '#187FA1',
  },
});
