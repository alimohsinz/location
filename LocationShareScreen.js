import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Button, TextInput, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Mailer from 'react-native-mail';

const LocationShareScreen = () => {
  const [location, setLocation] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app requires access to your location.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              setLocation(position.coords);
            },
            error => {
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();

    return () => {
      Geolocation.stopObserving();
    };
  }, []);

  const sendLocationEmail = () => {
    const emailData = {
      subject: 'Current Location',
      recipients: [email],
      body: `Latitude: ${location.latitude}\nLongitude: ${location.longitude}`,
    };

    Mailer.mail(emailData, (error, event) => {
      if (error) {
        console.error(error);
      }
    });
  };

  return (
    <View>
      <TextInput
        placeholder="Recipient Email"
        onChangeText={text => setEmail(text)}
        value={email}
        style={{marginBottom: 16}}
      />
      <Button
        title="Send Location"
        onPress={sendLocationEmail}
        disabled={!location || !email}
      />
    </View>
  );
};

export default LocationShareScreen;
