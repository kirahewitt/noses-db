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

Get Started
=================
1. Clone the repo
2. Make sure you have Angular Version 8.3.19, Flask with Python 3
4. Run the backend:
* cd into flask-backend
* `python main.py`, making sure you run it with Python Version 3
3. cd into the Angular project file noses/
* `npm install`
* `npm start`
* Install Dependencies until it works.


Common Errors
=================
1. Wrong Backend Server:
* make sure that if you are developing locally, change the server address in the file `sealqlteam6/noses/src/app/flask-backend.service.ts` to the correct address. The current version of the application runs locally.

