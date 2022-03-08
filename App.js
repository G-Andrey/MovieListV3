import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Text} from 'react-native';
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-native-styled-toast';
import theme from './components/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

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
  const [listOfMovies, setListOFMovies] = useState([]); //Array to store all movie objects
  const [filteredState, setFilteredState] = useState(2);   //0 = All, 1 = watched, 2 = unwatched
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [triggerScrollToEnd, setTriggerScrollToEnd] = useState(false);
  const [isLoading, setIsLoading] = useState();
  
  const addMovieToList = (newMovieObj) => {
    const newList = [newMovieObj, ...listOfMovies]
    setListOFMovies(newList);
    saveMovieList(newList);
    setFilteredState(2);
    setTriggerScrollToEnd(true);
    setIsLoadingMovie(false)
  };

  const deleteMovieByTitle = (movieTitle) => {
    var newList = listOfMovies.filter( mov => {
      return mov.title !== movieTitle;
    })
    setListOFMovies(newList);
    saveMovieList(newList);
  };

  const setAsWatched = (movieTitle) => {
    var data = [...listOfMovies];
    var index = data.findIndex(obj => obj.title === movieTitle);
    data[index].watchedState = 1;
    setListOFMovies(data);
    saveMovieList(data);
  };

  const setAsUnWatched = (movieTitle) => {
    const newList = listOfMovies.map(mov => (mov.title === movieTitle ? {...mov, watchedState: 0} : mov))
    setListOFMovies(newList)
    saveMovieList(newList);
  };

  const setUserRatingOfMovie = (movieTitle, ratingValue) => {
    const newList = listOfMovies.map(mov => (mov.title === movieTitle ? {...mov, userRating: ratingValue} : mov))
    setListOFMovies(newList)
    saveMovieList(newList);
  };

  const editTitle = (currTitle, newTitle) => {
    var data = [...listOfMovies];
    var index = data.findIndex(obj => obj.title === currTitle);
    data[index].title = newTitle;
    setListOFMovies(data);
    saveMovieList(data);
  };

  const saveMovieList = async(updatedList) => {
    try{
      const json = JSON.stringify(updatedList)
      await AsyncStorage.setItem('@movie_list',json)
    }
    catch(e){
      console.log("saving failed")
    }
  };

  const loadMovieList = async() =>{
    setIsLoading(true)
    try{
      const res = await AsyncStorage.getItem('@movie_list')
      if (res != null){
        setListOFMovies(JSON.parse(res))
        setIsLoading(false)
      }
      else{
        console.log("loading failed")
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
        <View>
          <Spinner
            visible={isLoading}
            textContent={'Loading Saved Movies'}
            textStyle={{color: '#FFF', fontSize:35, fontWeight:'bold'}}
            overlayColor="rgba(0, 0, 0, 0.75)"
          />
          <MyStatusBar backgroundColor='grey'/>
          <MovieSearchBar addMovie={addMovieToList} currentMovieList={listOfMovies} triggerLoading={triggerLoadingMovieIndicator} cancelMovieLoading={cancelLoadingMovieIndicator}/>
          <ButtonBar 
            filterWatched={setWatchedFiltered} 
            filterUnwatched={setUnwatchedFiltered} 
            currentFilteredState={filteredState}
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
                listOfMovies.filter(mov => (mov.watchedState == 1))  
              :
              filteredState == 2 ?
                listOfMovies.filter(mov => (mov.watchedState == 0))
              : null      
            }   
            deleteMovie={deleteMovieByTitle}
            setWatched={setAsWatched}
            setUnwatched={setAsUnWatched}
            handleScrollEnd={triggerScrollToEnd}
            setScrollEndComplete={scrollToEndComplete}
            setNewUserRating={setUserRatingOfMovie}
            setNewTitle={editTitle}
          />
        </View>
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