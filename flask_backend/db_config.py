from app import app 
from flaskext.mysql import MySQL

mysql = MySQL()
 
# Configuration - localhost
# app.config['MYSQL_DATABASE_USER'] = 'root'
# app.config['MYSQL_DATABASE_PASSWORD'] = 'password'
# app.config['MYSQL_DATABASE_DB'] = 'sealDB'
# app.config['MYSQL_DATABASE_HOST'] = 'localhost'

# Configuration - AWS iorourke@calpoly.edu
app.config['MYSQL_DATABASE_USER'] = 'admin'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'sealDB'
app.config['MYSQL_DATABASE_HOST'] = 'noses-sealdb.cbhu3f3kpqob.us-east-1.rds.amazonaws.com'

mysql.init_app(app)
