from app import app 
from flaskext.mysql import MySQL

mysql = MySQL()
 
# Configuration - localhost
# app.config['MYSQL_DATABASE_USER'] = 'root'
# app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
# app.config['MYSQL_DATABASE_DB'] = 'sealDB'
# app.config['MYSQL_DATABASE_HOST'] = 'localhost'

# Configuration - AWS iorourke@calpoly.edu
app.config['MYSQL_DATABASE_USER'] = ''
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = ''
app.config['MYSQL_DATABASE_HOST'] = ''

mysql.init_app(app)
