import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Text} from 'react-native';
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-native-styled-toast';
import theme from './components/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import MovieSearchBar from './components/MovieSearchBar';
import ButtonBar from './components/ButtonBar';
import MovieList from './components/MovieList';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight - 1;

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const App = () => {
  const [filteredState, setFilteredState] = useState(1);   //0 = All, 1 = watched, 2 = unwatched
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [triggerScrollToEnd, setTriggerScrollToEnd] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [listOfWatchedMovies, setListOfWatchedMovies] = useState([]); //Array to store all watched movie objects
  const [listOfUnwatchedMovies, setListOfUnwatchedMovies] = useState([]); //Array to store all unwatched movie objects
  
  const addMovieToList = (newMovieObj) => {
    const newList = [newMovieObj, ...listOfUnwatchedMovies]
    setListOfUnwatchedMovies(newList);
    saveMovieList(newList, 2);
    setFilteredState(2);
    setTriggerScrollToEnd(true);
    setIsLoadingMovie(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  };

  const deleteMovieByTitle = (movieTitle) => {
    //remove movie from unwatched list
    if (filteredState === 2){
      var newList = listOfUnwatchedMovies.filter( mov => {
        return mov.title !== movieTitle;
      })
      setListOfUnwatchedMovies(newList);
    }

    //remove movie from watched list
    else if (filteredState === 1){
      var newList = listOfWatchedMovies.filter( mov => {
        return mov.title !== movieTitle;
      })
      setListOfWatchedMovies(newList);
    }
    saveMovieList(newList, filteredState);
  };

  const setAsWatched = (movieTitle) => {
    var listUnwatched = [...listOfUnwatchedMovies];
    
    var index = listUnwatched.findIndex(obj => obj.title === movieTitle);
    var movieObj = listUnwatched.splice(index, 1)[0];
    movieObj.watchedState = 1;

    var listWatched = [movieObj, ...listOfWatchedMovies]

    setListOfWatchedMovies(listWatched);
    setListOfUnwatchedMovies(listUnwatched);
    saveMovieList(listWatched, 1);
    saveMovieList(listUnwatched, 2);
    // setFilteredState(1);
  };

  const setAsUnWatched = (movieTitle) => {
    var listWatched = [...listOfWatchedMovies];
    
    var index = listWatched.findIndex(obj => obj.title === movieTitle);
    var movieObj = listWatched.splice(index, 1)[0];
    movieObj.watchedState = 0;

    var listUnwatched = [movieObj, ...listOfUnwatchedMovies]

    setListOfWatchedMovies(listWatched);
    setListOfUnwatchedMovies(listUnwatched);
    saveMovieList(listWatched, 1);
    saveMovieList(listUnwatched, 2);
    // setFilteredState(2);
  };

  const setUserRatingOfMovie = (movieTitle, ratingValue) => {
    //set user rating for movie from unwatched list
    if (filteredState === 2){
      const newList = listOfUnwatchedMovies.map(mov => (mov.title === movieTitle ? {...mov, userRating: ratingValue} : mov))
      setListOfUnwatchedMovies(newList);
      saveMovieList(newList, 2);
    }

    //set user rating for movie from watched list
    else if (filteredState === 1){
      const newList = listOfWatchedMovies.map(mov => (mov.title === movieTitle ? {...mov, userRating: ratingValue} : mov))
      setListOfWatchedMovies(newList);
      saveMovieList(newList, 1);
    }
  };

  const editTitle = (currTitle, newTitle) => {
    //edit title of movie from unwatched list
    if (filteredState === 2){
      var data = [...listOfUnwatchedMovies];
      var index = data.findIndex(obj => obj.title === currTitle);
      data[index].title = newTitle;
      setListOfUnwatchedMovies(data);
      saveMovieList(data, filteredState);
    }

    //edit title of movie from watched list
    else if (filteredState === 1){
      var data = [...listOfWatchedMovies];
      var index = data.findIndex(obj => obj.title === currTitle);
      data[index].title = newTitle;
      setListOfWatchedMovies(data);
      saveMovieList(data, filteredState);
    }
  };

  /*
    called from movielist.js after a rowItem is dragged up/down the list
    saves the new order of the list
    filtered state is checked to see which list was reordered
  */
  const updateMovieListOrder = (listUpdateOrder) => {
    //update order of unwatched list
    if (filteredState === 2){
      setListOfUnwatchedMovies(listUpdateOrder);
      saveMovieList(listUpdateOrder, 2);
    }

    //update order of watched list
    else if (filteredState === 1){
      setListOfWatchedMovies(listUpdateOrder);
      saveMovieList(listUpdateOrder, 1);
    }
  };

  const saveMovieList = async(updatedList, whichList) => {
    try{
      //save unwatched movie list
      if (whichList === 2){
        const json = JSON.stringify(updatedList)
        await AsyncStorage.setItem('@movie_list_unwatched',json)
      }

      //save watched movie list
      else if (whichList === 1){
        const json = JSON.stringify(updatedList)
        await AsyncStorage.setItem('@movie_list_watched',json)
      }

    }
    catch(e){
      console.log("saving failed")
    }
  };

  const loadMovieList = async() => {
    setIsLoading(true)
    try{
      const res1 = await AsyncStorage.getItem('@movie_list_unwatched')
      if (res1 != null){
        setListOfUnwatchedMovies(JSON.parse(res1))
      }
      else{
        console.log("loading unwatched movie list failed")
      }

      const res2 = await AsyncStorage.getItem('@movie_list_watched')
      if (res2 != null){
        setListOfWatchedMovies(JSON.parse(res2))
        setFilteredState(2)
        setIsLoading(false)
      }
      else{
        console.log("loading watched movie list failed")
        setFilteredState(2)
        setIsLoading(false)
      }
    }
    catch(e){
      console.log(e)
    }
  };

  const setWatchedFiltered = () => {
    setFilteredState(1)
  };

  const setUnwatchedFiltered = () => {
    setFilteredState(2)
  };

  const triggerLoadingMovieIndicator = () => {
    setIsLoadingMovie(true);
  };

  const cancelLoadingMovieIndicator = () => {
    setIsLoadingMovie(false);
  };

  const scrollToEndComplete = () => {
    setTriggerScrollToEnd(false);
  };

  useEffect( () => {
    loadMovieList();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider maxToasts={2} position="BOTTOM">
        <GestureHandlerRootView>
        <View>
          <Spinner
            visible={isLoading}
            textContent={'Loading Saved Movies'}
            textStyle={{color: '#FFF', fontSize:35, fontWeight:'bold'}}
            overlayColor="rgba(0, 0, 0, 0.75)"
          />
          <MyStatusBar backgroundColor='grey'/>
          <MovieSearchBar addMovie={addMovieToList} currentWatchedMovieList={listOfWatchedMovies} currentUnwatchedMovieList={listOfUnwatchedMovies} triggerLoading={triggerLoadingMovieIndicator} cancelMovieLoading={cancelLoadingMovieIndicator}/>
          <ButtonBar 
            filterWatched={setWatchedFiltered} 
            filterUnwatched={setUnwatchedFiltered} 
            currentFilteredState={filteredState}
            listSizeWatched={listOfWatchedMovies.length}
            listSizeUnwatched={listOfUnwatchedMovies.length}
          />
          <View style={styles.filteredTabSeperator}>
          </View>
          {isLoadingMovie ? 
            <View style={styles.loadingTab}>
              <ActivityIndicator size="large" color="#fff" animating={true} style={{marginRight:10}} />
              <Text style={styles.loadingText}>
                Searching for Movie
              </Text>
            </View>
            : 
            null
          }
          <MovieList 
            allMoviesList={
              filteredState == 1 ?
                listOfWatchedMovies  
              :
              filteredState == 2 ?
                listOfUnwatchedMovies
              : null
            }   
            deleteMovie={deleteMovieByTitle}
            setWatched={setAsWatched}
            setUnwatched={setAsUnWatched}
            handleScrollEnd={triggerScrollToEnd}
            setScrollEndComplete={scrollToEndComplete}
            setNewUserRating={setUserRatingOfMovie}
            setNewTitle={editTitle}
            updateListOrder={updateMovieListOrder}
          />
        </View>
        </GestureHandlerRootView>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  loadingTab: {
    flexDirection:'row',
    backgroundColor:'grey',
    paddingTop:5,
    paddingBottom:5,
    justifyContent:"center",
    alignItems:"center"
  },
  loadingText: {
    color:"#fff",
    fontWeight:"bold",
    fontSize:15
  },
  filteredTabSeperator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2
  }
});