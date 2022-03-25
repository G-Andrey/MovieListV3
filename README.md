# Movie-List V3 📝
A mobile app that keeps track of anything and everything you plan on watching (or have already seen)

## Motivation 🎯
I used to keep track of movies that I planned on watching via a simple notes app on my phone. If I had just seen an interesting trailer or spoken to a friend who recommended a movie/show, I would simply open the notes app and write down the name of the movie on a new line. Then, when it came time to watch something new on that list, the same lengthy tedious process began. Go through the entire list, try to remember why you had that movie on the list to begin with, what was that movie even about, check who starred in it, check if it had good ratings, search and watch the trailer again, ... etc. 😤 <br><br>
I decided to address this problem by creating Movie-List V3. Users can type in the name of any movie or show and a robust webscraper behind the scenes retrieves key details about that movie/show which are then saved in the list with persistant storage. Lists in the app are separated into 2 so users can keep track of movies they plan on watching as well as ones they have already seen. The app was built from the ground up with [React Native](https://reactnative.dev/) and implements modern touch controls amongst many other features.

## Compelete App Demo 📽️
https://user-images.githubusercontent.com/42978646/160171763-9e5d6b94-136d-4259-a85c-5526395c72f2.mp4
- The demo above is a compressed and lower quality version to meet GitHub file size requirements. Full hd version can be found here: 
  + [Raw MP4 (GitHub)](https://github.com/G-Andrey/movie-list/blob/master/demo/MovieList_Demo_Full_HD.mp4)
  + [Hosted (Vimeo)](https://vimeo.com/692351954/f5621fe07b)
## Major Implemented Features 🎉
- Made movie search robust
  + Search titles don't have to be correctly spelled since the first layer of webscraping goes through google search
  + You can even find movies/shows by typing in a description or cast name
  + ie: searching: "tom hanks stuck on island" -> retrieves the movie "Cast Away"
- Full persistance. Any changes that are made to lists or movie objects are saved using AsyncStorage and will appear even if app is closed
- Counters of both lists appear on app statup and update automatically as movies are added and moved
- Loading progress icon for user feedback while the webscraper retrieves details
- App splash screen on start-up
- Loading progress screen while both lists are retrieved from storage and rendered
- Swiping list item to the right marks a movie as watched/unwatched
- Swiping list item to the left reveals a button for deleting a movie
- Long pressing a list item makes it dragable so lists can be reordered, perhaps by user interest in a movie
- Short pressing a list item reveals a modal displaying all of the movie's details:
  + Title
  + Youtube trailer link
  + Genre
  + Rotten tomatoes rating
  + Synopsis
  + Cast
  + Date movie was added to list
- Long pressing movie title in modal makes it editable
- Titles that are shows are marked with a "(s.)" in the name
- Each movie object has its own user rating and user comment box
  + Users can set their own rating for the movie giving it 0-9 stars
  + Users can add their own comments to each movie, ie: what they thought about it, where they found out about it, ...
- Haptic feedback when actions are performed using [Expo Haptics](https://docs.expo.dev/versions/v44.0.0/sdk/haptics/):
  + Movie/show added to list
  + Movie deleted
  + Movie marked as watched/unwatched
  + Movie is in dragable state
- If list is empty, eye emoji that wiggles is displayed 👀👀👀
- Toast notifications for user feedback when events occur:
  + Webscraper found movie and added to list
  + Webscraper did not find movie
  + Webscraper found movie but it's already in the list
  + Movie deleted from list
  + Movie marked as watched/unwatched
