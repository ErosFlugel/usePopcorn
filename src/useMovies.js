import { useState, useEffect } from 'react';

const EROSKEY = '99267784';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  //Logic for what happens whenever the search-bar is updated
  useEffect(() => {
    //AbortController is a Browser API just like fetch, it will be used to abort a fetch when we want and that makes a lot of sence while rendering components in react, specially this one that fetchs from the omdbapi averytime the search bar changes its value, that creates a lot of new requests and overlaps each one so it will be better to abort them and just get the complete results from the last fetch
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        //This is for displaying the loading view while the fetching takes place
        setIsLoading(true);

        //Always remember to clean the error state, otherwise if you get an error at some point in your code and want to run this code again it will keep the previous error in the error state and therefore you will start everything again with an old error in your system
        setError('');

        //Basic fetch | Use a second argument in the fetch to declare an object with the signal property in order to use the AbortController function correctly
        const res = await fetch(`http://www.omdbapi.com/?apikey=${EROSKEY}&s=${query}`, {
          signal: controller.signal,
        });

        // Covering errors within the try-catch (.ok from the fetch result is a property to check if everything was ok during the fetching)
        if (!res.ok) throw new Error('Something went wrong with fetching movies');

        const data = await res.json();

        // data.Response is a property from the API that we use in our advantage but usually is a boolean and can be named randomly
        if (data.Response === 'False') throw new Error('Movie not found');

        setMovies(data.Search);
        //Jhonas used this line of code before but I don't think it is needed so I commented it out
        // setError('');
      } catch (err) {
        // When the fetch is aborted using AbortController, it will pass as an error but it is not actually one for us unless it happnes with the final fetch but in this case we just need to check if the error comes from the AbortController and it comes with the .name property set to 'AbortError', those ones needs to be omitted
        if (err.name !== 'AbortError') {
          console.error(err.message);
          //In React We hadle errors manually in states
          setError(err.message);
        }
      } finally {
        // Very good usage for handling the loading view since whatever outcome it results we need to display an answer and not a loading view
        setIsLoading(false);
      }
    }

    if (query.length < 2) {
      setMovies([]);
      setError('');
      return;
    }

    //This is for closing the movieDetails view if we change the search query
    //Jonas was not prepared for what it causes so he wouldnt handle a solution for this error
    // callback?.();

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
