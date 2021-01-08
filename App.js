import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieSearchBar from './components/MovieSearchBar';
import ButtonBar from './components/ButtonBar';
import MovieList from './components/MovieList';
import Spinner from 'react-native-loading-spinner-overlay';
import { ToastProvider } from 'react-native-styled-toast';
import { ThemeProvider } from 'styled-components';
import theme from './components/theme'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight - 1;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const App = () => {
  const [listOfMovies, setListOFMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredState, setFilteredState] = useState(2);   //0 = All, 1 = watched, 2 = unwatched
  const [triggerScrollToEnd, setTriggerScrollToEnd] = useState(false);

  const scrollToEndComplete = () => {
    setTriggerScrollToEnd(false);
  }

  const addMovieToList = (newMovieObj) => {
    const newList = [newMovieObj, ...listOfMovies]
    setListOFMovies(newList);
    saveMovieList(newList);
    setFilteredState(2);
    setTriggerScrollToEnd(true);
  };

  const setWatchedFiltered = () =>{
    setFilteredState(1)
  };

  const setUnwatchedFiltered = () =>{
    setFilteredState(2)
  };

  const setAsWatched = (movieTitle) => {
    const newList = listOfMovies.map(mov => (mov.title === movieTitle ? {...mov, watchedState: 1} : mov))
    setListOFMovies(newList)
    saveMovieList(newList);
  };

  const setUserRatingOfMovie = (movieTitle, ratingValue) => {
    const newList = listOfMovies.map(mov => (mov.title === movieTitle ? {...mov, userRating: ratingValue} : mov))
    setListOFMovies(newList)
    saveMovieList(newList);
  }

  const setAsUnWatched = (movieTitle) => {
    const newList = listOfMovies.map(mov => (mov.title === movieTitle ? {...mov, watchedState: 0} : mov))
    setListOFMovies(newList)
    saveMovieList(newList);
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

  useEffect( () =>{
    loadMovieList();
  }, []);

  const deleteMovieByTitle = (movieTitle) => {
    var newList = listOfMovies.filter( mov => {
      return mov.title !== movieTitle;
    })
    setListOFMovies(newList);
    saveMovieList(newList);
  };

  return (
    <>
    <ThemeProvider theme={theme}>
      <ToastProvider maxToasts={2} position="BOTTOM">
        <View>
          <Spinner
            visible={isLoading}
            textContent={'Loading Saved Movies'}
            textStyle={{color: '#FFF', fontSize:35, fontWeight:'bold'}}
            overlayColor="rgba(0, 0, 0, 0.75)"
          />
          {console.log("all movies: ", listOfMovies)}
          <MyStatusBar backgroundColor='rgba(22,7,92,1)'/>
          <MovieSearchBar addMovie={addMovieToList} currentMovieList={listOfMovies} />
          <ButtonBar 
            filterWatched={setWatchedFiltered} 
            filterUnwatched={setUnwatchedFiltered} 
            currentFilteredState={filteredState}
          />
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
          />
        </View>
      </ToastProvider>
    </ThemeProvider>     
    </>  
  );
};

export default App;
