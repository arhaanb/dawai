import React, { useState, useEffect } from 'react'
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	ScrollView,
	BackHandler,
	StyleSheet,
	TextInput,
	Modal
} from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { StatusBar } from 'expo-status-bar'
import { storage } from '../storage.js'
import Layout from '../components/layout.jsx'
import { Dropdown } from 'react-native-element-dropdown'

const RenderSchedule = ({ schedule }) => {
	return (
		<View
			style={{
				display: 'flex',
				gap: 15,
				padding: 10,
				backgroundColor: '#fafafa',
				borderRadius: 10
			}}
		>
			{Object.entries(schedule).map(([day, times], idx) => (
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}
					key={idx}
				>
					<Text style={{ fontFamily: 'HelveticaBold' }}>{day}</Text>
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						{times.map((time, index) => (
							<Text
								key={index}
								style={{ marginLeft: 20, fontFamily: 'HelveticaReg' }}
							>
								{time}
							</Text>
						))}
					</View>
				</View>
			))}
		</View>
	)
}

const AddBtn = ({ handle }) => {
	return (
		<TouchableOpacity
			style={{
				backgroundColor: '#222',
				padding: 12,
				borderRadius: 10,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between'
			}}
			onPress={handle}
		>
			<Text
				style={{ color: '#ffaa00', fontFamily: 'HelveticaBold', fontSize: 18 }}
			>
				Add to Daw.AI
			</Text>

			<Text
				style={{ color: '#ffaa00', fontFamily: 'HelveticaReg', fontSize: 18 }}
			>
				&rarr;
			</Text>
		</TouchableOpacity>
	)
}

export default function AddMed({ route, navigation }) {
	const [loading, setLoading] = React.useState(false)
	const [responseData, setResponseData] = React.useState(null)

	const [value, setValue] = useState('mymeds')
	const [isFocus, setIsFocus] = useState(false)

	const [rerender, setRerender] = useState(false) // State variable to trigger rerender

	const med = JSON.parse(storage.getString('medToAdd'))
	const [family, setFamily] = useState([])

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			const b = JSON.parse(storage.getString('family'))

			var fam = []
			fam.push({ label: 'Me', value: 'mymeds' })
			var count = 0
			b.forEach((e) => {
				count = count + 1
				fam.push({ label: e.name, value: count })
			})

			setFamily(fam)
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

	const [sched, setSched] = useState(med.schedule)

	const [modalVisible, setModalVisible] = useState(false)
	const [mealTime, setMealTime] = useState('after')

	const addToDawai = () => {
		var structuredMed = {}
		Object.keys(med).forEach((e) => {
			if (e != 'schedule') {
				structuredMed[e] = med[e]
			}
		})

		structuredMed.schedule = sched
		structuredMed.mealTime = mealTime

		var who = value

		if (who == 'mymeds') {
			const oldmeds = storage.getString(who)
			if (oldmeds) {
				let newmeds = [...JSON.parse(oldmeds), structuredMed]
				storage.set(who, JSON.stringify(newmeds))
			} else {
				storage.set(who, JSON.stringify([structuredMed]))
			}

			navigation.navigate('Activity')
		} else {
			who = who - 1
			const fam = storage.getString('family')
			let mmm = JSON.parse(fam)
			let newmeds = [...mmm[who].meds, structuredMed]
			mmm[who].meds = newmeds
			console.log(mmm[who])
			storage.set('family', JSON.stringify(mmm))

			navigation.navigate('Family')
		}
		console.log(storage.getString('family'))
	}

	const daysOfWeek = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday'
	]

	const [selectedDays, setSelectedDays] = useState([])

	const toggleDay = (day) => {
		if (selectedDays.includes(day)) {
			const updatedItems = selectedDays.filter((item) => item !== day)
			setSelectedDays(updatedItems)
		} else {
			setSelectedDays([...selectedDays, day])
		}
	}

	const [hour, onChangeHour] = React.useState('')
	const [min, onChangeMin] = React.useState('')

	return (
		<Layout navigation={navigation}>
			<View style={[styles.container]}>
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
											fontFamily: 'HelveticaBold',
											fontSize: 24,
											marginBottom: 5,
											marginTop: 20
										}}
									>
										{med?.medicine}
									</Text>

									<Text
										style={{
											fontFamily: 'HelveticaReg',
											fontSize: 16,
											opacity: 0.7,
											marginBottom: 10
										}}
									>
										Enter medicine details. We've already populated these fields
										with suggested dosages, please make changes as required or
										suggested by a professional.
									</Text>

									<Modal
										animationType="slide"
										transparent={true}
										visible={modalVisible}
										onRequestClose={() => {
											Alert.alert('Modal has been closed.')
											setModalVisible(!modalVisible)
										}}
									>
										<View style={styles.centeredView}>
											<View style={[styles.modalView]}>
												{/* <Text style={styles.modalText}>Hello World!</Text> */}

												<TouchableOpacity
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
														setModalVisible(!modalVisible)
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
												</TouchableOpacity>

												<ScrollView style={{ marginVertical: 20 }}>
													{/* <ScrollView> */}
													{Object.entries(med).map((entry, index) => {
														const key = entry[0]
														const value = entry[1]
														return (
															<View style={{ marginBottom: 20 }} key={index}>
																{key === 'schedule' ? null : (
																	<Text
																		style={{
																			marginBottom: 5,
																			fontFamily: 'HelveticaBold'
																		}}
																	>
																		{key}
																	</Text>
																)}
																{key === 'schedule' ? null : Array.isArray(
																		value
																  ) ? (
																	<View>
																		{value.map((item, idx) => (
																			<Text
																				key={idx}
																				style={{
																					marginLeft: 10,
																					fontFamily: 'HelveticaReg',
																					marginBottom: 3
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
											</View>
										</View>
									</Modal>

									<TouchableOpacity onPress={() => setModalVisible(true)}>
										<Text style={{ fontFamily: 'HelveticaReg', fontSize: 16 }}>
											View medicine details &rarr;
										</Text>
									</TouchableOpacity>

									<View style={{ marginTop: 20 }}>
										<AddBtn handle={addToDawai} />
									</View>

									<Text
										style={[
											isFocus && { color: 'blue' },
											{
												marginTop: 20,
												fontFamily: 'HelveticaBold',
												fontSize: 24,
												marginBottom: 10,
												marginTop: 20
											}
										]}
									>
										For who?
									</Text>

									<Dropdown
										style={[
											styles.dropdown,
											isFocus && { borderColor: 'blue' }
										]}
										placeholderStyle={styles.placeholderStyle}
										selectedTextStyle={styles.selectedTextStyle}
										inputSearchStyle={styles.inputSearchStyle}
										iconStyle={styles.iconStyle}
										data={family}
										search
										maxHeight={300}
										labelField="label"
										valueField="value"
										placeholder={!isFocus ? 'Select item' : '...'}
										searchPlaceholder="Search..."
										value={value}
										onFocus={() => setIsFocus(true)}
										onBlur={() => setIsFocus(false)}
										onChange={(item) => {
											setValue(item.value)
											setIsFocus(false)
										}}
									/>

									<Text
										style={{
											fontFamily: 'HelveticaBold',
											fontSize: 24,
											marginBottom: 10,
											marginTop: 20
										}}
									>
										Consume with meal?
									</Text>

									<View
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											flexDirection: 'row',
											gap: 5,
											marginBottom: 10
										}}
									>
										<TouchableOpacity
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center'
											}}
											onPress={() => setMealTime('before')}
										>
											<Image
												style={{
													height: 21 * 1.35,
													width: 65 * 1.35
												}}
												source={require('../assets/mealicons/before.png')}
											/>

											<View
												style={[
													{ borderRadius: 5, marginTop: 5 },
													mealTime == 'before'
														? {
																backgroundColor: 'pink',
																paddingHorizontal: 5
														  }
														: null
												]}
											>
												<Text
													style={[
														{
															fontFamily: 'HelveticaReg'
														}
													]}
												>
													Before Meal
												</Text>
											</View>
										</TouchableOpacity>

										<TouchableOpacity
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center'
											}}
											onPress={() => setMealTime('while')}
										>
											<Image
												style={{
													height: 21 * 1.35,
													width: 65 * 1.35
												}}
												source={require('../assets/mealicons/while.png')}
											/>
											<View
												style={[
													{ borderRadius: 5, marginTop: 5 },
													mealTime == 'while'
														? {
																backgroundColor: 'pink',
																paddingHorizontal: 5
														  }
														: null
												]}
											>
												<Text
													style={[
														{
															fontFamily: 'HelveticaReg'
														}
													]}
												>
													During Meal
												</Text>
											</View>
										</TouchableOpacity>

										<TouchableOpacity
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center'
											}}
											onPress={() => setMealTime('after')}
										>
											<Image
												style={{
													height: 21 * 1.35,
													width: 65 * 1.35
												}}
												source={require('../assets/mealicons/after.png')}
											/>
											<View
												style={[
													{ borderRadius: 5, marginTop: 5 },
													mealTime == 'after'
														? {
																backgroundColor: 'pink',
																paddingHorizontal: 5
														  }
														: null
												]}
											>
												<Text
													style={[
														{
															fontFamily: 'HelveticaReg'
														}
													]}
												>
													After Meal
												</Text>
											</View>
										</TouchableOpacity>
									</View>

									<Text
										style={{
											fontFamily: 'HelveticaBold',
											fontSize: 24,
											marginBottom: 5,
											marginTop: 20
										}}
									>
										Schedule
									</Text>

									<View style={styles.container}>
										<ScrollView horizontal>
											<View
												style={{
													display: 'flex',
													flexDirection: 'row',
													gap: 7,
													justifyContent: 'space-between'
												}}
											>
												{daysOfWeek.map((day) => (
													<TouchableOpacity
														key={day}
														style={[
															styles.button,
															selectedDays.includes(day)
																? styles.selectedButton
																: null
														]}
														onPress={() => toggleDay(day)}
													>
														<Text style={{ fontFamily: 'HelveticaReg' }}>
															{day.substring(0, 3)}
														</Text>
													</TouchableOpacity>
												))}
											</View>
										</ScrollView>
									</View>

									{/* <Text>Selected Days: {selectedDays.join(', ')}</Text> */}

									<View
										style={{
											marginTop: 10,
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
											gap: 10
										}}
									>
										<View style={{ flex: 1 }}>
											<Text
												style={{
													fontFamily: 'HelveticaBold',
													marginBottom: 1,
													fontSize: 16
												}}
											>
												Hour
											</Text>
											<TextInput
												style={{
													backgroundColor: 'white',
													padding: 5,
													fontSize: 24,
													fontFamily: 'HelveticaReg',

													borderRadius: 10
												}}
												maxLength={2}
												onChangeText={onChangeHour}
												value={hour}
												placeholder="00"
												keyboardType="numeric"
											/>
										</View>

										<View style={{ flex: 1 }}>
											<Text
												style={{
													fontFamily: 'HelveticaBold',
													marginBottom: 1,
													fontSize: 16
												}}
											>
												Minute
											</Text>
											<TextInput
												style={{
													backgroundColor: 'white',
													padding: 5,
													fontSize: 24,
													fontFamily: 'HelveticaReg',

													borderRadius: 10
												}}
												maxLength={2}
												onChangeText={onChangeMin}
												value={min}
												placeholder="00"
												keyboardType="numeric"
											/>
										</View>
									</View>
									<Text style={{ fontFamily: 'HelveticaReg' }}>
										Use 24 hour clock format to enter a time
									</Text>

									<TouchableOpacity
										onPress={() => {
											if (!!hour && !!min && selectedDays?.length > 0) {
												selectedDays.forEach((d) => {
													if (sched[d]) {
														sched[d].push(`${hour}:${min}`)
													}
												})
												setSelectedDays([])
												onChangeHour('')
												onChangeMin('')

												setSched(sched)
												setRerender((prevState) => !prevState)
											}
										}}
										style={{
											backgroundColor: 'pink',
											padding: 10,
											borderRadius: 10,
											display: 'flex',
											justifyContent: 'space-between',
											flexDirection: 'row',
											marginTop: 10
										}}
									>
										<Text style={{ fontFamily: 'HelveticaReg', fontSize: 16 }}>
											Add time
										</Text>
										<Text style={{ fontFamily: 'HelveticaReg', fontSize: 16 }}>
											&rarr;
										</Text>
									</TouchableOpacity>

									<View style={{ marginTop: 20 }}>
										<RenderSchedule
											key={rerender.toString()}
											schedule={sched ? sched : {}}
										/>
									</View>

									<View style={{ marginTop: 20 }}>
										<AddBtn handle={addToDawai} />
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
		alignSelf: 'flex-end'
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
	},

	button: {
		backgroundColor: '#fff',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20
	},
	selectedButton: {
		backgroundColor: 'pink'
	},
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'black'
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
	}
})
