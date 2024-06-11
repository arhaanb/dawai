import React, { useState, useEffect } from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	ScrollView,
	BackHandler,
	StyleSheet
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StatusBar } from 'expo-status-bar'
import { storage } from '../storage.js'
import Layout from '../components/layout.jsx'

import {
	addShortcutListener,
	getShortcuts,
	presentShortcut,
	PresentShortcutCallbackData
} from 'react-native-siri-shortcut'
import AddToSiriButton, {
	SiriButtonStyles
} from 'react-native-siri-shortcut/AddToSiriButton'

const ShowMySchedule = {
	activityType: 'com.arhaanb.dawai.ShowMySchedule',
	title: `Show my schedule`,
	keywords: ['schedule', 'medication'],
	isEligibleForPrediction: true,
	suggestedInvocationPhrase: `Show me my medication schedule`
}

const AddMed = {
	activityType: 'com.arhaanb.dawai.AddAMedicine',
	title: `Add a medicine`,
	keywords: ['medicine', 'add medication', 'analyse medicine'],
	isEligibleForPrediction: true,
	suggestedInvocationPhrase: `Add a medicine to my schedule`
}

export default function App({ route, navigation }) {
	const [darkMode, setDarkMode] = React.useState(false)
	const [userInfo, setUserInfo] = React.useState(false)

	const [mymeds, setMyMeds] = useState([])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			// getInitialData()
			setMyMeds(JSON.parse(storage.getString('mymeds')))
			console.log('everyday')
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
										Siri
									</Text>

									<Text>Show my schedule</Text>

									<AddToSiriButton
										style={{ flex: 1 }}
										buttonStyle={SiriButtonStyles.whiteOutline}
										onPress={() => {
											presentShortcut(
												ShowMySchedule,
												() => PresentShortcutCallbackData
											)
										}}
										shortcut={ShowMySchedule}
									/>

									<AddToSiriButton
										style={{ flex: 1 }}
										buttonStyle={SiriButtonStyles.whiteOutline}
										onPress={() => {
											presentShortcut(AddMed, () => PresentShortcutCallbackData)
										}}
										shortcut={AddMed}
									/>
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
