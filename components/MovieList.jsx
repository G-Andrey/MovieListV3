import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Image, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import IconDelete from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEye from 'react-native-vector-icons/Ionicons';
import { useToast } from 'react-native-styled-toast';
import NoMoviesFound from './NoMoviesFound';
import MovieInfoModal from './MovieInfoModal';

const RightActions = ({progress, dragX, onPress}) => {
  const scale = dragX.interpolate({
    inputRange: [-100,0],
    outputRange: [1,0],
    extrapolate: 'clamp'
  })
  return (
    <TouchableOpacity onPress={onPress} style={{marginBottom:5}}>
      <View style={{backgroundColor:'#ff0000', justifyContent:'center', textAlign:"center",alignItems:'flex-end',height:'100%'}}>
        <Animated.Text style={[{color:'#fff', fontWeight:'bold', paddingLeft:20,paddingRight:20, fontSize:20}, {transform: [{scale}]}]}>
          DELETE
        </Animated.Text>
        <IconDelete name="delete" size={50} style={[{color:'#fff',marginRight:30}]}/>
      </View>
    </TouchableOpacity>
  )
}

const leftActionUnwatched = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [0,100],
    outputRange: [0,1],
    extrapolate: 'clamp'
  })
  return (
    <View style={{backgroundColor:"green",justifyContent:"center",flex:1,marginBottom:5}}>
      <Animated.Text style={[{color:'#fff', fontWeight:'bold', paddingLeft:10,paddingRight:10, fontSize:20}, {transform: [{scale}]}]}>
        SET WATCHED
      </Animated.Text>
      <IconEye name="eye" size={50} style={[{color:'#fff',marginLeft:50}]}/>
    </View>
  )
}

const leftActionWatched = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [0,100],
    outputRange: [0,1],
    extrapolate: 'clamp'
  })
  return (
    <View style={{backgroundColor:"#458cff",justifyContent:"center",flex:1,marginBottom:5}}>
      <Animated.Text style={[{color:'#fff', fontWeight:'bold', paddingLeft:10,paddingRight:10, fontSize:20}, {transform: [{scale}]}]}>
        SET UNWATCHED
      </Animated.Text>
      <IconEye name="eye-off" size={50} style={[{color:'#fff',marginLeft:60}]}/>
    </View>
  )
}

const MovieList = (props) => { 
  const flatListRef = useRef()
  const { toast } = useToast()
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentMovie, setCurrentMovie] = useState({});

  const setModalOn = (item) => {
    setModalVisible(true);
    setCurrentMovie(item);
  }

  const setModalOff = () => {
    setModalVisible(false);
  }

  const handleEndScroll = () => {
    if(props.handleScrollEnd){
      flatListRef.current.scrollToIndex({animated: true, index: 0})
      props.setScrollEndComplete()
    }
  }

  useEffect( () =>{
    handleEndScroll();
  }, [props.handleScrollEnd]);

  const onRightPress = (movieTitle) => {
    props.deleteMovie(movieTitle)
    toast({
      message: `${movieTitle} deleted`,
      intent: 'ERROR',
    })
  }

  const handleSetWatched = (movieTitle) => {
    props.setWatched(movieTitle)
    toast({
      message: `${movieTitle} set as watched`,
      iconColor: '#7DBE31',
      iconFamily: 'Ionicons',
      iconName: 'eye',
    })
  }

  const handleSetUnwatched = (movieTitle) => {
    props.setUnwatched(movieTitle)
    toast({
      message: `${movieTitle} set as unwatched`,
      iconColor: '#458cff',
      iconFamily: 'Ionicons',
      iconName: 'eye-off',
      accentColor: '#458cff',
    })
  }

  const handleUserRating = (rating) => {
    props.setNewUserRating(currentMovie.title, rating)
  }

  const renderItem = ({ item, index }) => (
    <>
    <Swipeable
      renderLeftActions={item.watchedState == 0 ? leftActionUnwatched : leftActionWatched}
      onSwipeableLeftOpen={item.watchedState == 0 ? () => handleSetWatched(item.title) : (() => handleSetUnwatched(item.title))}
      renderRightActions={(progress, dragX) => <RightActions progress={progress} dragX={dragX} onPress={() => onRightPress(item.title)}/>}
    > 
        <View style={[{flex:1, flexDirection:'row',height:150,borderTopColor:'white',borderBottomColor:'white',borderLeftColor:'white',borderRightColor:'white',borderWidth:1,backgroundColor:'white',marginBottom:5}]}>
          <View style={{flex:.8,textAlign:'center',justifyContent:'center',marginRight:5}}>
            <TouchableOpacity onPress={() => setModalOn(item)}>
              <Text numberOfLines={2} style={{fontSize:30,fontWeight:"bold",marginLeft:10,textAlign:'center',marginBottom:10}}>
                {item.title}
              </Text>
              <Text numberOfLines={4} style={{color:"grey",paddingBottom:5,overflow:"hidden",marginLeft:10,marginBottom:5}}>
                {item.description}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{width:1,height:110,borderColor:'grey',borderWidth:1,justifyContent:'center',marginTop:20,marginBottom:20,marginRight:5,marginLeft:5}}>
          </View>
          <View style={{flex:.2,justifyContent:'center',alignItems:'center'}}>
            <Image
              source={require('../assets/rt.png')}
              style={{ width: 40, height: 40,marginBottom:10}}
            />
            <Text h3 style={{color:"red"}}>
              {item.rating}
            </Text>
          </View>
        </View>
    </Swipeable>
    </>
  );

  return(
    <View style={{height:'85%',backgroundColor:"#bababa"}}>
        {props.allMoviesList.length == 0 ? 
            <NoMoviesFound/>
          :
          <>
            <FlatList
              ref={flatListRef}
              data={props.allMoviesList}
              renderItem={renderItem}
              keyExtractor={item => item.title}
              contentContainerStyle={{ paddingBottom: 60}}
              getItemLayout={(data, index) => (
                {length: 150, offset: 0, index}
              )}
              initialNumToRender={5}
            />
            <MovieInfoModal isVisible={isModalVisible} modalOff={setModalOff} movieObj={currentMovie} updateUserMovieRating={handleUserRating}/>         
          </>
        }
    </View>
  )
}

const styles = StyleSheet.create({
  watched : {
    borderBottomColor:"green",
    borderWidth:2
  },
  unwatched : {
    borderBottomColor:"blue",
    borderWidth:2
  }
});

export default MovieList;