from flask import Flask
from flask_cors import CORS, cross_origin


app = Flask(__name__)
app._static_folder = './static'
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
# app.config['CORS_HEADERS'].add('Access-Control-Allow-Origin', '*')

# added to fix the cross routing error
@app.route("/")
def helloWorld():
   return "Hello, cross-origin-world!"