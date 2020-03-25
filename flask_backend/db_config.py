from app import app 
from flaskext.mysql import MySQL

mysql = MySQL()
 
# MySQL configurations
#app.config['MYSQL_DATABASE_USER'] = 'kbleich'
#app.config['MYSQL_DATABASE_PASSWORD'] = 'abc123'
#app.config['MYSQL_DATABASE_DB'] = 'kbleich'
#app.config['MYSQL_DATABASE_HOST'] = 'ambari-head.csc.calpoly.edu'

<<<<<<< HEAD
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'toor'
app.config['MYSQL_DATABASE_DB'] = 'sealDB'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
=======
# Configuration - localhost
# app.config['MYSQL_DATABASE_USER'] = 'root'
# app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
# app.config['MYSQL_DATABASE_DB'] = 'sealDB'
# app.config['MYSQL_DATABASE_HOST'] = 'localhost'
>>>>>>> 4c574e441213a7c6b4ba3b2d8fc8c86c4eb042d1

# Configuration - AWS iorourke@calpoly.edu
app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'csc492_ij'
app.config['MYSQL_DATABASE_DB'] = 'sealDB'
app.config['MYSQL_DATABASE_HOST'] = 'database-this-is-the-last-time.cvrgneqrnjcb.us-east-2.rds.amazonaws.com'

mysql.init_app(app)
