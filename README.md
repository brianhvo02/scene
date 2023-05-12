# Scene

Scene is a social movie recommendation app. Scene uses TMDB api to recommend movies or help users discover new movies based on the user's inputs. Scene allows userts to create, view, and RSVP to local watch parties at movie theaters. Users are also able to discuss and rate movies like a forum board from and individual movie page. Users are able to delete, edit, and reply to other comments from there. If you're ready to meet locals that enjoy movies as much as yourself, please visit [Scene](https://scene-app.herokuapp.com/).

# Table of Contents

1. [Features](#features)
2. [Technologies](#technologies)
3. [Featured Code](#featured-code)
4. [Contributors](#contributors)
5. [Future Features](#future-features)

## Features

Scene is broken down into 4 core features:
+ User account creation and log in
+ Movie discovery and recommendation using [TMDB API](https://developer.themoviedb.org/docs)
+ Movie information/details, reddit-like forum, and rating from a movie's individual page
+ Event creation to organize a local watch party for "now-playing" movies

## Technologies
**Technologies Used:**
+ MongoDB
+ Express
+ REACT
+ JavaScript
+ Node.js
+ HTML5
+ SCSS
+ [TMDB API](https://developer.themoviedb.org/docs)
+ [Fandango API](https://developer.fandango.com/)
+ [Google Maps JavaScript API]()

## Featured Code
**Code to handle Carousel**: 
```JS
    const handlePrevClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies?.length - 1 : prevIndex - 1));
        setSelectedMovie();
    }

    const handleNextClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === movies?.length - 1 ? 0 : prevIndex + 1));
        setSelectedMovie();
    }
```

**Initial Fetch to TMDB API**:
```JS
// custom TMDB fetch
export const fetchTMDB = (route, params) => fetch(`https://api.themoviedb.org/3${route}?api_key=${tmdbAPIKey}&${params}`).then(res => res.json());
const allowedParams = ["id", "title", "overview", "poster_path", "backdrop_path", "genre_ids", "alternative_titles", "runtime", "tagline"];

// TMDB Discover Fetch For Discover Carousel
router.get('/discover', async (req, res) => {
    const query = new URLSearchParams(req.query);
    const { results } = await fetchTMDB('/discover/movie', query.toString() + "&include_adult=false");
    const movies = Object.fromEntries(results.map(result => [result.id, extractAllowedParams(allowedParams, result)]));
    res.status(200).json({ movies });
});

// TMDB REcommendation fetch after "liking a movie"
router.get('/movies/:movieId/recommendations', async (req, res) => {
    const { movieId } = req.params;
    const { results } = await fetchTMDB(`/movie/${movieId}/recommendations`);
    const movies = results ? Object.fromEntries(results.map(result => [result.id, extractAllowedParams(allowedParams, result)])) : null;
    res.status(200).json({ movies });
});
```

**Recursive Comments Function**: We programmed the comments to be able to reply to other comments and thus, displaying the comments had to be a recursive tree traversal function that uses Depth First Search to find the final child comment and begins displaying comments from there.
```JS
const Comment = ({ id, body, author, children }) => {
        return (
            <div className='comment'>
                <div className='comment-body-box' onMouseEnter={() => setActiveComment(id)} onMouseLeave={() => setActiveComment()}>
                    <span>
                        <p className='comment-username'>{author.username}:</p>
                        <p className='comment-body'>{body}</p>
                    </span>
                    <span>
                        {
                            (activeComment === id || replyComment === id || edit === id) && body !== '[DELETED]' &&
                            <>
                                {
                                    author._id === currentUser._id &&
                                    <button className='event-create-button' 
                                        onClick={
                                            () => {
                                                setEdit(id);
                                                setReplyComment();
                                                setReplyUser();
                                                scrollToTop();
                                            }
                                        }>Edit</button>
                                }
                                {
                                    author._id === currentUser._id &&
                                    <button className='event-create-button' 
                                        onClick={
                                            () => dispatch(deleteComment(id, movie.tmdbId))
                                        }>Remove</button>
                                }
                                <button className='event-create-button'
                                    onClick={
                                        () => {
                                            setReplyComment(id);
                                            setReplyUser(author.username);
                                            setEdit();
                                            scrollToTop();
                                        }
                                    }>Reply</button>
                            </>
                        }
                    </span>
                </div>
                <div className='children'>
                    {
                        children.map(child => <Comment key={child._id} id={child._id} body={child.body} author={child.author} children={child.childrenComments} />)
                    }
                </div>
            </div>
        )
    }

```

**Splash Page Polaroid Display/Shuffle**: This code does a fetch from TMDB and displays the posters from the movies into an awesomely built splash page.
```JS
    useEffect(()=>{
        dispatch(fetchNowPlayingMovies());
    }, [dispatch]);

    useEffect(()=> {
        setMoviePolaroids(shuffle(movies).slice(0, 14))
        setSloganPage(0)
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(()=>{
                setMoviePolaroids(shuffle(movies).slice(0, 14));
                setSloganPage((prev) => (prev + 1) % 3);
                setFadeIn(true);
            }, 800);
        }, 8000);
        return () => {
            clearInterval(interval);
        }
    },[movies]);
```
## Contributors

Scene was made with love from these fine gentlemen/software engineers:
+ [Brian Huy Vo](): Team Lead
+ [Eduardo Bac Sierra](): Backend Lead
+ [Ningxiao Cao](): Frontend Lead
+ [Joshua Lee](): Flex Lead

## Future Features
+ Search bar
+ Account Profiles
