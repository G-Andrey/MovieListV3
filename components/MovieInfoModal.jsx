import React from 'react';
import { Linking } from 'react-native';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import { Button } from 'react-native-elements';

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
        <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.7)'}}>
          <TouchableOpacity style={{flex:1}} onPress={() => props.modalOff()} activeOpacity={1}>
            <TouchableWithoutFeedback onPress={() => {}} >
              <View style={{margin: 20,backgroundColor: "white",marginBottom:100,borderRadius:5,maxHeight:"95%"}}>
                <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold",marginVertical:5}}>
                  {props.movieObj.title}
                </Text>
                <Seperator/>
                <ScrollView>
                  <View onStartShouldSetResponder={() => true}>
                    <View style={{flex:1,flexDirection:'row',justifyContent:"center",marginTop:10,marginBottom:5}}>
                      {props.movieObj.moviePosterUrl ? 
                        <Image 
                          source={{uri: props.movieObj.moviePosterUrl }}
                          style={{width:309,height:458, borderColor:'black', borderWidth:1,}}
                          >
                        </Image>
                        :
                          null
                      }
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:"center", borderColor:'white', borderWidth:1,}}> 
                      {/* <TouchableOpacity onPress={() => Linking.openURL(props.movieObj.rtUrl)} style={{justifyContent:'center',alignItems:"center",marginHorizontal:10}}>
                        <Image
                          source={require('../assets/rt.png')}
                          style={{ width: 40, height: 40}}
                        />
                        <Text style={{textAlign:"center",color: 'red', fontWeight:"bold",fontStyle:'italic'}}>
                          Rotten Tomatoes
                        </Text>
                      </TouchableOpacity> */}
                      <TouchableOpacity onPress={() => Linking.openURL(props.movieObj.trailerUrl)} style={{justifyContent:'center',alignItems:"center"}} >
                        <Image
                          source={require('../assets/yt.png')}
                          style={{ width: 40, height: 40}}
                        />
                        <Text style={{textAlign:"center",color: 'red', fontWeight:"bold",fontStyle:'italic'}}>
                          Youtube Trailer
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex:1,flexDirection:'row',justifyContent:"center",marginVertical:5}}>                      
                      <View>
                        <Text style={{color:'black',fontStyle:'italic',fontWeight:"bold",color:"grey",marginLeft:5,fontSize:20}}>
                          GENRE
                        </Text>
                        <Text style={{textAlign:"center",color:'black',marginBottom:5}}>
                          {props.movieObj.genre}
                        </Text>
                        <Text style={{color:'black',fontStyle:'italic',fontWeight:"bold",color:"grey",marginLeft:5,fontSize:20}}>
                          DESCRIPTION
                        </Text>
                        <Text style={{textAlign:"center",marginHorizontal:20,color:'black',marginBottom:5}}>
                          {props.movieObj.description}
                        </Text>
                        <Text style={{color:'black',fontStyle:'italic',fontWeight:"bold",color:"grey",marginLeft:5,fontSize:20}}>
                          CAST
                        </Text>
                        <Text style={{textAlign:"center",marginHorizontal:5,color:'black',marginBottom:5}}>
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
                        <Text style={{color:'black',fontStyle:'italic',fontWeight:"bold",color:"grey",marginLeft:5,fontSize:20}}>
                          RATE MOVIE
                        </Text>
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

export default MovieInfoModal;
