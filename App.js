import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity, Modal, Image, Alert, ScrollView } from 'react-native';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MapView from 'react-native-maps';
import latlongContries from './LatLongJson/countries.json';


export default function App() {
  const [countriesData, setCountriesData] = useState('');
  const [globalData, setGlobalData] = useState('');
  const [seachedCountry, setSearchedCountry] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState();
  const [currentCountryCode, setCurrentCountryCode] = useState('');
  const [countryStats, setCountryStats] = useState([])
  const [viewCoordinates, setViewCoordinates] = useState([40,20,80,80]);
  const [markerCoordinates, setMarkerCoordinates] = useState([0,0]);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  const loadData = async () => {
    fetch("https://api.covid19api.com/summary")
    .then(response => response.json())
    .then(responseJson => {
      setCountriesData(responseJson.Countries)
      setGlobalData(responseJson.Global)
    })
    .catch(error => console.log('error', error));
  } 

  useEffect(() => {
    loadData();
    var date = new Date().getDate(); 
    var month = new Date().getMonth() + 1; 
    var year = new Date().getFullYear(); 
    setCurrentDate(
      date + '/' + month + '/' + year
    );
  }, [])

  function getCountryStats(country) {
    try {
      for (let i = 0; i <= countriesData.length; i++) {
        if (countriesData[i].Country == country) {
          setCountryStats([
            countriesData[i].Country,
            countriesData[i].TotalConfirmed,
            countriesData[i].TotalDeaths,
            countriesData[i].TotalRecovered,
            countriesData[i].NewConfirmed,
            countriesData[i].NewDeaths,
            countriesData[i].NewRecovered,
          ])
          setCurrentCountryCode(countriesData[i].CountryCode)
          break;
        }
      }
      let latlong = latlongContries[currentCountryCode.toLowerCase()];
      if (latlong) {
        let lat = latlong['lat'];
        let long = latlong['long'];
        setViewCoordinates([lat,long,40,40]);
        setMarkerCoordinates([lat,long])
      }
    } catch (e) {
      Alert.alert('Not a valid country', 'Type in a valid country name')
    }   
  }

  const handleModal = (info) => {
    if (info == global) {
      setModalText(
        <View style={{...styles.infoContainer, height: 200}}>
            <Text style={{...styles.statsText, fontSize: 22}}>
              Global status: {"\n"}
            </Text>
            <Text style={{...styles.statsText, fontWeight: '300', fontSize: 18}}>
              Total confirmed: {"\n"}
              Cases: {globalData.TotalConfirmed}{"\n"}
              Deaths: {globalData.TotalDeaths}{"\n"}
              Recovered: {globalData.TotalRecovered}{"\n"}{"\n"}
              New confirmed: {"\n"}
              Cases: {globalData.NewConfirmed}{"\n"}
              Deaths: {globalData.NewDeaths}{"\n"}
              Recovered: {globalData.NewRecovered}{"\n"}
            </Text>
        </View>
        
      );
      setModalVisible(true);
    }
    else {
      setModalText(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={{...styles.infoContainer, height: 50, marginTop: 5}}>
            <Text style={{...styles.statsText, fontSize: 24}}> 
              {countryStats[0]}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%'}}>
            <Text style={{...styles.statsText, fontSize: 20}}>               
              Cases: 
            </Text>
            <Text style={{...styles.statsText, fontSize: 20}}> 
              { countryStats[1]} {'\n'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%'}}>
            <Text style={{...styles.statsText, fontSize: 20}}>                
              Deaths: 
            </Text>
            <Text style={{...styles.statsText, fontSize: 20}}>  
              { countryStats[2]} {'\n'}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '70%'}}>
            <Text style={{...styles.statsText, fontSize: 20}}>                
              Recovered: 
            </Text>
            <Text style={{...styles.statsText, fontSize: 20}}> 
              { countryStats[3]} {'\n'}
            </Text>
          </View>
        </View>
      );
      
      setModalVisible(true);
    }
  }

 

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.imgContainer1}>
            <Image 
              source={require('./assets/Images/coronaImg.png')} 
              style={{height: 50, width: 50, resizeMode: 'contain'}}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              COVID-19 MAP
            </Text>
          </View>
          <View style={styles.imgContainer2}>
            <Image 
              source={require('./assets/Images/coronaImg.png')} 
              style={{height: 50, width: 50, resizeMode: 'contain'}}
            />
          </View>
        </View>
        
        <View style={styles.textFieldContainer}>
          <Input 
            containerStyle={styles.textField}
            onChangeText={text => setSearchedCountry(text)}
            value={seachedCountry}
            leftIcon={
              <Icon name="search" size={20}/>
            }
            placeholder="Type in a country"
          />
          <Icon 
            name="globe" 
            size={26} color='white' 
            style={{paddingHorizontal: 10}}
            onPress={() => handleModal(global)}
          />
        </View>
      </View>

      <View style={{flexDirection: 'row', marginTop: 15, width: '50%', justifyContent: 'space-around'}}>
          <Icon name="map" size={24} color='green' onPress={() => setShowDetailedStats(false)}/>
          <Icon name="table" size={24} color='#CD5C5C' onPress={() => setShowDetailedStats(true)}/>
      </View>

      {showDetailedStats ? 
      <View style={styles.mapContainer}>
        <View style={styles.map}>
          <ScrollView horizontal={false} style={{borderRadius: 15}}>
            <View style={{...styles.infoContainer, height: 50, marginTop: 5}}>
              <Text style={{...styles.statsText, fontSize: 24, fontWeight: '600'}}>
                {countryStats[0]}
              </Text>
            </View>
            <View style={{...styles.infoContainer, height: 35, marginVertical: 0}}>
              <Text style={{...styles.statsText, fontSize: 14}}>{currentDate}</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%' }}>
              <View style={styles.infoContainer}>
                  <Text style={{...styles.statsText, textDecorationLine: 'underline', fontWeight: '600'}}>
                    Total confirmed: {'\n'}                 
                  </Text>
                <View style={{flexDirection: 'row', width: '50%', justifyContent: 'space-between'}}>
                  <Text style={styles.statsText}>                 
                    Cases: 
                  </Text>
                  <Text style={styles.statsText}> 
                    { countryStats[1]} {'\n'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', width: '50%', justifyContent: 'space-between'}}>
                  <Text style={styles.statsText}>                 
                    Deaths: 
                  </Text>
                  <Text style={styles.statsText}> 
                    { countryStats[2]} {'\n'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', width: '50%', justifyContent: 'space-between'}}>
                  <Text style={styles.statsText}>                 
                    Recovered: 
                  </Text>
                  <Text style={styles.statsText}> 
                    { countryStats[3]} {'\n'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around'}}>
              <View style={styles.infoContainer}>
                <Text style={{...styles.statsText, textDecorationLine: 'underline', fontWeight: '600'}}>
                  New confirmed: {'\n'}                 
                </Text>
                <View style={{flexDirection: 'row', width: '50%', justifyContent: 'space-between'}}>
                  <Text style={styles.statsText}>                 
                    Cases: 
                  </Text>
                  <Text style={styles.statsText}> 
                    {countryStats[4]} {'\n'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', width: '50%', justifyContent: 'space-between'}}>
                  <Text style={styles.statsText}>                 
                    Deaths: 
                  </Text>
                  <Text style={styles.statsText}> 
                    {countryStats[5]} {"\n"}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', width: '50%', justifyContent: 'space-between'}}>
                  <Text style={styles.statsText}>                 
                    Recovered: 
                  </Text>
                  <Text style={styles.statsText}> 
                    {countryStats[6]} {"\n"}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View> 
      </View> 
      :  
      <View style={styles.mapContainer}>
        <MapView
          region={{
            latitude: Number(viewCoordinates[0]),
            longitude: Number(viewCoordinates[1]),
            latitudeDelta: viewCoordinates[2],
            longitudeDelta: viewCoordinates[3],
          }}
          style={styles.map}
          mapType="hybrid"
        > 
          <MapView.Marker
              coordinate={{latitude: Number(markerCoordinates[0]),longitude:  Number(markerCoordinates[1])}}
              onPress = {() => handleModal()}
          />
        </MapView>
      </View>
      }
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => getCountryStats(seachedCountry)} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent='10%'
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.statsContainer}>
            <Text>
              {modalText}
            </Text>
            <View style={{marginTop: 30}}>
              <Button title='lukk' onPress={() => setModalVisible(false)}/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF3CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 5,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    width: '90%',
    backgroundColor: '#CD5C5C',
    borderWidth: 4,
    borderRadius: 20,
    borderColor: '#34495E',
    paddingTop: 10,  
  },
  infoContainer: {
    height: 180,
    width: '100%',
    paddingTop: 10,
    backgroundColor: '#F1948A',
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,

  },
  buttonContainer: {
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: 40,
    backgroundColor: '#212F3C',
    borderRadius: 20,
    elevation: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  },
  headerContainer: {
    flex: 2,
    backgroundColor: '#EB984E',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTextContainer: {
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  imgContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingLeft: 30
  },
  imgContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingRight: 30
  },
  textFieldContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  textField: {
    height: 55,
    width: '80%',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 30,
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    borderWidth: 2,
    borderColor: '#C0392B',
    backgroundColor: '#F1948A',
    borderRadius: 20,
    width: 300,
    height: 320,
    //justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15
  },
  statsText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white'
  }
});
