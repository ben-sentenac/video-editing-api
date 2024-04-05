CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    videoId VARCHAR(255),
    name VARCHAR(255),
    extension VARCHAR(10),
    userId VARCHAR(255),
    extractedAudio BOOLEAN,
    dimensions VARCHAR(50),
    resizes JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);