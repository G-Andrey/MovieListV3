import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator, Text} from 'react-native';
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-native-styled-toast';
import theme from './components/theme'

import MovieSearchBar from './components/MovieSearchBar';
import ButtonBar from './components/ButtonBar';

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
  
  const addMovieToList = (newMovieObj) => {
    const newList = [newMovieObj, ...listOfMovies]
    setListOFMovies(newList);
    // saveMovieList(newList);
    setFilteredState(2);
    // setTriggerScrollToEnd(true);
    setIsLoadingMovie(false)
  };

  const setWatchedFiltered = () =>{
    setFilteredState(1)
  };

  const setUnwatchedFiltered = () =>{
    setFilteredState(2)
  };

  const triggerLoadingMovieIndicator = () => {
    setIsLoadingMovie(true);
  }

  const cancelLoadingMovieIndicator = () => {
    setIsLoadingMovie(false);
  }

  return (
    <ThemeProvider theme={theme}>
      {console.log('MOVIELIST')}
      {console.log(listOfMovies)}
      <ToastProvider maxToasts={2} position="BOTTOM">
        <View>
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