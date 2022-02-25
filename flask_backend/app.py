from flask import Flask
from flask_cors import CORS, cross_origin


app = Flask(__name__)
app._static_folder = './static'
cors = CORS(app)
