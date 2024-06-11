import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Navbar from './navbar'

import {
	addShortcutListener,
	getShortcuts,
	presentShortcut,
	PresentShortcutCallbackData
} from 'react-native-siri-shortcut'
import AddToSiriButton, {
	SiriButtonStyles
} from 'react-native-siri-shortcut/AddToSiriButton'

const Layout = ({ children, navigation }) => {
	const [openModal, setOpenModal] = useState(false)

	React.useEffect(() => {
		const subscription = addShortcutListener(({ userInfo, activityType }) => {
			if (activityType == 'com.arhaanb.dawai.ShowMySchedule') {
				navigation.navigate('Activity')
			} else if (activityType == 'com.arhaanb.dawai.AddAMedicine') {
				// navigation.navigate('Present')
				setOpenModal(true)
				console.log('hi')
			}
		})

		return () => {
			subscription.remove()
		}
	}, [])

	return (
		<View style={[styles.container]}>
			{children}
			<Navbar
				openModal={openModal}
				setOpenModal={setOpenModal}
				navigation={navigation}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

export default Layout
