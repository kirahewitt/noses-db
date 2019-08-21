from app import app 
from flaskext.mysql import MySQL

mysql = MySQL()
 
# MySQL configurations
#app.config['MYSQL_DATABASE_USER'] = 'kbleich'
#app.config['MYSQL_DATABASE_PASSWORD'] = 'abc123'
#app.config['MYSQL_DATABASE_DB'] = 'kbleich'
#app.config['MYSQL_DATABASE_HOST'] = 'ambari-head.csc.calpoly.edu'

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
app.config['MYSQL_DATABASE_DB'] = 'sealDB'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


mysql.init_app(app)
