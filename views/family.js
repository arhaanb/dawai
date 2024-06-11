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
	Modal,
	Pressable,
	Alert
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import axios from 'axios'
import Loading from './loading'
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

const Pill = ({ med }) => {
	return (
		<View
			style={{
				backgroundColor: 'white',
				borderRadius: 20,
				padding: 20,
				display: 'flex',
				justifyContent: 'space-between',
				flexDirection: 'row',
				alignItems: 'center'
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
		</View>
	)
}

export default function App({ route, navigation }) {
	const [refreshing, setRefreshing] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [responseData, setResponseData] = React.useState(null)

	const [image, setImage] = useState(null)

	const [type, setType] = useState(CameraType.back)
	const [permission, requestPermission] = Camera.useCameraPermissions()

	takePicture = () => {
		if (this.camera) {
			this.camera.takePictureAsync({
				onPictureSaved: this.onPictureSaved,
				base64: true,
				quality: 0.2
			})
		}
	}

	onPictureSaved = (photo) => {
		setLoading(true)
		// .post('http://192.168.2.131:8080/', {
		axios
			.post('https://dawai-api.onrender.com/', {
				// img: `data:image/jpg;base64,${photo.base64}`
				img: photo.base64
			})
			.then((res) => {
				setResponseData(res.data.jsonObject)
				console.log(res.data)
				setLoading(false)
			})
			.catch((err) => {
				console.log(err)
				setResponseData({ error: 'an error occured' })
			})
		// console.log(`data:image/jpg;base64,${photo.base64}`)
	}

	function toggleCameraType() {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		)
	}

	const onRefresh = React.useCallback(async () => {
		setRefreshing(true)

		console.log({ finalspdc: storage.getString('sp_dc') })
		console.log({ finaltoken: storage.getString('accessToken') })
		getInitialData()
		setTimeout(function () {
			setRefreshing(false)
		}, 500)

		if (!__DEV__) {
			StoreReview.requestReview()
		}
	}, [])

	const logout = () => {
		storage.set('loggedIn', false)
		navigation.navigate('Home')
	}

	const [fam, setFam] = useState([])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setFam(JSON.parse(storage.getString('family')))
			// getInitialData()
		})

		return unsubscribe
	}, [navigation])

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

	const [modalVisible, setModalVisible] = useState(false)

	return (
		<Layout navigation={navigation}>
			<View style={styles.container}>
				<View style={{ flex: 1 }}>
					<ScrollView
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								progressViewOffset={35}
								tintColor={'#eaeaea'}
							/>
						}
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

									<Modal
										animationType="slide"
										transparent={true}
										visible={modalVisible}
										onRequestClose={() => {
											setModalVisible(!modalVisible)
										}}
									>
										<View style={styles.centeredView}>
											<View style={[styles.modalView]}>
												{/* <Text style={styles.modalText}>Hello World!</Text> */}

												{!loading && !responseData ? (
													<>
														<TouchableOpacity
															style={{
																display: 'flex',
																alignItems: 'flex-end',
																width: '100%'
															}}
															onPress={toggleCameraType}
														>
															<Text
																style={{
																	color: '#222',
																	fontSize: 16,
																	fontFamily: 'HelveticaBold'
																}}
															>
																Flip camera
															</Text>
														</TouchableOpacity>
														<Camera
															ref={(ref) => {
																this.camera = ref
															}}
															style={styles.camera}
															type={type}
														>
															<Text style={styles.text}>{'\n\n\n\n'}</Text>
														</Camera>

														<TouchableOpacity onPress={this.takePicture}>
															<Text style={{ fontSize: 30, marginVertical: 5 }}>
																Click picture
															</Text>
														</TouchableOpacity>
													</>
												) : null}

												{loading ? <Loading /> : null}

												{responseData && !loading ? (
													<ScrollView
														style={{
															paddingHorizontal: 20,
															paddingVertical: 10
														}}
													>
														{Object.entries(responseData).map(
															(entry, index) => {
																const key = entry[0]
																const value = entry[1]
																return (
																	<View
																		style={{ marginBottom: 20 }}
																		key={index}
																	>
																		<Text
																			style={{
																				fontWeight: 'bold',
																				marginBottom: 5
																			}}
																		>
																			{key}
																		</Text>
																		{key === 'schedule' ? (
																			renderSchedule(value)
																		) : Array.isArray(value) ? (
																			<View>
																				{value.map((item, idx) => (
																					<Text
																						key={idx}
																						style={{
																							marginLeft: 10,
																							marginBottom: 3
																						}}
																					>
																						- {item}
																					</Text>
																				))}
																			</View>
																		) : (
																			<Text style={{ marginLeft: 10 }}>
																				{value}
																			</Text>
																		)}
																	</View>
																)
															}
														)}
													</ScrollView>
												) : null}

												<Pressable
													style={[
														styles.button,
														styles.buttonClose,
														{ marginTop: 10 }
													]}
													onPress={() => {
														setModalVisible(!modalVisible)
														setLoading(false)
														setResponseData(null)
													}}
												>
													<Text style={[styles.textStyle]}>Close</Text>
												</Pressable>
											</View>
										</View>
									</Modal>

									<Text
										style={{
											marginTop: 20,
											fontSize: 24,
											fontFamily: 'HelveticaBold'
										}}
									>
										Your Family
									</Text>

									<View style={{ display: 'flex', gap: 15, marginTop: 20 }}>
										{fam.map((m, i) => {
											return (
												<View key={i}>
													<View
														style={{
															marginBottom: 10,
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'space-between',
															alignItems: 'center'
														}}
													>
														<Text
															style={{
																fontFamily: 'HelveticaBold',
																fontSize: 20
															}}
														>
															{m.name}
														</Text>

														<TouchableOpacity
															onPress={() => {
																axios
																	.get('https://dawai-api.onrender.com/email')
																	.then((res) => {
																		console.log(res.data)
																	})
																	.catch((err) => {
																		console.log(err)
																	})

																Alert.alert(
																	`Reminder sent to ${m.name}`,
																	`An email was sent to ${m.name}`,
																	[
																		{
																			text: 'Cancel',
																			onPress: () =>
																				console.log('Cancel Pressed'),
																			style: 'cancel'
																		},
																		{
																			text: 'OK',
																			onPress: () => console.log('OK Pressed')
																		}
																	]
																)
															}}
														>
															<Text
																style={{
																	fontFamily: 'Helveticareg',
																	fontSize: 14,
																	textAlign: 'right'
																}}
															>
																Send reminder &rarr;
															</Text>
														</TouchableOpacity>
													</View>

													<View style={{ display: 'flex', gap: 10 }}>
														{m.meds
															? m.meds.map((m, i) => {
																	return (
																		<View key={i}>
																			<Pill med={m} />
																		</View>
																	)
															  })
															: null}
													</View>
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
