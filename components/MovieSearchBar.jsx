import { SearchBar } from 'react-native-elements';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import cheerio from 'cheerio-without-node-native';
import { useToast } from 'react-native-styled-toast'

const MovieSearchBar = (props) => {
  const [movieSearchText, setMovieSearchText] = useState('');
  const { toast } = useToast()
  
  const handleSearchSubmit = () => {
    webScrapeMovieData(movieSearchText);
    setMovieSearchText('');
  };

  const webScrapeMovieData = async(srchTxt) => {
    props.triggerLoading()
    var movieTitle = "";
    var movieRating = "";
    var movieDesc = "";
    var watchedState = 0;
    var moviePosterUrl = "";
    var movieGenre = "";
    var movieCast = [];
    var rottenTomatoeURL = "";
    var youtubeTrailerUrl = "";

    try{
      //Doing a google search for the movie + "+rotten+tomatoes" to find correct rottentomatoe link
      var googleSearchUrl = "https://www.google.com/search?q=" + srchTxt.replace(" ","+") + "+rotten+tomatoes"

      var responseGoogle = await fetch(googleSearchUrl,{
        headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
      });
      var htmlOfResponse = await responseGoogle.text();

      var $1 = cheerio.load(htmlOfResponse);

      //Retrieving the rottentomatoe link for the movie
      rottenTomatoeURL = $1('.yuRUbf > a').first().attr('href')

      if(!rottenTomatoeURL.includes("https://www.rottentomatoes.com/")){
        toast({
          message: `Could not find the right rotten tomatoes url for "${srchTxt}"`,
          intent: 'ERROR',
        })
        props.cancelMovieLoading()
        return
      }
      // if(!rottenTomatoeURL.includes("https://www.rottentomatoes.com/m/")){
      //   toast({
      //     message: `"${srchTxt}" is not a movie so some information may not be available`,
      //     iconColor: '#f8fc03',
      //     iconFamily: 'MaterialCommunityIcons',
      //     iconName: 'exclamation-thick',
      //     accentColor: '#f8fc03',
      //   })
      // }

      //Rotten tomatoes url is a "m": movie
      else if (rottenTomatoeURL.includes('https://www.rottentomatoes.com/m/')){
        console.log(rottenTomatoeURL)
        const responseRottenTomatoe = await fetch(rottenTomatoeURL,{
          headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
        });
        const htmlOfReponseRottenTomatoe = await responseRottenTomatoe.text();
  
        $1 = cheerio.load(htmlOfReponseRottenTomatoe)
        
        //Retreiving movie title
        movieTitle = $1(".mop-ratings-wrap__title.mop-ratings-wrap__title--top").text().trim()
        //console.log("Fetched movie title:",movieTitle)
  
        //Retrieving movie rating
        movieRating = $1("span.mop-ratings-wrap__percentage").first().text().replace(/\s/g,'')
        //console.log("Fetched rating:" , $1("span.mop-ratings-wrap__percentage").first().text().replace(/\s/g,''))
  
        //Retrieving movie desc
        movieDesc = $1("div#movieSynopsis").text().trim()
        //console.log("Fetched desc:" , $1("div#movieSynopsis").text().trim())
  
        //Retrieving movie poster
        moviePosterUrl = $1(".posterImage").first().attr('data-src')
        //console.log("Fetched movie poster:", $1(".posterImage").first().attr('data-src'))
        
        //Retrieving movie genre
        movieGenre = $1(".meta-value.genre").text().trim()
          .replace(/\n/g, " ")
          .replace(/ +(?= )/g,'')
          .toLowerCase()
          .replace(" and", ",")
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')
        // console.log("Fetched movie genre:", $1(".meta-value.genre").text().trim()
        // .replace(/\n/g, " ")
        // .replace(/ +(?= )/g,'')
        // .toLowerCase()
        // .split(' ')
        // .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        // .join(' '))
        
        movieCast.push($1(".characters.subtle.smaller")[0].attribs.title)
        movieCast.push($1(".characters.subtle.smaller")[1].attribs.title)
        movieCast.push($1(".characters.subtle.smaller")[2].attribs.title)
        // console.log("Fetched movie cast:",$1(".characters.subtle.smaller")[0].attribs.title)
        // console.log("Fetched movie cast:",$1(".characters.subtle.smaller")[1].attribs.title)
        // console.log("Fetched movie cast:",$1(".characters.subtle.smaller")[2].attribs.title)
  
        //Retrieving youtube trailer link from google, getting the href of thhe top result
        googleSearchUrl = "https://www.google.com/search?q=" + srchTxt.replace(" ","+") + "+youtube+trailer"
  
        responseGoogle = await fetch(googleSearchUrl,{
          headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
        });
  
        htmlOfResponse = await responseGoogle.text();
  
        $1 = cheerio.load(htmlOfResponse);
  
        youtubeTrailerUrl = $1('.yuRUbf > a').first().attr('href')
  
        if (movieTitle == ""){
          toast({
            message: `Could not find ${srchTxt}`,
            intent: 'ERROR',
          })
          props.cancelMovieLoading()
        }
        else{
          //checks if newly scraped movie title is already in the list
          if(props.currentMovieList.find( mov => mov.title == movieTitle) == undefined){
            props.addMovie({
              title: movieTitle,
              description: movieDesc,
              rating: movieRating,
              watchedState: watchedState,  // 0 = unwatched, 1 = watched
              moviePosterUrl: moviePosterUrl,
              genre: movieGenre,
              cast: movieCast,
              rtUrl: rottenTomatoeURL,
              trailerUrl: youtubeTrailerUrl,
              userRating: 5,
            });
            toast({
              message: `${movieTitle} has been added`,
            });
          }
          else{
            toast({
              message: `${movieTitle} is already on the list`,
            });
            props.cancelMovieLoading()
          }
        }
      }

      //Rotten tomatoes url is a "tv": show 
      else if (rottenTomatoeURL.includes('https://www.rottentomatoes.com/tv/')){

        const responseRottenTomatoe = await fetch(rottenTomatoeURL,{
          headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
        });
        const htmlOfReponseRottenTomatoe = await responseRottenTomatoe.text();
  
        $1 = cheerio.load(htmlOfReponseRottenTomatoe)
        
        //Retreiving movie title
        movieTitle = $1(".mop-ratings-wrap__title.mop-ratings-wrap__title--top").text().trim()
        //console.log("Fetched movie title:",movieTitle)
  
        //Retrieving movie rating
        movieRating = $1("span.mop-ratings-wrap__percentage").first().text().replace(/\s/g,'')
        //console.log("Fetched rating:" , $1("span.mop-ratings-wrap__percentage").first().text().replace(/\s/g,''))
  
        //Retrieving movie desc
        movieDesc = $1("div#movieSynopsis").text().trim()
        //console.log("Fetched desc:" , $1("div#movieSynopsis").text().trim())
  
        //Retrieving movie poster
        moviePosterUrl = $1(".posterImage").first().attr('data-src')
        //console.log("Fetched movie poster:", $1(".posterImage").first().attr('data-src'))
        
        //Retrieving movie genre
        movieGenre = $1(".meta-value.genre").text().trim()
          .replace(/\n/g, " ")
          .replace(/ +(?= )/g,'')
          .toLowerCase()
          .replace(" and", ",")
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ')
        // console.log("Fetched movie genre:", $1(".meta-value.genre").text().trim()
        // .replace(/\n/g, " ")
        // .replace(/ +(?= )/g,'')
        // .toLowerCase()
        // .split(' ')
        // .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        // .join(' '))
        
        movieCast.push($1(".characters.subtle.smaller")[0].attribs.title)
        movieCast.push($1(".characters.subtle.smaller")[1].attribs.title)
        movieCast.push($1(".characters.subtle.smaller")[2].attribs.title)
        // console.log("Fetched movie cast:",$1(".characters.subtle.smaller")[0].attribs.title)
        // console.log("Fetched movie cast:",$1(".characters.subtle.smaller")[1].attribs.title)
        // console.log("Fetched movie cast:",$1(".characters.subtle.smaller")[2].attribs.title)
  
        //Retrieving youtube trailer link from google, getting the href of thhe top result
        googleSearchUrl = "https://www.google.com/search?q=" + srchTxt.replace(" ","+") + "+youtube+trailer"
  
        responseGoogle = await fetch(googleSearchUrl,{
          headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
        });
  
        htmlOfResponse = await responseGoogle.text();
  
        $1 = cheerio.load(htmlOfResponse);
  
        youtubeTrailerUrl = $1('.yuRUbf > a').first().attr('href')
  
        if (movieTitle == ""){
          toast({
            message: `Could not find ${srchTxt}`,
            intent: 'ERROR',
          })
          props.cancelMovieLoading()
        }
        else{
          //checks if newly scraped movie title is already in the list
          if(props.currentMovieList.find( mov => mov.title == movieTitle) == undefined){
            props.addMovie({
              title: movieTitle,
              description: movieDesc,
              rating: movieRating,
              watchedState: watchedState,  // 0 = unwatched, 1 = watched
              moviePosterUrl: moviePosterUrl,
              genre: movieGenre,
              cast: movieCast,
              rtUrl: rottenTomatoeURL,
              trailerUrl: youtubeTrailerUrl,
              userRating: 5,
            });
            toast({
              message: `${movieTitle} has been added`,
            });
          }
          else{
            toast({
              message: `${movieTitle} is already on the list`,
            });
            props.cancelMovieLoading()
          }
        }
      }
      
      else{
        toast({
          message: `Could not find "${srchTxt}"`,
          intent: 'ERROR',
        })
      }
    }
    catch (err){
      console.log(err);
      toast({
        message: `Could not find "${srchTxt}"`,
        intent: 'ERROR',
      })
      props.cancelMovieLoading()
    }
  };

  return (
    <>
      <View>
        <SearchBar 
          placeholder="Search For a Movie..."
          onChangeText={(search) => setMovieSearchText(search)}
          value={movieSearchText}
          onSubmitEditing={()=> handleSearchSubmit()}
          searchIcon={{ size: 25 }}
          containerStyle={styles.searchContainer}
          round
        />
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  searchContainer: {
    borderBottomColor: 'transparent',
    backgroundColor:'grey',
    paddingBottom:0
  }
})

export default MovieSearchBar;