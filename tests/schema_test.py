import sqlite3
from pathlib import Path
import unittest

class VoteConstraints(unittest.TestCase):
 def test_independent_uniqueness_and_campaign_integrity(self):
  db=sqlite3.connect(':memory:')
  db.executescript((Path(__file__).parents[1]/'migrations/0001_initial.sql').read_text())
  for campaign in ['one','two']:
   db.execute("INSERT INTO campaigns VALUES(?,?,'draft','2026-01-01','2027-01-01')",(campaign,campaign))
  db.execute("INSERT INTO candidates VALUES('c','one','Candidate')")
  db.execute("INSERT INTO votes(id,campaign_id,candidate_id,ip_hmac,device_hmac) VALUES('v','one','c','ip1','d1')")
  for vote, campaign, ip, device in [('v2','one','ip1','d2'),('v3','one','ip2','d1'),('v4','two','ip3','d3')]:
   with self.assertRaises(sqlite3.IntegrityError):
    db.execute('INSERT INTO votes(id,campaign_id,candidate_id,ip_hmac,device_hmac) VALUES(?,?,?,?,?)',(vote,campaign,'c',ip,device))
  self.assertEqual(db.execute('SELECT COUNT(*) FROM votes').fetchone()[0],1)

if __name__=='__main__': unittest.main()
