import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";

function Home() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://lab4-jsframeworks-production.up.railway.app/api/songs')
            .then((response) => response.json())
            .then((data) => {
                setSongs(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading songlist:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="home-screen">
            <div className="home-container">
                <header className="home-header">
                    <h1 className="home-title">My Media Library</h1>
                    <p className="home-subtitle">Choose song for listening</p>
                </header>

                {loading ? (
                    <div className="home-loading">Loading songs...</div>
                ) : (
                    <section className="songs">
                        {songs.map(song => (
                            <div className="btnSong" key={song.id}>
                                <Link to={`/songs/${song.id}`} className="song-card-link">
                                    <div className="card-cover-wrapper">
                                        <img 
                                            src={song.cover} 
                                            alt={song.title} 
                                            className="card-cover"
                                        />
                                        <div className="card-play-badge">▶</div>
                                    </div>
                                    <div className="card-title">{song.title}</div>
                                    <div className="card-artist">{song.artist}</div>
                                </Link>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}

export default Home;