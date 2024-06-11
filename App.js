import React, { useState, useEffect, useCallback } from 'react'
import { View, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import { storage } from './storage'

LogBox.ignoreLogs([
	'Sending `onAnimatedValueUpdate` with no listeners registered.'
])

//routes
import Home from './views/home'
import Activity from './views/activity'
import Family from './views/family'
import Settings from './views/settings'
import Siri from './views/siri'

import AddMed from './views/addmedicine'
// import HelloWidgetPreview from './HelloWidgetPreviewScreen'

const Stack = createStackNavigator()

function App() {
	const [initialDataLoaded, setInitialDataLoaded] = useState(false)
	const [loggedIn, setLoggedIn] = useState(false)

	const [fontsLoaded] = useFonts({
		HelveticaBold: require('./assets/fonts/helveticanowbold.otf'),
		HelveticaReg: require('./assets/fonts/HelveticaNowDisplay-Regular.otf'),
		HelveticaMed: require('./assets/fonts/HelveticaNowDisplay-Medium.otf')
	})

	useEffect(() => {
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
	}, [])

	useEffect(() => {
		getInitialData()
	}, [])

	const getInitialData = async () => {
		if (storage.getString('accessToken')) {
			setLoggedIn(true)
		} else {
			setLoggedIn(false)
		}

		setInitialDataLoaded(true)
	}

	const handleLogout = () => {
		setLoggedIn(false)
	}

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded && initialDataLoaded) {
			await SplashScreen.hideAsync()
		}
	}, [fontsLoaded, initialDataLoaded])

	if (!fontsLoaded) {
		return null
	} else {
		return (
			<View
				style={{
					flex: 1
				}}
				onLayout={onLayoutRootView}
			>
				<NavigationContainer>
					<Stack.Navigator
						{...{ initialRouteName: loggedIn ? 'Activity' : 'Home' }}
						screenOptions={{
							headerShown: false,
							cardStyle: { backgroundColor: '#FFFFFF', opacity: 1 }
						}}
					>
						<Stack.Screen
							name="Home"
							options={{
								gestureEnabled: false
							}}
							component={Home}
						/>
						<Stack.Screen
							name="Activity"
							component={Activity}
							options={{
								gestureEnabled: false
							}}
						/>

						<Stack.Screen name="AddMed" component={AddMed} />
						<Stack.Screen name="Family" component={Family} />
						<Stack.Screen name="Settings" component={Settings} />
						<Stack.Screen name="Siri" component={Siri} />
					</Stack.Navigator>
				</NavigationContainer>
			</View>
		)
	}
}

export default App
