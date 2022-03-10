import React, { useState,useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const ButtonBar = (props) => {
	const [allClicked,setAllClicked] = useState(false)
  const [watchClicked,setWatchClicked] = useState(false)
  const [unwatchedClicked,setUnwatchedClicked] = useState(true)

	//0 = All, 1 = watched, 2 = unwatched
  const handleClick = (whichButton) => {
    if (whichButton == 0) {
      props.filterAll()
      setAllClicked(true)
      setWatchClicked(false)
      setUnwatchedClicked(false)
    }
    else if (whichButton == 1){
      props.filterWatched()
      setAllClicked(false)
      setWatchClicked(true)
      setUnwatchedClicked(false)
    }
    else if (whichButton == 2){
      props.filterUnwatched()
      setAllClicked(false)
      setWatchClicked(false)
      setUnwatchedClicked(true)
    }
  };

  useEffect( () => {
    handleClick(props.currentFilteredState)
  }, [props.currentFilteredState]);

  return (
    <View style={styles.componentContainerView}>
      <TouchableOpacity style={{flex:1}} onPress={() => handleClick(2)}>
        <View style={[styles.defaultView, unwatchedClicked ? styles.selectedView : null]}>
          <Text style={[styles.defaultText, unwatchedClicked ? styles.selectedText : null]}>
            Unwatched
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{flex:1}} onPress={() => handleClick(1)}>
        <View style={[styles.defaultView, watchClicked ? styles.selectedView : null]}>
        <Text style={[styles.defaultText, watchClicked ? styles.selectedText : null]}>
            Watched
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    componentContainerView: {
      flexDirection:"row",
      height:50
    },  
    defaultView: {
      backgroundColor:'grey',
      height:"100%",
      flex:1, 
      justifyContent:'center', 
      textAlign:"center",
      borderLeftColor:"grey",
      borderRightColor:"grey", 
      borderTopColor:"grey",
      borderWidth:3,
      borderBottomColor:"grey"
    },
    defaultText: {
      textAlign:'center',
      fontSize:20, 
      fontWeight:"bold",
      color:'#c9c9c9'
    },
    selectedText: {
      color:"#FFF"
    },
    selectedView: {
      borderBottomColor:"#FFF"
    }
  });
  
  export default ButtonBar;