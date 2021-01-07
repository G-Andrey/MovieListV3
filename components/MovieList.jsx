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
    <TouchableOpacity onPress={onPress} style={{marginBottom:10}}>
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
    <View style={{backgroundColor:"green",justifyContent:"center",flex:1,marginBottom:10}}>
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
    <View style={{backgroundColor:"#458cff",justifyContent:"center",flex:1,marginBottom:10}}>
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
      console.log("scrollend?: ",props.handleScrollEnd)
      flatListRef.current.scrollToEnd()
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
      message: `${movieTitle} set as watched`
    })
  }

  const handleSetUnwatched = (movieTitle) => {
    props.setUnwatched(movieTitle)
    toast({
      message: `${movieTitle} set as unwatched`,
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
      <Card 
        containerStyle={[{margin:0,marginBottom:10,paddingBottom:15,paddingTop:0}, item.watchedState == 0 ? styles.unwatched : styles.watched]}
      >
        <TouchableOpacity onPress={() => setModalOn(item)} >
          <Card.Title h2>
            {item.title}
          </Card.Title>
        </TouchableOpacity>
        <View style={{flexDirection: "row", paddingBottom:20,alignItems: 'center',justifyContent: 'center'}}>
          <Image
            source={require('../assets/rt.png')}
            style={{ width: 40, height: 40, marginRight:10 }}
          />
          <Text h3 style={{color:"red"}}>
            {item.rating}
          </Text>
        </View>
        <Card.Divider/>
        <Text>
          {item.description}
        </Text>
      </Card>
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