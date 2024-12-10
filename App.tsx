import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
const CleverTap = require('clevertap-react-native');
CleverTap.setDebugLevel(3);
CleverTap.createNotificationChannel("manishTest", "Clever Tap React Native Testing", "CT React Native Testing", 5, true);
type SectionProps = React.PropsWithChildren<{
  title: string;
}>;

CleverTap.addListener(CleverTap.CleverTapInAppNotificationButtonTapped, (event: any) => {
  _handleCleverTapEvent(CleverTap.CleverTapInAppNotificationButtonTapped, event);
});

function _handleCleverTapEvent(eventName: any, event: any) {
  console.log('handleCleverTapEvent', eventName, event);

}

CleverTap.addListener(CleverTap.CleverTapInboxDidInitialize, (event: any) => {
  _handleCleverTapInbox(CleverTap.CleverTapInboxDidInitialize, event);
});

function _handleCleverTapInbox(eventName: any, event: any) {
  console.log('CleverTap Inbox Event - ', eventName, event);
  CleverTap.showInbox({
    'tabs': ['Offers', 'Promotions'],
    'navBarTitle': 'My App Inbox',
    'navBarTitleColor': '#FF0000',
    'navBarColor': '#FFFFFF',
    'inboxBackgroundColor': '#AED6F1',
    'backButtonColor': '#00FF00',
    'unselectedTabColor': '#0000FF',
    'selectedTabColor': '#FF0000',
    'selectedTabIndicatorColor': '#000000',
    'noMessageText': 'No message(s)',
    'noMessageTextColor': '#FF0000'
  });
}


type ButtonName = 'Sign In' | 'Sign Up' | 'Profile Push' | 'Added To Cart' | 'Charged' | 'App Inbox' | 'Native Display' | 'Profile Set Multi-Values For Key' | 'Profile Remove Multi-Values For Key' | 'Profile Add Multi-Values For Key';

const Section = ({ children, title }: SectionProps): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? 'white' : 'black',
          },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

// Define your screens
const Stack = createNativeStackNavigator();

const ProfilePushScreen = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  const handleProfilePush = () => {
    console.log('Sign In button pressed');
    // Collect data from text fields and dropdown
    const userData = {
      username,
      email,
      phoneNumber
    };
    var props = {
      'Identity': username,
      'Email': email,
      'Phone': phoneNumber,
    }
    CleverTap.profileSet(props)
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={{
            backgroundColor: backgroundStyle.backgroundColor,
          }}
        >
          <Section title="Username:">
            <TextInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
          </Section>
          <Section title="Email:">
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />
          </Section>
          <Section title="Phone Number:">
            <TextInput
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </Section>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Profile Push" onPress={handleProfilePush} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const NativeDisplayScreen = () => {
  const handleNative = () => {
    CleverTap.recordEvent("Native Display");
  };

  // Define state to store image URLs
  const [imageUrls, setImageUrls] = useState([]);
  // Define state to track the index of the currently displayed image
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch display units and store image URLs
  useEffect(() => {
    CleverTap.getAllDisplayUnits((err, res) => {
      const urls = res.reduce((accumulator, item) => {
        if (item.content && Array.isArray(item.content)) {
          item.content.forEach(contentItem => {
            if (contentItem.media && contentItem.media.url) {
              accumulator.push(contentItem.media.url);
            }
          });
        }
        return accumulator;
      }, []);

      setImageUrls(urls);
    });
  }, []); // Empty dependency array ensures this effect runs only once

  // Use useEffect to automatically change the activeIndex every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [imageUrls]); // Re-run effect whenever imageUrls change

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Button title="Native Display" onPress={handleNative} />
      </View>
      {imageUrls.length > 0 && (
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: imageUrls[activeIndex] }}
            style={{ width: '90%', height: 200, marginBottom: 10 }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  let localInApp = {
    inAppType: 'alert',
    titleText: 'Get Notified',
    messageText: 'Enable Notification permission',
    followDeviceOrientation: true,
    positiveBtnText: 'Allow',
    negativeBtnText: 'Cancel',
    fallbackToSettings: true, //Setting this parameter to true will open an in-App to redirect you to Mobile's OS settings page.
  };
  CleverTap.promptPushPrimer(localInApp);
  CleverTap.isPushPermissionGranted((err, res) => {
  });

  const handleSignIn = () => {
    console.log('Sign In button pressed');
    // Collect data from text fields and dropdown
    const userData = {
      name,
      username,
      email,
      phoneNumber,
      gender: selectedGender,
    };
    console.log('User data:', userData);
    var props = {
      'Name': name,
      'Identity': username,
      'Email': email,
      'Phone': phoneNumber,
      'Gender': selectedGender,

      'MSG-whatsapp': true,
    }
    CleverTap.onUserLogin(props)
  };

  const handleAddedToCart = () => {
    var props = { 'Name': 'XYZ', 'Price': 123 }
    CleverTap.recordEvent('Added To Cart', props)
  };

  const handleCharged = () => {
    var chargeDetails = {
      'totalValue': 20,
      'category': 'books',
      'purchase_date': new Date()
    }
    var items = [
      { 'title': 'book1', 'published_date': new Date('2010-12-12T06:35:31'), 'author': 'ABC' },
      { 'title': 'book2', 'published_date': new Date('2020-12-12T06:35:31'), 'author': 'DEF' },
      { 'title': 'book3', 'published_date': new Date('2000-12-12T06:35:31'), 'author': 'XYZ' }]

    CleverTap.recordChargedEvent(chargeDetails, items);
  };

  const handleAppInbox = () => {
    CleverTap.initializeInbox();
    // Add navigation logic here
  };


  const handleProfileSet = () => {
    var myStuff = ['English', 'Hindi', 'Marathi']
    CleverTap.profileSetMultiValuesForKey(myStuff, 'Language')
  };

  const handleProfileRemove = () => {
    var myStuff = ['Marathi', 'Hindi']
    CleverTap.profileRemoveMultiValueForKey('Marathi', 'Language');
  };

  const handleProfileAdd = () => {
    var myStuff = ['Japanese', 'French']
    CleverTap.profileAddMultiValuesForKey(myStuff, 'Language')
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={{
            backgroundColor: backgroundStyle.backgroundColor,
          }}
        >
          <Section title="Name:">
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </Section>
          <Section title="Username:">
            <TextInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
            />
          </Section>
          <Section title="Email:">
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
            />
          </Section>
          <Section title="Phone Number:">
            <TextInput
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </Section>
          <Section title="Gender:">
            <Picker
              selectedValue={selectedGender}
              onValueChange={(itemValue) => setSelectedGender(itemValue)}
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="M" />
              <Picker.Item label="Female" value="F" />
            </Picker>
          </Section>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Sign In" onPress={handleSignIn} />
            </View>
            <View style={styles.button}>
              <Button title="Profile Push" onPress={() => navigation.navigate('ProfilePush')} />
            </View>
            <View style={styles.button}>
              <Button title="Added To Cart" onPress={handleAddedToCart} />
            </View>
            <View style={styles.button}>
              <Button title="Charged" onPress={handleCharged} />
            </View>
            <View style={styles.button}>
              <Button title="App Inbox" onPress={handleAppInbox} />
            </View>
            <View style={styles.button}>
              <Button title="Native Display" onPress={() => navigation.navigate('NativeDisplay')} />
            </View>
            <View style={styles.button}>
              <Button title="Profile Set Multi-Values For Key" onPress={handleProfileSet} />
            </View>
            <View style={styles.button}>
              <Button title="Profile Remove Multi-Values For Key" onPress={handleProfileRemove} />
            </View>
            <View style={styles.button}>
              <Button title="Profile Add Multi-Values For Key" onPress={handleProfileAdd} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    flex: 1,
  },
  button: {
    marginTop: 5,
    marginBottom: 5,
    width: '45%', // Adjust the width of the buttons
  },
});

export default function WrappedApp(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
        <Stack.Screen name="ProfilePush" component={ProfilePushScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NativeDisplay" component={NativeDisplayScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
