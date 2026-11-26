const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// This API is intentionally public for the local frontend. The default CORS
// configuration allows every origin and handles OPTIONS requests as well.
app.use(cors({ origin: '*' }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const songs = [{
    id: 1,
    cover: "cover/hay zeleniy hay.jpg",
    title: "Гай, зелений гай",
    artist: "Назарій Яремчук",
    audio: "mp3/nazariy-yaremchuk-hay-zeleniy-hay.mp3"
  },
  {
    id: 2,
    cover: "cover/Little V. - Red Like Roses, Pt. 2.jpg",
    title: "Red Like Roses, Pt.2",
    artist: "Little V.",
    audio: "mp3/Little V. - Red Like Roses, Pt. 2.mp3"
  },
  {
    id: 3,
    cover: "cover/Songs Part Two.jpg",
    title: "Caffeine",
    artist: "Jeff Williams feat. Casey Lee Williams & Lamar Hall",
    audio: "mp3/Caffeine.mp3"
  },
  {
    id: 4,
    cover: "cover/Twilight Symphony.jpg",
    title: "Twilight Symphony",
    artist: "Thousand Leaves",
    audio: "mp3/Twilight Symphony.mp3" 
  },
  {
    id: 5,
    cover: "cover/The Gates of Shambhala.jpg",
    title: "The Gates of Shambhala",
    artist: "Nameless One",
    audio: "mp3/The Gates of Shambhala.mp3"
  }
];

app.get('/api/songs', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const songsWithFullUrls = songs.map(song => ({
        ...song,
        cover: `${baseUrl}/${encodeURI(song.cover)}`,
        audio: `${baseUrl}/${encodeURI(song.audio)}`
    }));

    res.json(songsWithFullUrls);
});

app.get('/api/songs/:id', (req, res) => {
    const song = songs.find(s => s.id === parseInt(req.params.id));
    if (!song) return res.status(404).json({ message: 'Трек не знайдено' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json({
        ...song,
        cover: `${baseUrl}/${encodeURI(song.cover)}`,
        audio: `${baseUrl}/${encodeURI(song.audio)}`
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    console.error(`Unable to start the API on port ${PORT}:`, error.message);
});
