from app import app
from flaskext.mysql import MySQL

mysql = MySQL()
 
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'rcbonill'
app.config['MYSQL_DATABASE_PASSWORD'] = '014505539'
app.config['MYSQL_DATABASE_DB'] = 'rcbonill'
app.config['MYSQL_DATABASE_HOST'] = 'ambari-head.csc.calpoly.edu'
mysql.init_app(app)
