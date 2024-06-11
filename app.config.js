const IS_DEV = process.env.APP_VARIANT === 'deve  lopment'

export default ({ config }) => ({
	...config,
	name: 'Daw.AI',
	slug: 'dawai',
	scheme: 'dawai',
	version: '1.0.0',
	orientation: 'portrait',
	privacy: 'public',
	icon: './assets/app/icon.png',
	splash: {
		image: './assets/app/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff'
	},
	jsEngine: 'hermes',
	owner: 'arhaanb',
	assetBundlePatterns: ['**/*'],
	userInterfaceStyle: 'automatic',

	extra: {
		eas: {
			projectId: '068ffc2b-0bca-42c4-b98f-683d530399dd'
		}
	},

	ios: {
		bundleIdentifier: 'com.arhaanb.dawai',
		buildNumber: '1.0.0',
		usesAppleSignIn: true,
		config: {
			usesNonExemptEncryption: false
		}
	},

	android: {
		userInterfaceStyle: 'light',
		adaptiveIcon: {
			foregroundImage: './assets/app/adaptive-icon.png',
			backgroundColor: '#FFFFFF'
		},
		package: 'com.arhaanb.dawai',
		permissions: ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
		versionCode: 100
	},

	web: {
		favicon: './assets/app/icon.png'
	},

	runtimeVersion: {
		policy: 'sdkVersion'
	},

	plugins: [
		[
			'@config-plugins/react-native-siri-shortcut',
			[
				'com.arhaanb.dawai.ShowMySchedule',
				'com.arhaanb.dawai.AddAMedicine',
				'com.arhaanb.dawai.AltOne',
				'com.arhaanb.dawai.AltTwo'
			]
		],
		[
			'expo-camera',
			{
				cameraPermission: 'Allow Daw.AI to access your camera',
				microphonePermission: 'Allow Daw.AI to access your microphone',
				recordAudioAndroid: true
			}
		],
		[
			'expo-image-picker',
			{
				photosPermission:
					'The app accesses your photos to let you scan medicines.'
			}
		],
		'expo-apple-authentication',
		[
			'expo-local-authentication',
			{
				faceIDPermission: 'Allow Daw.AI to use Face ID.'
			}
		],
		'expo-font',
		'expo-secure-store',
		'./forcedDarkMode.js',
		[
			'expo-build-properties',
			{
				android: {
					enableProguardInReleaseBuilds: true,
					enableShrinkResourcesInReleaseBuilds: true
				}
			}
		]
	]
})
