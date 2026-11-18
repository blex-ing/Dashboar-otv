PRAGMA foreign_keys = ON;
CREATE TABLE campaigns (id TEXT PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','open','closed')), opens_at TEXT NOT NULL, closes_at TEXT NOT NULL, CHECK(opens_at < closes_at));
CREATE TABLE candidates (id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL REFERENCES campaigns(id), public_name TEXT NOT NULL, UNIQUE(campaign_id,id));
CREATE TABLE tasks (id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL REFERENCES campaigns(id), title TEXT NOT NULL, weight REAL NOT NULL CHECK(weight > 0), UNIQUE(campaign_id,id));
CREATE TABLE evaluations (campaign_id TEXT NOT NULL, candidate_id TEXT NOT NULL, task_id TEXT NOT NULL, score REAL NOT NULL CHECK(score BETWEEN 0 AND 10), PRIMARY KEY(campaign_id,candidate_id,task_id), FOREIGN KEY(campaign_id,candidate_id) REFERENCES candidates(campaign_id,id), FOREIGN KEY(campaign_id,task_id) REFERENCES tasks(campaign_id,id));
CREATE TABLE votes (id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL, candidate_id TEXT NOT NULL, ip_hmac TEXT NOT NULL, device_hmac TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(campaign_id,candidate_id) REFERENCES candidates(campaign_id,id), UNIQUE(campaign_id,ip_hmac), UNIQUE(campaign_id,device_hmac));
CREATE INDEX votes_candidate ON votes(campaign_id,candidate_id);
