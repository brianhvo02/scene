# Scene

Scene is a social movie recommendation app. Scene uses TMDB api to recommend movies or help users discover new movies based on the user's inputs. Scene allows userts to create, view, and RSVP to local watch parties at movie theaters. Users are also able to discuss and rate movies like a forum board from and individual movie page. Users are able to delete, edit, and reply to other comments from there. If you're ready to meet locals that enjoy movies as much as yourself, please visit [Scene](https://scene-app.herokuapp.com/).

# Table of Contents

1. [Features](#features)
2. [Technologies](#technologies)
3. [Featured Code](#featured-code)
4. [Contributors](#contributors)
5. [Future Features](#future-features)

## Features

Some features of Scene include:

+ User account creation and log in:
++ <img src="assets/userauth.gif" width="600px"/>
<br>
+ User Profiles:
<br>
<img src="assets/UserProfile.gif" width="600px">
<br>
+ Movie discovery and recommendation using [TMDB API](https://developer.themoviedb.org/docs):
<img src="assets/moviediscover.gif" width="600px">
<br>
+ Movie information/details:
<br>
<img src="assets/movieshow.gif" width="600px">
<br>
+ Movie comments that imitate a reddit-like feel:
<br>
<img src="assets/comments.gif" width="600px">
<br>
+ Movie Ratings:
<br>
<img src="assets/ratings.gif" width="600px">
<br>
+ Event creation to organize a local watch party for "now-playing" movies:
<br>
<img src="assets/event.gif" width="600px">


## Technologies
**Technologies Used:**

### Frontend: 
+ ```REACT```: A free and open-source front-end JavaScript library for building user interfaces based on components.
+ ```JavaScript```: programming language that is one of the core technologies of the World Wide Web.
+ ```HTML5```: markup language used for structuring and presenting content on the World Wide Web.
+ ```SCSS```: A preprocessor scripting language that is interpreted or compiled into Cascading Style Sheets.

### Backend:
+ ```MongoDB```: A source-available cross-platform document-oriented database program.
+ ```Node.js```: An open source, cross-platform runtime environment for executing JavaScript code.
+ ```Mongoose```: A Node. js-based Object Data Modeling (ODM) library for MongoDB.
+ ```Express```: A popular unopinionated web framework, written in JavaScript and hosted within the Node. js runtime environment.

### API:
+ [TMDB API](https://developer.themoviedb.org/docs)
+ [Fandango API](https://developer.fandango.com/)
+ [Google Maps JavaScript API](https://developers.google.com/maps)

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
+ [Brian Huy Vo](https://brianhuyvo.com/): Team Lead
+ [Eduardo Bac Sierra](https://github.com/bann-dito): Backend Lead
+ [Ningxiao Cao](https://github.com/kevinismcao): Frontend Lead
+ [Joshua Lee](https://github.com/joshua-lee-sf): Flex Lead

