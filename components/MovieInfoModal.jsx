import React from 'react';
import { Linking } from 'react-native';
import { View, Text, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import { Button } from 'react-native-elements';

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
                <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold", marginTop:10}}>
                  {props.movieObj.title}
                </Text>
                <View style={{marginTop:10,borderBottomColor: 'grey',borderBottomWidth: 2}}>
                </View>
                <ScrollView style={{marginTop:10}}>
                  <View onStartShouldSetResponder={() => true} style={{justifyContent:"center", alignItems:"center"}}>
                    {props.movieObj.moviePosterUrl ? 
                      <Image 
                        source={{uri: props.movieObj.moviePosterUrl }}
                        style={{width:309,height:458, borderColor:'black', borderWidth:1,}}
                        >
                      </Image>
                      :
                        null
                    }
                    <Text style={{textAlign:"center",marginTop:10,marginLeft:10, marginRight:10}}>
                      {props.movieObj.description}
                    </Text>
                    <Text style={{textAlign:"center",marginTop:10,marginLeft:10, marginRight:10}}>
                      {props.movieObj.genre}
                    </Text>
                    {props.movieObj.cast ? 
                      props.movieObj.cast.map( character => (
                        <Text key={character}>
                          {character}
                        </Text>
                      ))
                      :
                      <Text>
                        Cast Not Found
                      </Text>
                    }
                    <TouchableOpacity onPress={() => Linking.openURL(props.movieObj.rtUrl)} >
                      <Text style={{textAlign:"center",marginTop:10,marginLeft:10, marginRight:10, color: 'red', fontWeight:"bold",textDecorationLine: 'underline',fontStyle: 'italic' }}>
                        Rotten Tomatoes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(props.movieObj.trailerUrl)} >
                      <Text style={{textAlign:"center",marginTop:10,marginLeft:10, marginRight:10, color: 'red', fontWeight:"bold",textDecorationLine: 'underline',fontStyle: 'italic' }}>
                        Youtube Trailer
                      </Text>
                    </TouchableOpacity>
                  </View>                 
                </ScrollView>
                <Button
                  title="Close"
                  onPress={() => props.modalOff()}
                  containerStyle={{marginTop:10}}
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
