import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { ToastProvider } from 'react-native-styled-toast';
import theme from './components/theme'

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight - 1;

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const App = () => {
  const [listOfMovies, setListOFMovies] = useState([]); //Array to store all movie objects
  

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider maxToasts={2} position="BOTTOM">
        <View>
          <MyStatusBar backgroundColor='grey'/>
          <Text>
            TESTSETETSTETS
          </Text>
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