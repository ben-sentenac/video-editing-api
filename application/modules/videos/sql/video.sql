CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(255),
    name VARCHAR(255),
    original_name VARCHAR(255),
    extension VARCHAR(10),
    user_id VARCHAR(255),
    extracted_audio BOOLEAN,
    dimensions VARCHAR(50),
    resizes JSON,
    thumbnail VARCHAR(50),
    deleted BOOLEAN DEFAULT 0,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);