# NOSES
### Ilya Minarov, Jacob Rakestraw, Ian O'Rourke
Overview
=================
* Started as a Full Stack Angular/Flask web app for the NOSES database as a project for Cal Poly's CSC 366 class. 
* Extended into Senior Project
* Query, download, upload (by single and bulk) Seal Observations

Features
=================
* Admin User can create/remove accounts
* Admin User can set user priveleges
* Uses Google Firebase for Authentication
* Run queries on full and partial marks and tags
* Filter results by Tags, Marks, and Breeding Season
* Upload observations by single entry and bulk entry
* Download Observations as CSVs
* Separate landing page for observations to be approved by a higher ranking User
* Must have an account to view any page on the website other than Login page
* Deployed live [here](http://34.217.54.156)

Prerequisites
=================
1. Python 3 (https://www.python.org/downloads/)
2. npm (https://www.npmjs.com/get-npm)

Get Started
=================
1. Clone the repo
2. Make sure you have Angular Version 8.3.19, Flask with Python 3
3. cd into the Angular project file noses-db/noses/
* `npm install`
* `npm start`
* NOTE: If any dependency errors are reported, install the dependecy using pip. Ex: `pip install flask`
4. Run the backend:
* Open a new terminal window/tab and cd into noese-db/flask-backend/
* `python main.py` or `python3 main.py`, making sure you run it with Python Version 3 (may vary depending on your Python 3 installation)
* NOTE: If any dependency errors are reported, install the dependecy using pip. Ex: `pip install flask`
5. Open http://localhost:4200/ with both terminal windows open and running
6. Quit each terminal window using CTRL+C when you are finished

Common Errors
=================
1. Wrong Backend Server:
* make sure that if you are developing locally, change the server address in the file `sealqlteam6/noses/src/app/flask-backend.service.ts` to the correct address. The current version of the application runs locally.

