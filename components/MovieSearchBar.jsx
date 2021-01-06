import { SearchBar, Tooltip, Text } from 'react-native-elements';
import React, { useState } from 'react';
import { View } from 'react-native';
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
    var movieTitle = "";
    var movieRating = "";
    var movieDesc = "";
    var watchedState = 0;
    var moviePosterUrl = "";
    var movieGenre = "";
    var movieCast = [];

    //console.log("Starting Webscrape for:",srchTxt)

    //Doing a google search for the movie + "+rotten+tomatoes" to find correct rottentomatoe link
    const googleSearchUrl = "https://www.google.com/search?q=" + srchTxt.replace(" ","+") + "+rotten+tomatoes"
    //console.log("googleSearchUrl",googleSearchUrl);

    const responseGoogle = await fetch(googleSearchUrl,{
      headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
    });
    const htmlOfResponse = await responseGoogle.text();

    const $1 = cheerio.load(htmlOfResponse);

    //Retrieving the rottentomatoe link for the movie
    const rottenTomatoeURL = $1('.yuRUbf > a').first().attr('href')
    //console.log("rt url:", rottenTomatoeURL)

    const responseRottenTomatoe = await fetch(rottenTomatoeURL,{
      headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
    });
    const htmlOfReponseRottenTomatoe = await responseRottenTomatoe.text();

    const $2 = cheerio.load(htmlOfReponseRottenTomatoe)
    
    //Retreiving movie title
    movieTitle = $2(".mop-ratings-wrap__title.mop-ratings-wrap__title--top").text().trim()
    //console.log("Fetched movie title:",movieTitle)

    //Retrieving movie rating
    movieRating = $2("span.mop-ratings-wrap__percentage").first().text().replace(/\s/g,'')
    //console.log("Fetched rating:" , $2("span.mop-ratings-wrap__percentage").first().text().replace(/\s/g,''))

    //Retrieving movie desc
    movieDesc = $2("div#movieSynopsis").text().trim()
    //console.log("Fetched desc:" , $2("div#movieSynopsis").text().trim())

    //Retrieving movie poster
    moviePosterUrl = $2(".posterImage").first().attr('data-src')
    //console.log("Fetched movie poster:", $2(".posterImage").first().attr('data-src'))
    
    //Retrieving movie genre
    movieGenre = $2(".meta-value.genre").text().trim()
      .replace(/\n/g, " ")
      .replace(/ +(?= )/g,'')
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
    // console.log("Fetched movie genre:", $2(".meta-value.genre").text().trim()
    // .replace(/\n/g, " ")
    // .replace(/ +(?= )/g,'')
    // .toLowerCase()
    // .split(' ')
    // .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    // .join(' '))
    
    movieCast.push($2(".characters.subtle.smaller")[0].attribs.title)
    movieCast.push($2(".characters.subtle.smaller")[1].attribs.title)
    movieCast.push($2(".characters.subtle.smaller")[2].attribs.title)
    // console.log("Fetched movie cast:",$2(".characters.subtle.smaller")[0].attribs.title)
    // console.log("Fetched movie cast:",$2(".characters.subtle.smaller")[1].attribs.title)
    // console.log("Fetched movie cast:",$2(".characters.subtle.smaller")[2].attribs.title)

    if (movieTitle == ""){
      toast({
        message: `Could not find ${srchTxt}`,
        intent: 'ERROR',
      })
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
        });
        toast({
          message: `${movieTitle} has been added`,
        });
      }
      else{
        toast({
          message: `${movieTitle} is already on the list`,
        });
      }
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
          containerStyle={{borderBottomColor: 'transparent'}}
          round
        />
      </View>
    </>
  )
};

export default MovieSearchBar;