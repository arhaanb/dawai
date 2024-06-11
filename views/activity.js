import React, { useState, useEffect } from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	ScrollView,
	BackHandler,
	RefreshControl,
	StyleSheet,
	Alert
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import * as StoreReview from 'expo-store-review'
import { storage } from '../storage.js'
import * as ImagePicker from 'expo-image-picker'
import { Camera, CameraType } from 'expo-camera'
import Layout from '../components/layout.jsx'

const getDay = () => {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	]
	const dayName = days[new Date().getDay()]
	return dayName
}

const renderSchedule = (schedule) => {
	return (
		<View>
			{Object.entries(schedule).map(([day, times], idx) => (
				<View key={idx}>
					<Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{day}</Text>
					{times.map((time, index) => (
						<Text key={index} style={{ marginLeft: 20 }}>
							{time}
						</Text>
					))}
				</View>
			))}
		</View>
	)
}

const Pill = ({ med, delFunction }) => {
	return (
		<TouchableOpacity
			style={{
				backgroundColor: 'white',
				borderRadius: 20,
				padding: 20,
				display: 'flex',
				justifyContent: 'space-between',
				flexDirection: 'row',
				alignItems: 'center'
			}}
			onPress={() => {
				Alert.alert(
					'Mark as complete?',
					`Are you sure you want to mark ${med.medicine} as complete?`,
					[
						{
							text: 'Cancel',
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel'
						},
						{
							text: 'OK',
							onPress: () => {
								delFunction()
							}
						}
					]
				)
			}}
		>
			<View
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'row',
					gap: 15
				}}
			>
				<Image
					style={{
						height: 30,
						width: 30
					}}
					source={require('../assets/mealicons/pill.png')}
				/>
				<View style={{ width: '60%' }}>
					<Text
						numberOfLines={2}
						style={{
							fontFamily: 'HelveticaBold',
							fontSize: 14
						}}
					>
						{med?.medicine || '??'}
					</Text>
					<Text
						numberOfLines={2}
						style={{ fontFamily: 'HelveticaReg', fontSize: 12 }}
					>
						{med?.usage || 'Unavailable'}
					</Text>
				</View>
			</View>
			<View>
				<Text
					style={{
						fontFamily: 'HelveticaReg',
						fontSize: 14,
						textAlign: 'right'
					}}
				>
					Next intake
				</Text>
				<Text
					style={{
						fontFamily: 'HelveticaBold',
						fontSize: 20,
						marginBottom: -5,
						textAlign: 'right'
					}}
				>
					{med.schedule[getDay()][0] || 'Done!'}
				</Text>
			</View>
		</TouchableOpacity>
	)
}

export default function App({ route, navigation }) {
	// React.useEffect(() => {
	// 	const subscription = addShortcutListener(({ userInfo, activityType }) => {
	// 		if (activityType == 'com.arhaanb.dawai.ShowMySchedule') {
	// 			navigation.navigate('Activity')
	// 		} else if (activityType == 'com.arhaanb.dawai.AddAMedicine') {
	// 			// navigation.navigate('Present')
	// 			console.log('hi')
	// 		}
	// 	})

	// 	return () => {
	// 		subscription.remove()
	// 	}
	// }, [])

	const [mymeds, setMyMeds] = useState([])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setMyMeds(JSON.parse(storage.getString('mymeds')))
			console.log('everyday')
		})

		return unsubscribe
	}, [navigation])

	const [rerender, setRerender] = useState(false)

	useEffect(() => {
		const backAction = () => {
			return true
		}

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		)

		return () => backHandler.remove()
	}, [])

	return (
		<Layout navigation={navigation}>
			<View style={styles.container}>
				<View style={{ flex: 1 }}>
					<ScrollView
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						style={{ backgroundColor: '#FEE0E1' }}
					>
						<StatusBar style="light" backgroundColor={'#222222'} />

						<View
							style={{
								flex: 1,
								paddingBottom: 40
							}}
						>
							<View style={{ marginTop: 0 }}>
								<View
									style={{
										paddingTop: hp('6.5%'),
										marginBottom: 20,
										paddingHorizontal: 35
									}}
								>
									<View
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center'
										}}
									>
										<Image
											style={{
												height: 138 * 0.2,
												width: 515.12 * 0.2
											}}
											source={require('../assets/icons/brand.png')}
										/>

										<TouchableOpacity
											onPress={() => {
												navigation.navigate('Settings')
											}}
										>
											<View
												style={{
													height: 30,
													width: 30,
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													marginBottom: 8,
													borderRadius: 4
												}}
											>
												<Image
													style={{
														height: 30,
														width: 30,
														borderRadius: 100
													}}
													source={{ uri: 'https://arhaanb.com/new_me.jpeg' }}
												/>
											</View>
										</TouchableOpacity>
									</View>

									<Text
										style={{
											marginTop: 20,
											fontSize: 24,
											fontFamily: 'HelveticaBold'
										}}
									>
										Today's Medicines
									</Text>

									<View
										key={rerender}
										style={{ display: 'flex', gap: 15, marginTop: 20 }}
									>
										{mymeds.map((m, i) => {
											return (
												<View key={i}>
													<Pill
														med={m}
														delFunction={() => {
															console.log(i)
															const dawg = mymeds
															dawg.splice(i, 1)
															setMyMeds(dawg)
															storage.set('mymeds', JSON.stringify(dawg))
															setRerender((prevState) => !prevState)
															console.log('bhai')
															console.log(mymeds)
														}}
													/>
												</View>
											)
										})}
									</View>
									<Text>{'\n\n\n'}</Text>
								</View>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
		</Layout>
	)
}

const styles = StyleSheet.create({
	camera: {
		flex: 1,
		width: '100%'
	},
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'transparent',
		margin: 64
	},
	button: {
		flex: 1,
		alignSelf: 'flex-end',
		alignItems: 'center'
	},
	text: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white'
	},
	container: {
		flex: 1
	},
	contentContainer: {
		flex: 1,
		borderTopStartRadius: 20,
		borderTopEndRadius: 20,
		paddingTop: 30,
		marginBottom: -2
	},
	closeLineContainer: {
		alignSelf: 'center'
	},
	closeLine: {
		width: 50,
		height: 4,
		borderRadius: 3,
		backgroundColor: '#fff',
		opacity: 0.8,
		marginBottom: 8
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		width: '90%',
		height: '70%',
		alignItems: 'center',
		borderColor: 'black',
		borderWidth: 2
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	buttonOpen: {
		backgroundColor: '#F194FF'
	},
	buttonClose: {
		backgroundColor: '#2196F3'
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center'
	}
})
