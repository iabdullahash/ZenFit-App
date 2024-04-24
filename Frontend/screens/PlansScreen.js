import React, { useState, useEffect,useCallback } from 'react';
import { View, Text,TextInput,Alert, StyleSheet,Button, Image, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from '../constants/Colors';
import Spacing from '../constants/Spacing';
import Fonts from '../constants/Fonts';
import FontSize from '../constants/FontSize';
import api from "../config/api/index";
import Animated, {FadeInUp,FadeInDown, FadeInRight , FadeInLeft} from 'react-native-reanimated';
import AppTextInput from '../components/AppTextInput';
import { useContext } from "react";
import { UserContext } from "../config/global/UserContext";


const Stack = createStackNavigator();


const PlansScreen = () => {
  const navigation = useNavigation();
  const { userData, updateUser } = useContext(UserContext);
  const [mealPlans, setMealPlans] = useState([]);

  const [customPlans, setCustomPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const fetchMealPlans = async () => {
    try {
      const response = await api.get('/meal_plans');
      // console.log(response.data)
      const data = await response.data;
      setMealPlans(data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };
  const fetchCustomPlans = async () => {
    try {
      const response = await api.get('/custom_plans', {
        params: { email: userData.email }
      });
      const data = await response.data;
      setCustomPlans(data);
    } catch (error) {
      console.error('Error fetching custom plans:', error);
    }
  };
  

  const fetchWorkoutPlans = async () => {
    try {
      const response = await api.get('/workout_plans');
      const data = await response.data;
      setWorkoutPlans(data);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  useEffect(() => {
    fetchMealPlans();
    fetchWorkoutPlans();
    fetchCustomPlans();
  }, []);

  const [filter, setFilter] = useState('All Plans');

  const handlePlanPress = (plan) => {
    navigation.navigate('PlanDetails', { plan });
  };

  const PlanDetailsScreen = ({ route }) => {
    const { plan } = route.params;

    return (
      <SafeAreaView style={{
        backgroundColor: Colors.background,
        flex: 1,
      }}>
        <View style={styles.detailsContainer}>
        <ScrollView style={styles.scrollViewContainer}>
          <Image source={{ uri: plan.image }} style={styles.detailsImage} />
          <View style={styles.detailsContent}>
            <Text style={styles.detailsTitle}>{plan.title}</Text>
            <Text style={styles.detailsDescription}>{plan.details}</Text>
          </View>
          {plan.meals && (
            <View style={styles.mealsContainer}>
              <Text style={styles.mealsTitle}>Weekly Meals</Text>
              {plan.meals.map((meal, index) => (
                <View key={index} style={styles.mealItem}>
                  <Text style={styles.mealDay}>{meal.day}</Text>
                  <Text style={styles.mealType}>Breakfast: <Text style={styles.mealTypeinfo}>{meal.breakfast}</Text></Text>
                  <Text style={styles.mealType}>Lunch: <Text style={styles.mealTypeinfo}>{meal.lunch}</Text></Text>
                  <Text style={styles.mealType}>Dinner: <Text style={styles.mealTypeinfo}>{meal.dinner}</Text></Text>
                  <Text style={styles.snacksTitle}>Snacks:</Text>
                  {meal.snacks.map((snack, snackIndex) => (
                    <Text key={snackIndex} style={styles.snackItem}>{snack}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}
          {plan.workouts && (
            <View style={styles.workoutsContainer}>
              <Text style={styles.workoutsTitle}>Workouts</Text>
              {plan.workouts.map((workout, index) => (
                <View key={index} style={styles.workoutItem}>
                  <Text style={styles.workoutDay}>{workout.day}</Text>
                  <Text style={styles.workoutType}>{workout.type}</Text>
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <View key={exerciseIndex} style={styles.exerciseItem}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      {exercise.sets && exercise.reps ? (
                        <Text style={styles.exerciseSetsReps}>
                          Sets: {exercise.sets}, Reps: {exercise.reps}
                        </Text>
                      ) : (
                        <Text style={styles.exerciseDuration}>Duration: {exercise.duration}</Text>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        </View>
      </SafeAreaView>
    );
  };


  const CreatePlanScreen = () => {
    const { userData, updateUser } = useContext(UserContext);
    const [planType, setPlanType] = useState('meal'); // Default to meal plan

    const [mealPlan, setMealPlan] = useState({
      title: '',
      description: '',
      details: '',
      image:'',
      meals: [{
        day: 'Monday',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      },
      {
        day: 'Tuesday',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      },
      {
        day: 'Wednesday',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      },
      {
        day: 'Thursday',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      },
      {
        day: 'Friday',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      },
      {
        day: 'Saturday',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      },
      {
        day: 'Sunday',
        breakfast: '',
        lunch: '',
        dinner: '',
        snacks: ''
      }]
    });

  const [workoutPlan, setWorkoutPlan] = useState({
    title: '',
    description: '',
    details: '',
    image:'',
    workouts: [{
      day: 'Monday',
      exercises: [{ name: '', duration: '' }]},
      {day: 'Tuesday',
      exercises: [{ name: '', duration: '' }]},
      {day: 'Wednesday',
      exercises: [{ name: '', duration: '' }]},
      {day: 'Thursday',
      exercises: [{ name: '', duration: '' }]},
      {day: 'Friday',
      exercises: [{ name: '', duration: '' }]},
      {day: 'Saturday',
      exercises: [{ name: '', duration: '' }]},
    ]
  });

  const handlePlanTypeChange = (value) => {
    setPlanType(value);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/create_plan', { email:userData.email, planType,mealPlan,workoutPlan });
      console.log(response.data)
      if (response.status === 200) {
        // Successful login
        const data = response.data;
        navigation.navigate('MainPlans');
      } else {
        // Other error occurred
        console.log('Add plan failed');
        Alert.alert('Error', 'Adding failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        // Request was made and server responded with an error status code
        const errorMessage = error.response.data.message;
        Alert.alert('Error', errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error', 'No response from the server. Please try again.');
      } else {
        // Other error occurred
        Alert.alert('Error', 'Adding failed. Please try again.');
      }
    }
  };
  

  const addExercise = (dayIndex) => {
    const newWorkoutPlan = { ...workoutPlan };
    newWorkoutPlan.workouts[dayIndex].exercises.push({ name: '', duration: '' });
    setWorkoutPlan(newWorkoutPlan);
  };

  const renderMealPlanFields = () => {
    
    return (
      <>
        <Text style={styles.label}>Title:</Text>
        <AppTextInput
          value={mealPlan.title}
          onChangeText={(text) => setMealPlan({ ...mealPlan, title: text })}
          inputMode = 'email-address'

        />
        <Text style={styles.label}>Description:</Text>
        <AppTextInput
          value={mealPlan.description}
          onChangeText={(text) => setMealPlan({ ...mealPlan, description: text })}
          inputMode = 'email-address'

        />
        <Text style={styles.label}>Details:</Text>
        <AppTextInput
          value={mealPlan.details}
          onChangeText={(text) => setMealPlan({ ...mealPlan, details: text })}
          inputMode = 'email-address'

        />
        <View style={{ ...styles.separator, marginVertical: Spacing }} />

        <ScrollView>
          {mealPlan.meals.map((meal, dayIndex) => (
            <View key={dayIndex}>
              <Text style={styles.dayLabel}>{meal.day}</Text>
              <Text style={styles.label}>Breakfast:</Text>
              <AppTextInput
                value={meal.breakfast}
                onChangeText={(text) => {
                  const newMealPlan = { ...mealPlan };
                  newMealPlan.meals[dayIndex].breakfast = text;
                  setMealPlan(newMealPlan);
                  inputMode = 'email-address'

                }}
              />
              <Text style={styles.label}>Lunch:</Text>
              <AppTextInput
                value={meal.lunch}
                onChangeText={(text) => {
                  const newMealPlan = { ...mealPlan };
                  newMealPlan.meals[dayIndex].lunch = text;
                  setMealPlan(newMealPlan);
                  inputMode = 'email-address'

                }}
              />
              <Text style={styles.label}>Dinner:</Text>
              <AppTextInput
                value={meal.dinner}
                onChangeText={(text) => {
                  const newMealPlan = { ...mealPlan };
                  newMealPlan.meals[dayIndex].dinner = text;
                  setMealPlan(newMealPlan);
                  inputMode = 'email-address'

                }}
              />
              <Text style={styles.label}>Snacks:</Text>
              <AppTextInput
                value={meal.snacks}
                onChangeText={(text) => {
                  const newMealPlan = { ...mealPlan };
                  newMealPlan.meals[dayIndex].snacks = text;
                  setMealPlan(newMealPlan);
                  inputMode = 'email-address'
                }}
              />
              <View style={{ ...styles.separator, marginBottom: Spacing }} />

            </View>
            
          ))}
        </ScrollView>
      </>
    );
  };

  const renderWorkoutPlanFields = () => {
    return (
      <>
        <Text style={styles.label}>Title:</Text>
        <AppTextInput
          value={workoutPlan.title}
          onChangeText={(text) => setWorkoutPlan({ ...workoutPlan, title: text })}
          inputMode="email-address"
        />
        <Text style={styles.label}>Description:</Text>
        <AppTextInput
          value={workoutPlan.description}
          onChangeText={(text) => setWorkoutPlan({ ...workoutPlan, description: text })}
          inputMode="email-address"
        />
        <Text style={styles.label}>Details:</Text>
        <AppTextInput
          value={workoutPlan.details}
          onChangeText={(text) => setWorkoutPlan({ ...workoutPlan, details: text })}
          inputMode="email-address"
        />
        <View style={{ ...styles.separator, marginVertical: Spacing }} />

        <ScrollView>
          {workoutPlan.workouts.map((workout, dayIndex) => (
            <View key={dayIndex}>
              <Text style={styles.dayLabel}>{workout.day}</Text>
              {workout.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex}>
                  <Text style={styles.label}>Exercise {exerciseIndex + 1}</Text>
                  <AppTextInput
                    value={exercise.name}
                    placeholder='Name'
                    onChangeText={(text) => {
                      const newWorkoutPlan = { ...workoutPlan };
                      newWorkoutPlan.workouts[dayIndex].exercises[exerciseIndex].name = text;
                      setWorkoutPlan(newWorkoutPlan);
                    }}
                    inputMode="email-address"
                  />
                  <Text style={styles.label}>Duration:</Text>
                  <AppTextInput
                    value={exercise.sets}
                    placeholder='Time or Sets & Reps'
                    onChangeText={(text) => {
                      const newWorkoutPlan = { ...workoutPlan };
                      newWorkoutPlan.workouts[dayIndex].exercises[exerciseIndex].sets = text;
                      setWorkoutPlan(newWorkoutPlan);
                    }}
                    inputMode="email-address"

                  />
                  
                </View>
              ))}
              <TouchableOpacity style={styles.addExercise} onPress={() => addExercise(dayIndex)}>
                <Text style={styles.addExerciseText}>+ Add Exercise</Text>
              </TouchableOpacity>
              <View style={{ ...styles.separator, marginBottom: Spacing }} />
            </View>
            
          ))}
        </ScrollView>
      </>
    );
  };

 

  return (
    <View style={{flex: 1,
      backgroundColor: Colors.background,
    paddingHorizontal: Spacing *2,
    paddingTop: Spacing * 3,}}>
      <Text style={styles.heading}>Create Plan</Text>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Select Plan Type:</Text>
          <View
          style={{
            paddingHorizontal: Spacing,
            paddingVertical: Spacing * 2,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <TouchableOpacity
            onPress={() => handlePlanTypeChange('meal')}
            style={{
              backgroundColor: planType === 'meal' ? Colors.primary: Colors.accent,
              paddingVertical: Spacing ,
              paddingHorizontal: Spacing ,
              width: "40%",
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              elevation:1,
              shadowRadius: Spacing,
              marginRight: 20
            }}
          >
            <Text
              style={{
                fontFamily: Fonts["poppins-semiBold"],
                color: Colors.onPrimary,
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Meal Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePlanTypeChange('workout')}
            style={{
              backgroundColor: planType === 'workout' ? Colors.primary: Colors.accent,
              paddingVertical: Spacing ,
              paddingHorizontal: Spacing ,
              width: "50%",
              borderRadius: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts["poppins-semiBold"],
                color: Colors.text,
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Workout Plan
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => handlePlanTypeChange('meal')}>
            <Text style={[styles.planType, planType === 'meal' && styles.activePlan]}>Meal Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePlanTypeChange('workout')}>
            <Text style={[styles.planType, planType === 'workout' && styles.activePlan]}>Workout Plan</Text>
          </TouchableOpacity> */}
          </View>
          <View style={{ ...styles.separator, marginBottom: Spacing }} />
          {planType === 'meal' ? renderMealPlanFields() : renderWorkoutPlanFields()}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Create Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

  const PlansListScreen = () => {
    const allPlans = [...mealPlans, ...workoutPlans,...customPlans];

    const filteredPlans = filter === 'All Plans' ? allPlans :
      filter === 'Meal Plans' ? mealPlans :
      filter === 'Workout Plans' ? workoutPlans:
      customPlans;

    const renderPlan = ({ item }) => (
      <Animated.View entering={FadeInDown.delay(400).duration(500)} exiting={FadeInUp.delay(400).duration(500)}>
      <TouchableOpacity style={styles.planContainer} onPress={() => navigation.navigate('PlanDetails', {plan: item })}>
        <Image source={{uri : item.image}} style={styles.planImage} />
        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planDescription}>{item.description}</Text>
      </TouchableOpacity>
      </Animated.View>
    );

    return (
      <SafeAreaView style={{
        backgroundColor: Colors.background,
        flex: 1,
        // alignItems:'center',
        // justifyContent:'center'
      }}>
      <View style={styles.container}>
      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={styles.heading}>Plans</Text>
        <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Create Plan')}
          >
            <Text style={styles.addButtonText}>+ Create Plan</Text>
          </TouchableOpacity>
      </View>

        <View style={{ ...styles.separator, marginBottom: Spacing * 1.5 }} />
              <View style={styles.filterContainer}>
        <FlatList
          data={['All Plans', 'Meal Plans', 'Workout Plans', 'My Plans']}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterButton, filter === item && styles.activeFilterButton]}
              onPress={() => {
                setFilter(item);
                if (item === 'Workout Plans') {
                  fetchWorkoutPlans();
                } else {
                  fetchCustomPlans();
                }
              }}
            >
              <Text style={[styles.filterButtonText, filter === item && styles.activeFilterButtonText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
        <View style={styles.contentcontainer}>
        <FlatList
          data={filteredPlans}
          renderItem={renderPlan}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
        </View>
      </View>
      </SafeAreaView>
    );
  };

  

  return (
    <SafeAreaView style={{flex: 1,
      backgroundColor: Colors.background,
      paddingTop: Spacing * 3,
      paddingBottom: Spacing * 8}}>
      <Stack.Navigator>
        <Stack.Screen name="MainPlans" component={PlansListScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="PlanDetails"
          component={PlanDetailsScreen}
          options={{
            headerTransparent: true,
            headerBackground: () => <View style={styles.headerBackground} />,
            headerStatusBarHeight:5,
            headerTintColor: Colors.onPrimary,
            headerTitleStyle: {
              fontSize: FontSize.large,
              fontFamily: Fonts['poppins-bold'],
              alignSelf: 'center',
              color: Colors.onPrimary,
              textAlignVertical: 'center',
            },
            headerTitleAlign: 'left',
          }}
        />
        <Stack.Screen
          name="Create Plan"
          component={CreatePlanScreen}
          options={{title:'Create Plan',headerStyle:{backgroundColor:Colors.background,},headerTitleStyle:{paddingTop:5,fontFamily:Fonts['poppins-regular'],color:Colors.onPrimary},headerTintColor: 'grey',headerStatusBarHeight:Spacing,tabBarVisible: false}}
        />
      </Stack.Navigator>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing *2,
    paddingTop: Spacing * 3,
    paddingBottom: Spacing * 8
  },
  contentcontainer: {
    paddingBottom:Spacing*7
  },
  separator: {
    height: 3,
    alignSelf: 'flex-start',
    padding: 0,
    backgroundColor: Colors.accent,
    marginBottom: 24,
    width: '100%',
    borderRadius: Spacing
  },
  addButton: {
    height: Spacing*4,
    flexDirection:'row',
    alignItems:'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary
  },
  addButtonText: {
    fontFamily: Fonts["poppins-bold"],
    fontSize: FontSize.medium,
    color: Colors.onPrimary,
  },
  heading: {
    fontFamily: Fonts["poppins-bold"],
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    // paddingHorizontal:Spacing*1.6,
    marginBottom: Spacing * 1.6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 8,
    padding: Spacing,
    marginBottom: Spacing,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: Spacing * 1.6,
    marginBottom: Spacing * 1.6,
  },
  filterButton: {
    paddingVertical: Spacing,
    paddingHorizontal: Spacing * 2,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    marginRight: Spacing * 0.8,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    fontSize: FontSize.small,
  },
  filterButtonText: {
    fontFamily: Fonts['poppins-regular'],
    color: Colors.onPrimary,
  },
  activeFilterButtonText: {
    color: Colors.background,
  },
  headerBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%',
    height: Spacing * 5.9,
  },
  planContainer: {
    width: '100%',
    marginBottom: Spacing * 1.6,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    padding: Spacing * 1.6,
  },
  planImage: {
    width: '100%',
    height: 170,
    marginBottom: Spacing * 1.2,
    borderRadius: 8,
  },
  planTitle: {
    fontSize: FontSize.large,
    fontFamily: Fonts['poppins-bold'],
    color: Colors.onPrimary,
    marginBottom: 8,
  },
  planDescription: {
    fontFamily: Fonts['poppins-regular'],
    color: Colors.text,
    fontSize: FontSize.small,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsImage: {
    width: '100%',
    height: 270,
    marginBottom: Spacing*0.5,
    borderRadius: 0,
  },
  detailsContent: {
    flex: 1,
    paddingHorizontal:Spacing*2
  },
  detailsTitle: {
    width:'100%',
    fontSize: 25,
    borderBottomWidth:3,
    borderBottomColor:Colors.primary,
    fontFamily: Fonts['poppins-bold'],
    marginBottom:Spacing,
    color: Colors.onPrimary,
    paddingVertical:Spacing,
    alignSelf:'flex-start'
    
  },
  detailsDescription: {
    fontFamily: Fonts['poppins-regular'],
    color: Colors.text,
    fontSize: FontSize.medium,
    textAlign: 'left',
  },
  mealsContainer: {
    marginTop: Spacing*1.6,
    paddingHorizontal: Spacing*2
  },
  mealsTitle: {
    fontSize: 25,
    fontFamily: Fonts['poppins-bold'],
    color:Colors.onPrimary,
    borderBottomWidth:2,
    borderBottomColor: Colors.primary,
    marginBottom: Spacing*2,
    paddingBottom:Spacing*0.5
  },
  mealItem: {
    marginBottom: Spacing*1.6,
  },
  mealDay: {
    fontSize: FontSize.large,
    fontFamily: Fonts['poppins-bold'],
    color:Colors.onPrimary,
    borderBottomWidth:2,
    textAlign:'center',
    borderBottomColor: Colors.primary,
    paddingBottom:Spacing,
    marginBottom: 8,
  },
  mealType: {
    color: Colors.onPrimary,
    fontFamily: Fonts['poppins-semiBold'],
    fontSize: 18,
    marginBottom: 8,
  },
  mealTypeinfo: {
    color: Colors.text,
    fontFamily: Fonts['poppins-regular'],
    fontSize: FontSize.medium,
    marginBottom: 8,
  },
  snacksTitle: {
    fontSize: FontSize.medium,
    fontFamily: Fonts['poppins-semiBold'],
    color:Colors.onPrimary,
    marginBottom: 8,
  },
  snackItem: {
    color: "lightgrey",
    fontFamily: Fonts['poppins-regular'],
    fontSize: FontSize.small,
    marginBottom: 8,
  },
  workoutsContainer: {
    marginTop: Spacing*1.6,
    paddingHorizontal:Spacing*2
  },
  workoutsTitle: {
    fontSize: 25,
    fontFamily: Fonts['poppins-bold'],
    color:Colors.onPrimary,
    borderBottomWidth:2,
    borderBottomColor: Colors.primary,
    marginBottom: Spacing*2,
    paddingBottom:Spacing*0.5
  },
  workoutItem: {
    marginBottom: 16,
  },
  workoutDay: {
    fontSize: FontSize.large,
    fontFamily: Fonts['poppins-bold'],
    color:Colors.onPrimary,
    borderBottomWidth:2,
    textAlign:'center',
    borderBottomColor: Colors.primary,
    paddingBottom:Spacing,
    marginBottom: Spacing*1.5,
  },
  workoutType: {
    color: Colors.onPrimary,
    fontFamily: Fonts['poppins-bold'],
    fontSize: 18,
    textDecorationLine:"underline",
    marginBottom: 8,
  },
  exerciseItem: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: FontSize.medium,
    fontFamily: Fonts['poppins-regular'],
    color:Colors.onPrimary,
    marginBottom: 8,
  },
  exerciseSetsReps: {
    color: "lightgrey",
    fontFamily: Fonts['poppins-regular'],
    fontSize: FontSize.small,
    marginBottom: 8,
  },
  exerciseDuration: {
    color: "lightgrey",
    fontFamily: Fonts['poppins-regular'],
    fontSize: FontSize.small,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: Spacing,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts['poppins-bold'],
    fontSize: FontSize.medium,
    color: Colors.onPrimary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 50, // Adjust as needed to prevent content from being hidden by the footer
  },

  form: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.medium,
    color: Colors.primary,
    fontFamily: Fonts["poppins-regular"],
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  planType: {
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activePlan: {
    backgroundColor: '#e6f7ff',
  },
  dayLabel: {
    fontSize: FontSize.large,
    color: Colors.onPrimary,
    fontFamily: Fonts["poppins-bold"],
    marginTop: 20,
    marginBottom: 10,
  },
  addExercise: {
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addExerciseText: {
    fontFamily: Fonts["poppins-bold"],
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  submitButton: {
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
  submitText: {
    fontFamily: Fonts["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },

});

export default PlansScreen;
