import React from 'react';
import { Linking } from 'react-native';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { AirbnbRating } from './react-native-ratings/src'

const Seperator = () => {
  return(
    <View style={{borderBottomColor: 'grey',borderBottomWidth: 2}}>
    </View>
  )
}

const MovieInfoModal = (props) => {
  return(
    <View >
      <Modal 
        visible={props.isVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.fadedBackground}>
          <TouchableOpacity style={{flex:1}} onPress={() => props.modalOff()} activeOpacity={1}>
            <TouchableWithoutFeedback onPress={() => {}} >
              <View style={styles.modalContainer}>
                <Text style={styles.titleText}>
                  {props.movieObj.title}
                </Text>
                <Seperator/>
                <ScrollView>
                  <View onStartShouldSetResponder={() => true}>
                    <View style={styles.posterImgContainer}>
                      {props.movieObj.moviePosterUrl ? 
                        <Image 
                          source={{uri: props.movieObj.moviePosterUrl }}
                          style={styles.posterImgSource}
                          >
                        </Image>
                        :
                          null
                      }
                    </View>
                    <View style={styles.ytLinkContainer}> 
                      {/* <TouchableOpacity onPress={() => Linking.openURL(props.movieObj.rtUrl)} style={{justifyContent:'center',alignItems:"center",marginHorizontal:10}}>
                        <Image
                          source={require('../assets/rt.png')}
                          style={{ width: 40, height: 40}}
                        />
                        <Text style={{textAlign:"center",color: 'red', fontWeight:"bold",fontStyle:'italic'}}>
                          Rotten Tomatoes
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity onPress={() => Linking.openURL(props.movieObj.trailerUrl)} style={styles.ytTrailerContainer} >
                        <Image
                          source={require('../assets/yt.png')}
                          style={{ width: 40, height: 40}}
                        />
                        <Text style={styles.ytTrailerText}>
                          Youtube Trailer
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.detailsContainer}>                      
                      <View>
                        <Text style={styles.sectionLabel}>
                          GENRE
                        </Text>
                        <Text style={{textAlign:"center",color:'black'}}>
                          {props.movieObj.genre ? 
                            props.movieObj.genre
                            :
                            "Could not find"
                          }
                        </Text>
                        <Text style={styles.sectionLabel}>
                          Rating
                        </Text>
                        <View style={styles.ratingContainer}>
                          <Image
                            source={
                              parseInt(props.movieObj.rating) >= 0 && parseInt(props.movieObj.rating) <= 60 ? 
                                require('../assets/rt-rotten.png')
                              :
                              parseInt(props.movieObj.rating) > 60 && parseInt(props.movieObj.rating) <= 90 ?
                                require('../assets/rt.png')
                              :
                              require('../assets/rt-certified-fresh.png')
                            }
                            style={{ width: 30, height: 30, marginRight:10 }}
                          />
                          <Text style={[{color:"red",fontWeight:"bold",fontSize:20}, 
                            parseInt(props.movieObj.rating) <= 60 ? 
                              {color:"#0ec654"} 
                            :
                            parseInt(props.movieObj.rating) > 60 && parseInt(props.movieObj.rating) <= 90 ? 
                              {color:"#f92e02"}
                            :
                              {color:"#ffd600"}
                          ]}>
                            {props.movieObj.rating}
                          </Text>
                        </View>
                        <Text style={styles.sectionLabel}>
                          DESCRIPTION
                        </Text>
                        <Text style={styles.descriptionText}>
                          {props.movieObj.description}
                        </Text>
                        <Text style={styles.sectionLabel}>
                          CAST
                        </Text>
                        <Text style={styles.castText}>
                          {props.movieObj.cast ? 
                            props.movieObj.cast.map( (character, index) => {
                                if(index != props.movieObj.cast.length - 1){
                                  return character + ", "
                                }
                                else{
                                  return character
                                }
                            })
                            :
                              "Cast Not Found"
                          }
                        </Text>
                        <Text style={styles.sectionLabel}>
                          RATE MOVIE
                        </Text>
                        <AirbnbRating
                          reviews={["Terrible", "Bad", "Not Good", "Meh", "Average", "Very Good", "Wow", "Amazing", "Unbelievable", "The Best"]}
                          defaultRating={props.movieObj.userRating}
                          ratingBackgroundColor='grey'
                          count={10}
                          size={30}
                          onFinishRating={rating => props.updateUserMovieRating(rating)}
                          starContainerStyle={{marginBottom:10}}
                        />
                      </View>                       
                    </View>
                  </View>                 
                </ScrollView>
                <Button
                  title="Close"
                  onPress={() => props.modalOff()}
                />
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  fadedBackground: {
    flex:1, 
    backgroundColor:'rgba(0,0,0,0.7)'
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    marginBottom:100,
    borderRadius:5,
    maxHeight:"95%"
  },
  titleText:{
    textAlign:"center", 
    fontSize:30, 
    fontWeight:"bold",
    marginVertical:5
  },
  posterImgContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:"center",
    marginTop:10,
    marginBottom:5
  },
  posterImgSource: {
    width:309,
    height:458, 
    borderColor:'black', 
    borderWidth:1,
  },
  ytLinkContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:"center", 
    borderColor:'white', 
    borderWidth:1,
  },
  ytTrailerContainer: {
    justifyContent:'center',
    alignItems:"center"
  },
  ytTrailerText: {
    textAlign:"center",
    color: 'red', 
    fontWeight:"bold",
    fontStyle:'italic'
  },
  detailsContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:"center",
    marginVertical:5
  },
  sectionLabel: {
    color:'black',
    fontStyle:'italic',
    fontWeight:"bold",
    color:"grey",
    marginLeft:10,
    fontSize:20
  },
  descriptionText: {
    textAlign:"center",
    marginHorizontal:20,
    color:'black',
    marginBottom:5
  },
  castText: {
    textAlign:"center",
    marginHorizontal:5,
    color:'black',
    marginBottom:5
  },
  ratingContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:"center",
    alignItems:'center', 
    borderColor:'white', 
    borderWidth:1,
  }
})

export default MovieInfoModal;
