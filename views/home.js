import React, { useEffect } from 'react'
import { Text, View, Image, ScrollView } from 'react-native'
import global from '../styles'
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import { useIsFocused } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { storage } from '../storage'
import * as AppleAuthentication from 'expo-apple-authentication'

export default function App({ route, navigation }) {
	const isFocused = useIsFocused()

	useEffect(() => {
		if (storage.getBoolean('loggedIn')) {
			navigation.navigate('Activity')
		}
	}, [isFocused])

	return (
		<ScrollView style={{ backgroundColor: '#FEE0E1' }}>
			<StatusBar style="dark" backgroundColor={'#ffffff'} />
			<View
				style={{
					position: 'relative',
					paddingVertical: hp('100%') >= 750 ? hp('12%') : hp('7%')
				}}
			>
				<View style={global.container}>
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
								height: 138 * 0.35,
								width: 515.12 * 0.35,
								marginBottom: 10,
								marginTop: 120
							}}
							source={require('../assets/icons/brand.png')}
						/>
					</View>

					<Text
						style={{
							fontSize: wp('7.25%'),
							fontFamily: 'HelveticaBold',
							marginBottom: 17,
							lineHeight: 40,
							opacity: 0.9
						}}
					>
						Empowering Health,{'\n'}One Dose at a Time
					</Text>

					<Text
						style={{
							fontSize: 16,
							lineHeight: 24,
							fontFamily: 'HelveticaReg',
							color: '#2a2a2a',
							opacity: 0.7
						}}
					>
						Daw.AI helps you analyse and schedule your medicines to stay
						informed, and keep yours and your loved ones' health in check!
					</Text>
				</View>

				<View
					style={[
						global.container,
						{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 200
						}
					]}
				>
					<AppleAuthentication.AppleAuthenticationButton
						buttonType={
							AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
						}
						buttonStyle={
							AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
						}
						cornerRadius={5}
						style={{ width: '100%', height: 50 }}
						onPress={async () => {
							try {
								const credential = await AppleAuthentication.signInAsync({
									requestedScopes: [
										AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
										AppleAuthentication.AppleAuthenticationScope.EMAIL
									]
								})
								// signed in
								console.log(credential)

								if (credential?.email) {
									storage.set('email', credential?.email)
								}
								if (
									credential?.fullName?.familyName &&
									credential?.fullName?.givenName
								) {
									storage.set(
										'name',
										`${credential?.fullName?.givenName} ${credential?.fullName?.familyName}`
									)
								}
								storage.set('loggedIn', true)

								console.log(storage.getString('name'))
								navigation.navigate('Activity')
							} catch (e) {
								if (e.code === 'ERR_REQUEST_CANCELED') {
								} else {
								}
							}
						}}
					/>
				</View>
			</View>
		</ScrollView>
	)
}
