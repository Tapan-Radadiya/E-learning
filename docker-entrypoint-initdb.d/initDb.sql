-- For Now To Not To Make Heavy Docker Image We Are Creating Single Instance With Multiple DB 
-- Letter At Scaling Time We Can Use Our database_up.yaml File To Spawn Seperate Database Server To Each Service(Scaling)
-- This Will Only Run At First Time When Docker Tries To Mount To Rerun This Script Remove The Volume And Try Docker Compose Up

CREATE DATABASE jarvis_db;
CREATE DATABASE vision_db;
CREATE DATABASE friday_db;
CREATE DATABASE pheonix_db;
CREATE DATABASE quick_silver_db;

CREATE USER Jarvis WITH PASSWORD 'Jarvis';
CREATE USER Vision WITH PASSWORD 'Vision';
CREATE USER Friday WITH PASSWORD 'Friday';
CREATE USER Pheonix WITH PASSWORD 'Pheonix';
CREATE USER QuickSilver WITH PASSWORD 'QuickSilver';

GRANT ALL PRIVILEGES ON DATABASE jarvis_db TO Jarvis;
GRANT ALL PRIVILEGES ON DATABASE vision_db TO Vision;
GRANT ALL PRIVILEGES ON DATABASE friday_db TO Friday;
GRANT ALL PRIVILEGES ON DATABASE pheonix_db TO Pheonix;
GRANT ALL PRIVILEGES ON DATABASE quick_silver_db TO QuickSilver;