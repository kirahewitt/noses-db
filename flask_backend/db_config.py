from app import app 
from flaskext.mysql import MySQL

mysql = MySQL()
 
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'kbleich'
app.config['MYSQL_DATABASE_PASSWORD'] = 'abc123'
app.config['MYSQL_DATABASE_DB'] = 'kbleich'
app.config['MYSQL_DATABASE_HOST'] = 'ambari-head.csc.calpoly.edu'
mysql.init_app(app)
