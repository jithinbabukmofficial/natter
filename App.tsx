/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import MapView, { Marker } from 'react-native-maps';




function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // component states
  const [image, setImage] = useState(null)
  const [permission, setPermission] = useState(false)
  const [position, setPosition] = useState(null)

  // didmount function
  useEffect(() => {
    requestPermission();
  }, [])


  // request for user location permission
  const requestPermission = async () => {

    Geolocation.requestAuthorization(() => {
      setPermission(true)

      // get current position
      Geolocation.getCurrentPosition((res) => {
        console.log(res)
        setPosition({ "latitude": res.coords.latitude, "longitude": res.coords.longitude })
      }, (e) => {

      }, {})
    }, () => {
      console.log('failed');
      setPermission(false)
    })
  }


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  // function to select image from library
  const openImagePicker = async () => {
    const options = {
      selectionLimit: 1,
    };

    try {
      const result = await launchImageLibrary(options);
      console.log(result.assets[0].uri)
      setImage(result.assets[0].uri)
    } catch (error) {
      console.log("something went wrong")
    }
  };

  // pick image with camers
  const camerapick = async () => {
    const options = {
      saveToPhotos: false,
      mediaType: 'photo',
      includeBase64: false,
    };
    try {
      const res = await launchCamera(options)
      console.log(res.assets[0].uri);
      setImage(res.assets[0].uri)

    } catch (error) {
      console.log(error);

    }

  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {permission ? <View style={styles.btnbox}>
        <TouchableOpacity style={styles.button} onPress={camerapick}>
          <Text style={styles.text}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openImagePicker}>
          <Text style={styles.text}>Gallery Photos</Text>
        </TouchableOpacity>
      </View> : <TouchableOpacity style={styles.button} onPress={requestPermission}>
        <Text style={styles.text}>Request Permission</Text>
      </TouchableOpacity>}

      {/* map component start */}
      {image && position && <MapView
        style={styles.map}
        initialRegion={{
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // provider="openstreetmaps"
      >
        <Marker
          coordinate={{ latitude: position.latitude, longitude: position.longitude }}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView>}
      {/* map component end */}

    </SafeAreaView>
  );
}


// component styles
const styles = StyleSheet.create({
  map:{
    width:Dimensions.get("screen").width -20,
    height:300
  },
  btnbox: {
    height: 100,
    width: Dimensions.get("screen").width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around"
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#333",
    resizeMode: "cover",
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "#333",
    borderRadius: 10,
  },
});

export default App;
