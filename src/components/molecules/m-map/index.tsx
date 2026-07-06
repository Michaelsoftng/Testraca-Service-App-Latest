import React, {useRef, useEffect, useMemo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
  Region,
  LatLng,
} from 'react-native-maps';
import MapViewDirections, {
  MapViewDirectionsOrigin,
} from 'react-native-maps-directions';
import {mapStyle} from '../../../lib/utils/mapStyle';
import {appColors} from '../../../lib/utils/scale';
import {useDispatch} from 'react-redux';
import {updatePatientUser} from '../../../store/slices/patientsDesSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

interface MapComponentProps {
  userOrigin: {
    latitude: number | null;
    longitude: number | null;
  };
  userDestination: {
    latitude: number | null;
    longitude: number | null;
  };
  defaultUserLocation?: {
    latitude: number | null;
    longitude: number | null;
  };
  modifiedUserDestination?: {
    latitude: number | null;
    longitude: number | null;
  };
}
const initialCamera = {
  center: {
    latitude: 37.78825,
    longitude: -122.4324,
  },
  heading: 0,
  pitch: 0,
  zoom: 12,
};
const MapComponent: React.FC<MapComponentProps> = ({
  userOrigin,
  userDestination,
  defaultUserLocation,
  modifiedUserDestination,
}: MapComponentProps) => {
  const mapRef = useRef<MapView | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fitMapToCoordinates = () => {
      if (
        userDestination.latitude !== null &&
        mapRef.current !== null &&
        modifiedUserDestination?.latitude !== null
      ) {
        mapRef.current.fitToCoordinates(
          [
            userOrigin as LatLng,
            {
              latitude: userOrigin?.latitude ?? 0,
              longitude: userOrigin?.longitude ?? 0,
            },
          ],
          {
            edgePadding: {top: 80, right: 80, left: 80, bottom: 180}, // Adjust the padding as needed
            animated: true,
          },
        );
      }
    };

    // Call the fitMapToCoordinates function after a delay
    const timerId = setTimeout(fitMapToCoordinates, 1000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(timerId);
  }, [userOrigin, userDestination]);

  const handleDistanceUpdate = (result: any) => {
    console.log(`Distance: ${result.distance} km`);
    console.log(`Duration: ${result.duration} min.`);
    dispatch(
      updatePatientUser({
        time: result.duration,
        distance: result.distance,
      }),
    );
  };

  const initialRegion2 = {
    latitude: defaultUserLocation?.latitude,
    longitude: defaultUserLocation?.longitude,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  };
  if (
    defaultUserLocation?.latitude == null ||
    typeof defaultUserLocation?.longitude == 'undefined'
  ) {
    return null;
  }

  return (
    <View
      style={{
        position: 'relative',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 1.5,
      }}>
      <MapView
        provider={Platform.OS === 'ios' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={{left: 0, right: 0, top: 0, bottom: 0, position: 'absolute'}}
        showsUserLocation
        // mapType={Platform.OS == 'android' ? 'none' : 'standard'}
        followsUserLocation
        ref={mapRef}
        initialCamera={{...initialCamera, heading: 1, pitch: 1}}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: initialRegion2?.latitude!,
          longitude: initialRegion2?.longitude!,
          latitudeDelta: 0.008, // Increase this value for a wider zoom level
          longitudeDelta: 0.008,
        }}>
        {userOrigin.latitude !== null && (
          <Marker
            coordinate={{
              latitude: userOrigin.latitude!,
              longitude: userOrigin.longitude!,
            }}
            anchor={{x: 0.5, y: 0.5}}>
            <Image
              source={require('../../../assets/images/png/TimeCircle.png')}
              style={{width: 40, height: 40}}
              resizeMode="cover"
            />
          </Marker>
        )}
        {modifiedUserDestination?.latitude !== null && (
          <Marker
            coordinate={{
              latitude: modifiedUserDestination?.latitude!,
              longitude: modifiedUserDestination?.longitude!,
            }}
            anchor={{x: 0.5, y: 0.5}}>
            <Image
              source={require('../../../assets/images/png/riderSpot.png')}
              style={{width: 40, height: 40}}
              resizeMode="cover"
            />
          </Marker>
        )}
        {modifiedUserDestination?.latitude !== null && (
          <MapViewDirections
            origin={userOrigin as MapViewDirectionsOrigin}
            destination={
              {
                latitude: modifiedUserDestination?.latitude,
                longitude: modifiedUserDestination?.longitude,
              } as MapViewDirectionsOrigin
            }
            apikey="AIzaSyAWR5udtkHb9EYPsJTCKKxCx_7ILTDUnAU"
            strokeWidth={4}
            strokeColor="#022920"
            lineDashPattern={[20, 10]}
            onReady={result => {
              return handleDistanceUpdate(result);
            }}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    marginVertical: 0,
    width: SCREEN_WIDTH,
  },

  markerWrapOrigin: {
    //  alignItems: "center",
    // justifyContent: "center",
    width: 40,
    height: 20,
    // marginTop:0
  },
  markerOrigin: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  destination: {
    width: 20,
    height: 20,
    backgroundColor: appColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  view1: {
    width: 7,
    height: 7,
    backgroundColor: appColors.lightGray,
  },
  markerDestination: {
    width: 16,
    height: 16,
  },

  markerOrigin2: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  car: {
    paddingTop: 0,
    width: 40,
    height: 20,
  },

  view2: {
    position: 'absolute',
    top: 10,
    right: 12,
    backgroundColor: appColors.gray,
    height: 40,
    width: 180,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    zIndex: 8,
  },

  view3: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginRight:15,
    //backgroundColor:"white",
    //paddingHorizontal:2,
    paddingVertical: 2,
    //borderRadius:20
  },

  view4: {
    position: 'absolute',
    top: 50,
    left: 12,
    backgroundColor: appColors.gray,
    height: 40,
    width: 140,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    zIndex: 8,
  },

  location: {
    width: 20,
    height: 20,
    borderRadius: 9,
    backgroundColor: appColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  view9: {width: 6, height: 6, borderRadius: 4, backgroundColor: 'white'},
});

export default MapComponent;
