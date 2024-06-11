import React, { useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Pressable,
	Modal,
	ScrollView,
	Alert
} from 'react-native'
import axios from 'axios'
import Loading from '../views/loading'
import * as StoreReview from 'expo-store-review'
import { storage } from '../storage.js'
import * as ImagePicker from 'expo-image-picker'
import { Camera, CameraType } from 'expo-camera'

const renderSchedule = (schedule) => {
	return (
		<View>
			{Object.entries(schedule).map(([day, times], idx) => (
				<View key={idx}>
					<Text style={{ marginLeft: 10, fontFamily: 'HelveticaBold' }}>
						{day}
					</Text>
					{times.map((time, index) => (
						<Text
							key={index}
							style={{ marginLeft: 20, fontFamily: 'HelveticaReg' }}
						>
							{time}
						</Text>
					))}
				</View>
			))}
		</View>
	)
}

const Navbar = ({ navigation, openModal, setOpenModal }) => {
	const [refreshing, setRefreshing] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [darkMode, setDarkMode] = React.useState(false)
	const [userInfo, setUserInfo] = React.useState(false)
	const [responseData, setResponseData] = React.useState(null)

	const [image, setImage] = useState(null)

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			// allowsEditing: true,
			// aspect: [4, 3],
			quality: 1,
			base64: true
		})

		// console.log(result.assets[0].mimeType)

		if (!result.canceled) {
			setImage(result)
		}
	}

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
		// img: `data:image/jpg;base64,${photo.base64}`
		// .post('http://192.168.2.131:8000/dawai', {
		axios
			.post('https://dawai-api.onrender.com/dawai', {
				img: photo.base64
			})
			.then((res) => {
				setResponseData(res.data.jsonObject)
				console.log(res.data)
				setLoading(false)
			})
			.catch((err) => {
				Alert.alert('An error occured', `${err.message}`, [
					{
						text: 'Cancel',
						onPress: () => console.log('Cancel Pressed'),
						style: 'cancel'
					},
					{
						text: 'OK',
						onPress: () => {}
					}
				])
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

	// const [openModal, setOpenModal] = useState(false)
	return (
		<View style={styles.container}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={openModal}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.')
					setOpenModal(!openModal)
				}}
			>
				<View style={styles.centeredView}>
					<View style={[styles.modalView]}>
						{/* <Text style={styles.modalText}>Hello World!</Text> */}

						<Pressable
							style={[
								{
									marginTop: 10,
									backgroundColor: 'pink',
									aspectRatio: 1,
									width: 30,
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									borderRadius: 100,
									padding: 5,
									position: 'absolute',
									right: 15,
									top: 5
								}
							]}
							onPress={() => {
								setOpenModal(!openModal)
								setLoading(false)
								setResponseData(null)
							}}
						>
							<Text
								style={{
									color: 'white',
									fontSize: 18,
									textAlign: 'center'
								}}
							>
								X
							</Text>
						</Pressable>

						<View>
							<Text
								style={{
									fontSize: 30,
									fontFamily: 'HelveticaBold',
									color: darkMode ? '#fff' : '#222'
								}}
							>
								Analyse Medicine
							</Text>

							<Text
								style={{
									fontSize: 16,
									lineHeight: 23,
									fontFamily: 'HelveticaReg',
									color: '#AFAFAF',
									marginBottom: 0
								}}
							>
								Scan a picture to get medicine details.
							</Text>
						</View>

						{!loading && !responseData ? (
							<>
								<Camera
									ref={(ref) => {
										this.camera = ref
									}}
									style={[
										styles.camera,
										{ borderRadius: 10, marginTop: 10, overflow: 'hidden' }
									]}
									type={type}
								>
									<Text style={styles.text}>{'\n\n\n\n'}</Text>
								</Camera>
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
											fontFamily: 'HelveticaReg'
										}}
									>
										Flip Camera
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										marginTop: 10
									}}
									onPress={this.takePicture}
								>
									<View
										style={{
											aspectRatio: 1,
											width: 60,
											backgroundColor: 'pink',
											borderRadius: 100
										}}
									></View>
									{/* <Text style={{ fontSize: 30, marginVertical: 5 }}>
										Click picture
									</Text> */}
								</TouchableOpacity>
							</>
						) : null}

						{loading ? <Loading /> : null}

						{responseData && !loading ? (
							<>
								<ScrollView style={{ marginVertical: 20 }}>
									{/* <ScrollView> */}
									{Object.entries(responseData).map((entry, index) => {
										const key = entry[0]
										const value = entry[1]
										return (
											<View style={{ marginBottom: 20 }} key={index}>
												<Text
													style={{
														marginBottom: 5,
														fontFamily: 'HelveticaBold',
														textTransform: 'capitalize'
													}}
												>
													{key.split('_').join(' ')}
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
																	marginBottom: 5,
																	textTransform: 'capitalize',
																	fontFamily: 'HelveticaReg'
																}}
															>
																- {item}
															</Text>
														))}
													</View>
												) : (
													<Text
														style={{
															marginLeft: 10,
															fontFamily: 'HelveticaReg'
														}}
													>
														{value}
													</Text>
												)}
											</View>
										)
									})}
									{/* </ScrollView> */}
								</ScrollView>
								{!responseData?.error ? (
									<TouchableOpacity
										style={{
											backgroundColor: '#222',
											padding: 10,
											borderRadius: 8,
											display: 'flex',
											justifyContent: 'space-between',
											flexDirection: 'row'
										}}
										onPress={() => {
											storage.set('medToAdd', JSON.stringify(responseData))
											setOpenModal(false)
											navigation.navigate('AddMed')
										}}
									>
										<Text
											style={{
												color: 'orange',
												fontFamily: 'HelveticaBold',
												fontSize: 20
											}}
										>
											Add to Daw.AI
										</Text>
										<Text
											style={{
												color: 'orange',
												fontFamily: 'HelveticaBold',
												fontSize: 20
											}}
										>
											&rarr;
										</Text>
									</TouchableOpacity>
								) : null}
							</>
						) : null}
					</View>
				</View>
			</Modal>

			<TouchableOpacity
				onPress={() => navigation.navigate('Activity')}
				style={[styles.tab, { zIndex: 3, width: '20%' }]}
			>
				<Image
					style={{
						height: 30,
						width: 30
					}}
					source={require('../assets/mealicons/schedule.png')}
				/>
				<Text style={{ fontFamily: 'HelveticaReg', marginTop: 2 }}>
					My Meds
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => setOpenModal(true)}
				style={[styles.tab, styles.addbtn]}
			>
				<Image
					style={{
						height: 50,
						width: 50,
						borderRadius: 100
					}}
					source={require('../assets/add-btn.png')}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => navigation.navigate('Family')}
				style={[styles.tab, { zIndex: 3, width: '20%' }]}
			>
				<Image
					style={{
						height: 30,
						width: 30
					}}
					source={require('../assets/mealicons/family.png')}
				/>
				<Text style={{ fontFamily: 'HelveticaReg', marginTop: 2 }}>Family</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: 'white',
		paddingVertical: 10,
		paddingHorizontal: 10,
		position: 'absolute',
		bottom: 30,
		left: 20,
		right: 20,
		borderRadius: 200
		// marginBottom: 30
	},
	addbtn: {
		zIndex: 1
	},
	tab: {
		alignItems: 'center'
	},
	tabText: {
		fontSize: 14
	},
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
		height: '75%',
		// alignItems: 'center',
		// borderColor: 'black',
		// borderWidth: 2,

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowOpacity: 0.5,
		shadowRadius: 100,

		elevation: 8
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

export default Navbar
