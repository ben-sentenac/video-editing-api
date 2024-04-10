CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(255),
    name VARCHAR(255),
    extension VARCHAR(10),
    user_id VARCHAR(255),
    extracted_audio BOOLEAN,
    dimensions VARCHAR(50),
    resizes JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);