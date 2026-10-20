CREATE TABLE roles(key TEXT PRIMARY KEY,name TEXT NOT NULL,permissions TEXT NOT NULL DEFAULT '[]');
CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT,discord_id TEXT UNIQUE NOT NULL,username TEXT,avatar TEXT,role_key TEXT REFERENCES roles(key),department TEXT,created_at INTEGER);
CREATE TABLE sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL,expires_at INTEGER NOT NULL,revoked INTEGER DEFAULT 0);
CREATE TABLE cases(id INTEGER PRIMARY KEY AUTOINCREMENT,case_number TEXT UNIQUE,title TEXT,status TEXT,created_by INTEGER,created_at INTEGER);
CREATE TABLE files(id INTEGER PRIMARY KEY AUTOINCREMENT,r2_key TEXT UNIQUE,name TEXT,mime TEXT,size INTEGER,folder_id INTEGER,owner_id INTEGER,deleted INTEGER DEFAULT 0,created_at INTEGER);
CREATE TABLE access_log(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,file_id INTEGER,action TEXT,at INTEGER);
CREATE TABLE discord_events(id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT,severity TEXT,actor_id TEXT,target_id TEXT,channel_id TEXT,payload TEXT,at INTEGER);
CREATE INDEX idx_events_at ON discord_events(at);
INSERT INTO roles VALUES
('system_administrator','System Administrator','["*"]'),
('chief_justice','Chief Justice','["*"]'),
('attorney_general','Attorney General','["cases.read","cases.write","drive.read","drive.write","reports.read","news.read","notifications.read"]'),
('records_administrator','Records Administrator','["cases.read","drive.read","drive.write","reports.read"]'),
('department_personnel','Department Personnel','["cases.read","drive.read","news.read","notifications.read"]');
