import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './SongScreen.css';
import NotFound from './NotFound';

function SongScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const audioRef = useRef(new Audio());

    const [song, setSong] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        fetch(`https://lab4-jsframeworks-production.up.railway.app/api/songs/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setSong(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading song', error);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!song) return;

        audio.src = song.audio;
        

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.pause();
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [song]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    if (loading) return <p>loading song...</p>

    if (!loading && !song) {
        return <NotFound />;
    }

    console.log(audioRef);
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = (e) => {
        const time = parseFloat(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="song-screen">
            <div className="song-container">
                <img 
                    src={song.cover} 
                    alt={song.title}
                    className="song-cover"
                />

                <div className="song-info">
                    <h1 className="song-title">{song.title}</h1>
                    <p className="song-artist">{song.artist}</p>
                </div>

                <div className="player-controls">
                    <div className="progress-container">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="progress-bar"
                        />
                        <div className="time-display">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="buttons-container">
                        <button 
                            className="btn-control"
                            onClick={() => navigate('/')}
                            title="Back to home"
                        >
                            ⏮
                        </button>
                        <button 
                            className={`btn-control btn-play ${isPlaying ? 'playing' : ''}`}
                            onClick={togglePlayPause}
                            title={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                        <button 
                            className="btn-control"
                            onClick={() => setCurrentTime(0)}
                            title="Restart song"
                        >
                            🔄
                        </button>
                    </div>

                    <div className="volume-container">
                        <span className="volume-icon">🔊</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                            title="Volume"
                        />
                    </div>
                </div>

                <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}

export default SongScreen;