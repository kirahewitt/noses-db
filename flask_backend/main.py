import pymysql
import pandas as pd
import json
from app import app
from ETL3 import startUpdate
from db_config import mysql
from flask import jsonify
from flask import flash, request
from flask import g, Flask
import json
import logging
#from werkzeug import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin
CORS(app)

bleh = Flask(__name__)

# Deletes a particular observation from the database
@app.route('/delete', methods=['POST', 'GET'])
def delete_user():
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'POST':
            print("in delete")
            _json = request.json
            obs = _json['obsID']
            tag1 = _json['tag1']
            mark = _json['Mark']

            cursor.execute("DELETE FROM ObserveSeal WHERE ObservationID=" + str(obs))
            cursor.execute("DELETE FROM ObserveMarks WHERE ObservationID=" + str(obs))
            cursor.execute("DELETE FROM ObserveTags WHERE ObservationID=" + str(obs)) 

            if tag1 != None:
                cursor.execute("DELETE FROM Tags WHERE TagNumber=" + tag1)

            if mark != None:
                cursor.execute("DELETE FROM Marks WHERE MarkID=" + str(mark))

            cursor.execute("DELETE FROM Seals WHERE ObservationID=" + str(obs))
            cursor.execute("DELETE FROM Measurements WHERE ObservationID=" + str(obs))
            cursor.execute("DELETE FROM Observations WHERE ObservationID=" + str(obs))

            conn.commit()
            resp = jsonify('User deleted successfully!')
            resp.status_code = 200
            return jsonify('deleted something')
        else:
            return jsonify('no delete')
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# While we want to support preventing users from being able to log in by deleting their accounts
#  some entities in the has foreign keys tied to User. So instead of deleting a user we just set 
#  their permission level to 0.
@app.route('/removeuser', methods=['POST', 'GET'])
def remove_user():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)
  try:
    if request.method == 'POST':
      print("in delete users")
      _json = request.json
      email = _json['email']
      print(_json)
      cursor.execute("Update Users Set isAdmin=-1 where email=\'" + email + "\';")

      conn.commit()
      cursor.execute("SELECT * from Users Where isAdmin >= 0;")

      rows = cursor.fetchall()
      resp = jsonify(rows)
      return resp
    else:
      return jsonify('no delete')
  except Exception as e:
    print(e)
  finally:
    cursor.close()
    conn.close()


## updates the database with a new permissions level of the user
## b/c this is the only thing that can currently be changed about
## an account. Then it gets all the users again to display any changes.
## That logic to get the users again shouldn't be here. 
@app.route('/updateuser', methods=['POST', 'GET'])
def update_user():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)
  try:
    if request.method == 'POST':
      _json = request.json
      email = _json['email']
      priv = _json['isAdmin']
      print(_json)

      cursor.execute("Update Users Set isAdmin="+ str(priv) + " where email=\'" + email + "\';")
      conn.commit()
      cursor.execute("SELECT * from Users Where isAdmin >= 0;")

      rows = cursor.fetchall()
      resp = jsonify(rows)
      return resp
    else:
      return jsonify('no delete')
  except Exception:
    return jsonify(1)
  finally:
    cursor.close()
    conn.close()


@app.route('/submit-userPasswordChangeRequest', methods=['POST', 'GET'])
def submit_userPasswordChangeRequest():
  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    
    if request.method == 'POST':
      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)

      email = _json['email']
      oldPassword = _json['oldPassword']
      newPassword = _json['newPassword']

      # get the current password 
      currentPassword = get_password_forUserEmail(email)

      if (currentPassword == oldPassword):
        updatePasswordQuery = ("UPDATE Users SET Password=" + surr_apos(newPassword) + " WHERE Email=" + surr_apos(email) + ";")

        cursor.execute(updatePasswordQuery)

        # store the response and return it as json
        rows = cursor.fetchall()
        resp = jsonify(rows)
        conn.commit()

        return jsonify("Success: The overwrite of the former password was successful")

      else:
        return jsonify("Error: The value in 'Old Password' is incorrect.")

    else:
      return jsonify("Error: Received unexpected GET request. Expected POST")
      
  except Exception as e:
    print("Error(submit-userPasswordChangeRequest): ")
    print(e)

  finally:
    cursor.close()
    conn.close()



# Gets the current password for a particular user
def get_password_forUserEmail(email):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query = ("SELECT * FROM Users WHERE Email=" + surr_apos(email) + ";")
    cursor.execute(query)
    rows = cursor.fetchall()

    currentPassword = rows[0]['Password']
    return currentPassword

  except Exception as e:
    print("Error(get_password_forUserEmail): ")
    print(e)

  finally:
    cursor.close()
    conn.close()


## Adds a new user account request as a parallel pair of tuples belonging 
## to the Users and Observations entity sets.
@app.route('/submit-new-userAccountRequest', methods=['POST', 'GET'])
def submit_new_userAccountRequest():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':

      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)

      # store all the variables
      firstName = _json['firstName']
      lastName = _json['lastName']
      email = _json['email']
      password = _json['password']

      # determine the next UserID and the next ObsID, for the Users and Observers entity sets, respectively.
      nextUserId = int(getLatestUser()) + 1
      nextObserverId = int(getLatestObserver()) + 1

      # verify that we're not going to attempt to add a user for an email already in use
      emailAlreadyInUse = isEmailInUseByAnyUser(email)
      if (emailAlreadyInUse):
        raise Exception("A verified user with that email already exists in this system.") 

      # try to make the observer tuple first
      submit_new_userAccountRequest_ObserverHelper(firstName, lastName, email, password, nextObserverId)

      # store user vars
      userQuery_nextUserId = str(nextUserId)
      userQuery_username = email                       # given
      userQuery_password = password                    # given
      userQuery_initials = firstName[0] + lastName[0]  # get first character of first and last name for initials
      userQuery_isAdmin = str(0)                       # can't be an admin b/c this is just a request
      userQuery_affiliation = ""                       # won't have any affiliation by default
      userQuery_email = email                          # given
      userQuery_obsID = str(nextObserverId)            # 
      userQuery_isVerifiedByAdmin = str(0)             # Can't be a verified user because this is just a request.

      # make a new object/query for the user
      # username, password, initials, isAdmin, affiliation, email, obsID, isVerifiedByAdmin
      query = (" INSERT INTO Users (UserID, Username, Password, Initials, isAdmin, Affiliation, Email, ObsID, isVerifiedByAdmin) VALUES( " + 
               " " + userQuery_nextUserId + ", " + 
               " " + surr_apos(userQuery_username) + ", " + 
               " " + surr_apos(userQuery_password) + ", " + 
               " " + surr_apos(userQuery_initials) + ", " + 
               " " + userQuery_isAdmin + ", " + 
               " " + surr_apos(userQuery_affiliation) + ", " + 
               " " + surr_apos(userQuery_email) + ", " + 
               " " + userQuery_obsID + ", " + 
               " " + userQuery_isVerifiedByAdmin + ") " + ";")

      print("query to execute:")
      print(query)

      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      conn.commit()
      return resp

    else:
      return jsonify("Error: Received unexpected GET request. Expected POST")

  except Exception as e:
    print("Error(submit-new-userAccountRequest): ")
    print(e)

  finally:
    cursor.close()
    conn.close()


## Retrieves the Observers tuple with the highest integer value
def getLatestObserver():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query_latestObserverID = "SELECT * FROM Observers ORDER BY ObsID DESC LIMIT 1;"
    cursor.execute(query_latestObserverID)
    rows = cursor.fetchall()

    obsId = rows[0]['ObsID']
    return obsId

  except Exception as e:
    print("Error(getLatestObserver): ")
    print(e)

  finally:
    cursor.close()
    conn.close()


## Retrieves the Users tuple with the highest integer value
def getLatestUser():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query_latestUserID = "SELECT * FROM Users ORDER BY UserID DESC LIMIT 1;"
    cursor.execute(query_latestUserID)
    rows = cursor.fetchall()
    
    userId = rows[0]['UserID']
    return userId
    
  except Exception as e:
    print("Error(getLatestUser): ")
    print(e)

  finally:
    cursor.close()
    conn.close()


## Deftermines is a particular email is already in use by some user
def isEmailInUseByAnyUser(email):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query = (" SELECT * " +
              " FROM  Users " +
              " WHERE Email = " + surr_apos(email) + ";")
    cursor.execute(query)
    rows = cursor.fetchall()
    resp = jsonify(rows)

    emailAlreadyInUse = len(rows) > 0
    return emailAlreadyInUse

  except Exception as e:
    print("Error(submit_new_userAccountRequest_ObserverHelper): ")
    print(e)

  finally:
    cursor.close()
    conn.close()


## Receives the information to create the observer
## This method has a few jobs
##  (1) determine whether a user with that name already exists
##  (2) if user exists, return an id of -1, otherwise, use one query to create the user, and user another query to retrieve its Observation ID and return that.
##
## NOTE: this method a boolean indicating whether adding the observer was successful.
def submit_new_userAccountRequest_ObserverHelper(firstName, lastName, email, password, nextObserverId):
  
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query = (" INSERT INTO Observers (ObsID, FirstName, LastName, isVerifiedByAdmin) VALUES( " + 
              " " + str(nextObserverId) + ", " +
              " " + surr_apos(firstName) + ", " +
              " " + surr_apos(lastName) + ", " +
              " " + str(0) + ");")
    print("*** printing the query we made:")
    print(query)

    # (2) execute the query 
    cursor.execute(query)
    rows = cursor.fetchall()
    conn.commit()
    
  except Exception as e:
    print("Error(submit_new_userAccountRequest_ObserverHelper): ")
    print(e)

  finally:
    cursor.close()
    conn.close()


## Gets the relevant information for a seal with the provided ID
@app.route('/getseal-with-sealid', methods=['POST', 'GET'])
def get_seal_with_sealId():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':

      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)

      # store the id of the seal we want to access
      sealId = _json

      #make a query to get all the tuples with a matching sealId
      query = (" SELECT * " +
               " FROM  Seals " +
               " WHERE SealID = " + surr_apos(str(sealId)) + ";")

      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      print("\n\n NOW PRINTING THE RESPONSE FROM THE SERVER FOR SEAL ID \n\n")
      print(rows)

      return resp
    else:
      return jsonify("no seal was clicked")

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()


# get-IDing-observations-with-sealid
@app.route('/get-IDing-observations-with-sealid', methods=['POST', 'GET'])
def get_IDing_observations_with_sealId():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':

      # print("\n\n\n\nvalue of _json")
      # print(_json)

      # get the input from the person accessing this REST endpoint
      _json = request.json
      sealId = _json

      query = (" SELECT obs.ObservationID, obs.ObserverID, obs.Sex, obs.Date, obs.MoltPercent, obs.Comments, obs.AgeClass, obs.Year, obs.SLOCode, obs.isApproved, obs.LastSeenPup, obs.FirstSeenWeaner, obs.WeanDateRange, obs.EnteredInAno, obs.isProcedure, obs.isDeprecated " + 
               " FROM Observations as obs, ObserveSeal as obsSeal, Seals " + 
               " WHERE obs.ObservationID = obsSeal.ObservationID AND Seals.ObservationID = obsSeal.ObservationID AND obsSeal.SealID = " + surr_apos(str(sealId)) + ";")

      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      print("\n\n NOW PRINTING THE RESPONSE FROM THE SERVER FOR SEAL ID \n\n")
      print(rows)

      return resp
    else:
      return jsonify("no seal was clicked")

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()





# @app.route("/saveUserEditChanges")
# def saveUserEditChanges():
#   conn = mysql.connect()
#   cursor = conn.cursor(pymysql.cursors.DictCursor)

#   try:
#     if request.method == 'POST':
#       #do stuff

#       _json = request.json
#       userId = _json['userId']
#       username = _json['username']
#       initials = _json['initials']
#       isAdmin = _json['isAdmin']
#       affiliation = _json['affiliation']
#       email = _json['email']
#       obsId = _json['obsId']
#       isVerifiedByAdmin = _json['isVerifiedByAdmin']
#       firstName = _json['firstName']
#       lastName = _json['lastName']

#       query = ("Update Users ")

#     else:
#       print("Request method was for GET instead of POST")


#   except Exception as e:
#     print(e)

#   finally:
#     cursor.close()
#     conn.close()




## This function needs to perform an Update query, overwriting the values for the following attributes:
##  In User:
##    - Username, Initials, isAdmin, Affiliation, Email, isVerifiedByAdmin
##  In Observer:
##    - FirstName
##    - LastName
##    - isVerifiedByAdmin
@app.route("/saveUserEditChanges", methods=['POST'])
def saveUserEditChanges():

  print("\n\n\n\n MADE IT TO THE BEGINNING OF 'saveUserEditChanges'")

  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:

    if request.method == 'POST':
      _json = request.json


      #identifying value first
      userID = _json['userId']
      newUsername = _json['username']
      newInitials = _json['initials']
      newIsAdmin = _json['isAdmin']
      newAffiliation = _json['affiliation']
      newEmail = _json['email']
      newIsVerifiedByAdmin = _json['isVerifiedByAdmin']

      obsID = _json['obsId']
      newFirstName = _json['firstName']
      newLastName = _json['lastName']
      


      userUpdateQuery = ( " UPDATE Users " + 
                          " SET isAdmin = " + str(newIsAdmin) +
                          ", " + " Username = " + surr_apos(newUsername) +
                          ", " + " Initials = " + surr_apos(newInitials) +
                          ", " + " Affiliation = " + surr_apos(newAffiliation) +
                          ", " + " Email = " + surr_apos(newEmail) +
                          ", " + " isVerifiedByAdmin = " + str(newIsVerifiedByAdmin) +
                          " WHERE userID=" + str(userID) + ";")

      print("\n\nQeuery for 'updating' the tuple\n\n")
      print(userUpdateQuery)

      cursor.execute(userUpdateQuery)
      rows = cursor.fetchall()
      conn.commit()

      observerUpdateQuery = ( " UPDATE Observers " + 
                              " SET FirstName = " + surr_apos(newFirstName) +
                              ", " + " LastName = " + surr_apos(newLastName) +
                              ", " + " isVerifiedByAdmin = " + str(newIsVerifiedByAdmin) +
                              " WHERE obsID=" + str(obsID) + ";")

      print("\n\nQeuery for 'updating' the tuple\n\n")
      print(observerUpdateQuery)

      cursor.execute(observerUpdateQuery)
      rows = cursor.fetchall()
      conn.commit()

      query =  (" SELECT O.FirstName, O.LastName, O.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
                " FROM Observers as O, Users as U " +
                " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0;")

      print("\n\nQeuery for getting all the rows")
      print(query)

      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      # output results for sanity check
      print("Result of getAllUsers - Flask API")
      print(rows)

      return resp
    else:
      print("Request method was for GET instead of POST")
    

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()


@app.route("/removeUserHavingEmail", methods=['POST'])
def removeUserHavingEmail():

  print("\n\n\n\n MADE IT TO THE BEGINNING OF 'removeUserHavingEmail'")

  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:

    if request.method == 'POST':
      _json = request.json


      #identifying value first
      userID = _json['userId']

      userUpdateQuery = ( " UPDATE Users " + 
                          " SET isAdmin = " + str(-1) +
                          " WHERE userID=" + str(userID) + ";")

      print("\n\nQeuery for 'updating' the tuple\n\n")
      print(userUpdateQuery)

      cursor.execute(userUpdateQuery)
      rows = cursor.fetchall()
      conn.commit()

      query =  (" SELECT O.FirstName, O.LastName, O.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
                " FROM Observers as O, Users as U " +
                " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0;")

      print("\n\nQeuery for getting all the rows")
      print(query)

      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      # output results for sanity check
      print("Result of getAllUsers - Flask API")
      print(rows)

      return resp
    else:
      print("Request method was for GET instead of POST")
    

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()


## get all users
@app.route('/getAll_UserObserver_Data', methods=['POST', 'GET'])
def getAllUserObserverData():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    # execute a query to get all the users
    # query = (" SELECT * FROM Users, Observers WHERE Users.ObsID=Observers.ObsID;")
    

    query =  (" SELECT O.FirstName, O.LastName, O.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
              " FROM Observers as O, Users as U " +
              " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0;")


    cursor.execute(query)

    # store the response and return it as json
    rows = cursor.fetchall()
    resp = jsonify(rows)

    # output results for sanity check
    print("Result of getAllUsers - Flask API")
    print(rows)

    return resp

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()



## get all the plain seal dossiers...
## this information can be supplemented by additional queries on the page.
@app.route('/getAll_SealDossier_Data', methods=['GET'])
def getAll_sealDossier():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query =  (" SELECT * FROM Seals")
    cursor.execute(query)
    rows = cursor.fetchall()
    resp = jsonify(rows)
    return resp
    
  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()
    




## getobservations-with-sealid
@app.route('/getobservations-with-sealid', methods=['POST', 'GET'])
def get_observations_with_sealId():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':

      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)
      sealId = _json

      query = (" SELECT obs.ObservationID, obs.ObserverID, obs.Sex, obs.Date, obs.MoltPercent, obs.Comments, obs.AgeClass, obs.Year, obs.SLOCode, obs.isApproved, obs.LastSeenPup, obs.FirstSeenWeaner, obs.WeanDateRange, obs.EnteredInAno, obs.isProcedure, obs.isDeprecated " + 
               " FROM Observations as obs, ObserveSeal as obsSeal " + 
               " WHERE obs.ObservationID = obsSeal.ObservationID AND SealID = " + surr_apos(str(sealId)) + ";")

      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      print("\n\n NOW PRINTING THE RESPONSE FROM THE SERVER FOR SEAL ID \n\n")
      print(rows)

      return resp
    else:
      return jsonify("no seal was clicked")

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()



# Retrieves the list of unique tags for all the observations currently associated with a particular seal.
@app.route('/gettags-with-sealid', methods=['POST', 'GET'])
def get_tags_with_sealId():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':

      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)

      # store the id of the seal we want to access
      sealId = _json

      query = (" SELECT DISTINCT OTags.TagNumber, OTags.TagColor, OTags.TagPosition, OTags.TagDate, OTags.TagSeal, OTags.isLost " +
               " FROM (SELECT Tags.TagNumber, Tags.TagColor, Tags.TagPosition, Tags.TagDate, Tags.TagSeal, Tags.isLost, ObserveTags.ObservationID " + 
               "       FROM Tags,  ObserveTags " + 
               "       WHERE Tags.TagNumber = ObserveTags.TagNumber) as OTags, " + 
               "      (SELECT obs.ObservationID " + 
               "       FROM Observations as obs, ObserveSeal as obsSeal " + 
               "       WHERE obs.ObservationID = obsSeal.ObservationID AND SealID = " + surr_apos(str(sealId)) + " ) as ObsForSeal " + 
               " WHERE OTags.ObservationID = ObsForSeal.ObservationID " + ";")


      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      print("\n\n NOW PRINTING THE RESPONSE FROM THE SERVER FOR SEAL ID - GETTAGS \n\n")
      print(rows)

      return resp
    else:
      return jsonify("no seal was clicked")

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()






# Retrieves the list of unique tags for all the observations currently associated with a particular seal.
@app.route('/getmarks_with_sealID', methods=['POST', 'GET'])
def get_marks_with_sealId():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':

      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)

      # store the id of the seal we want to access
      sealId = _json
      
      query = (" SELECT DISTINCT OMarks.MarkID, OMarks.Mark, OMarks.MarkPosition, OMarks.markDate, OMarks.Year, OMarks.MarkSeal " + 

               " FROM (SELECT Marks.MarkID, Marks.Mark, Marks.MarkPosition, Marks.markDate, Marks.Year, Marks.MarkSeal, ObserveMarks.ObservationID " + 
               "       FROM Marks, ObserveMarks " + 
               "       WHERE Marks.MarkID = ObserveMarks.MarkID) as OMarks, " + 
                    
               "      (SELECT obs.ObservationID " + 
               "       FROM Observations as obs, ObserveSeal as obsSeal " + 
               "       WHERE obs.ObservationID = obsSeal.ObservationID AND SealID =" + surr_apos(str(sealId)) + ") as ObsForSeal " + 

               " WHERE OMarks.ObservationID = ObsForSeal.ObservationID; ")

      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      print("\n\n NOW PRINTING THE RESPONSE FROM THE SERVER FOR SEAL ID - GETMARKS \n\n")
      print(rows)

      return resp
    else:
      return jsonify("no seal was clicked")

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()



#     get-most-recent-observation-with-sealid
@app.route('/get-most-recent-observation-with-sealid', methods=['POST', 'GET'])
def get_most_recent_observation_with_sealId():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':
      print("BEGIN MOST RECENT OBSERVATION FOR DATE")
      # get the input from the person accessing this REST endpoint
      _json = request.json
      sealId = _json

      query = (" SELECT obs.ObservationID, obs.ObserverID, obs.Sex, obs.Date, obs.MoltPercent, obs.Comments, obs.AgeClass, obs.Year, obs.SLOCode, obs.isApproved, obs.LastSeenPup, obs.FirstSeenWeaner, obs.WeanDateRange, obs.EnteredInAno, obs.isProcedure, obs.isDeprecated " + 
               " FROM Observations as obs, ObserveSeal as obsSeal " + 
               " WHERE obs.ObservationID = obsSeal.ObservationID AND SealID = " + surr_apos(str(sealId)) +
               " ORDER BY obs.Date DESC; ")

      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      print("\n\n now printing -- MOST RECENT OBS :: FOR DATE \n\n")
      print(rows)

      return resp
    else:
      return jsonify("no seal was clicked")

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()



# Get the list of observations belonging to a seal sorted in order of most to least recent, and requiring that the age class have a value.
@app.route('/get_newest_obs_with_sealID_ageClass', methods=['POST', 'GET'])
def get_newest_obs_with_sealId_ageClass():

  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    if request.method == 'POST':
      print("BEGIN NEWEST OBSERVATION FOR AGE CLASS")

      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)

      # store the id of the seal we want to access
      sealId = _json

      query = (" SELECT obs.ObservationID, obs.ObserverID, obs.Sex, obs.Date, obs.MoltPercent, obs.Comments, obs.AgeClass, obs.Year, obs.SLOCode, obs.isApproved, obs.LastSeenPup, obs.FirstSeenWeaner, obs.WeanDateRange, obs.EnteredInAno, obs.isProcedure, obs.isDeprecated " + 
               " FROM Observations as obs, ObserveSeal as obsSeal " + 
               " WHERE obs.ObservationID = obsSeal.ObservationID AND SealID = " + surr_apos(str(sealId)) + " AND obs.AgeClass != '' " + 
               " ORDER BY obs.Date DESC; ")

      # execute the query
      cursor.execute(query)

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)

      print("\n\n now printing -- NEWEST OBS :: FOR AGE CLASS \n\n")
      print(rows)

      return resp
    else:
      return jsonify("no seal was clicked")

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()




## Gets the relevant information for a seal with the provided ID
@app.route('/getseal', methods=['POST', 'GET'])
def get_seal():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)
  try:
    if request.method == 'POST':
      _json = request.json
      print(_json)
      obj = _json['SealID']
      print(obj)
      cursor.execute("SELECT o.*, s.Sex from Seals s inner join ObserveSeal os on os.SealID = s.SealID inner join Observations o on o.ObservationID = os.ObservationID where s.SealID = " + str(obj))
      rows = cursor.fetchall()
      resp = jsonify(rows)
      print(resp)
      return resp
    else:
      return jsonify("no seal was clicked")
  except Exception as e:
    print(e)
  finally:
    cursor.close()
    conn.close()


## Gets the relevant data for a user
@app.route('/getuser', methods=['POST', 'GET'])
def get_user():

  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  print("\n\n")
  print("Contents of the data passed to /getuser:")
  print(request)
  print("\n\n")

  try:
    if request.method == 'POST':
      desiredUserEmail = request.json['email']
      getUserTupleQuery = (" SELECT * " +
                           " FROM  Users " +
                           " WHERE email = " + surr_apos(desiredUserEmail) + ";")
      cursor.execute(getUserTupleQuery)
      rows = cursor.fetchall()
      resp = jsonify(rows)
      return resp
  except Exception as e:
    print(e)
  finally:
    cursor.close()
    conn.close()



## Returns the entire user tuple if the provided password was correct
@app.route('/getloginauthenticator_userObserver', methods=['POST', 'GET'])
def get_login_authenticator_userObserver():

  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  print("\n\n")
  print("Contents of the data passed to /getloginauthenticator_userObserver:")
  print(request)
  print("\n\n")

  try:
    if request.method == 'POST':

      # pull the email/password combo out of the json provided by the caller
      givenEmail = request.json['email']
      givenPassword = request.json['password']

      getUserTupleQuery =  (" SELECT O.FirstName, O.LastName, O.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email " + 
                            " FROM Observers as O, Users as U " +
                            " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0 " + " AND U.email = " + surr_apos(givenEmail) + " AND U.Password = " + surr_apos(givenPassword) + ";")

      cursor.execute(getUserTupleQuery)
      rows = cursor.fetchall()
      resp = jsonify(rows)
      
      # if the length is 0, return json containing "incorrect password"
      if (len(rows) == 0):
        return jsonify("Email/Password combination does not exist in the DB.")
      
      return resp

  except Exception as e:
    print(e)
  finally:
    cursor.close()
    conn.close()


## Places a single apostrophe on either side of a provided string
## and returns the result.
def surr_apos(origStr):
  retStr = "\'" + origStr + "\'"
  return retStr





## Adds a new user to the database
## Having a new user involves two entity sets: Users and Observers
## (1) Adds a new user tuple. this insertion omits the email value.
## (2) Adds a new observer tuple. Only includes the valueID and email.
## (3) Updates the user tuple we created in step 1 with the email belonging to the observer we just created.
## Then it queries the  database again and returns all the user tuples.
@app.route('/adduser', methods=['POST', 'GET'])
def add_user():
    conn = mysql.connect()
    cursor = conn.cursor(pymysql.cursors.DictCursor)

    try:
        if request.method == 'GET':
            cursor.execute("SELECT * from Users Where isAdmin >= 0;")
            rows = cursor.fetchall()
            resp = jsonify(rows)
            return resp

        if request.method == 'POST':
            _json = request.json
            print(_json)
            print(_json['isAdmin'])

            insertUserCmd = (   "INSERT INTO Users(LoginID, FullName, Password, isAdmin, Affiliation)"
                                " VALUES " 
                                "(" + surr_apos(_json['loginID']) +
                                ", " + surr_apos(_json['fullname']) +
                                ", " + surr_apos(_json['password']) +
                                ", " + _json['isAdmin'] +
                                ", " + surr_apos(_json['affiliation']) +
                                ");"
                            )
            insertObserverCmd = (   "INSERT INTO Observers(email, FieldLeader, DataRecorderName, LoginID)"
                                    " VALUES "
                                    "(" + surr_apos(_json['email']) + 
                                    ", " + surr_apos("") +
                                    ", " + surr_apos("") +
                                    ", " + surr_apos(_json['loginID']) +
                                    ");"
                                )
            updateUserEmailCmd = (  "UPDATE Users" 
                                    " SET email=" + surr_apos(_json['email']) + 
                                    " WHERE LoginID=" + surr_apos(_json['loginID']) + ";"
                                )

            print("\n")
            print("insert user cmd:     " + insertUserCmd)
            print("insert observer cmd: " + insertObserverCmd)
            print("update user email:   " + updateUserEmailCmd + "\n")

            cursor.execute(insertUserCmd)
            cursor.execute(insertObserverCmd)
            cursor.execute(updateUserEmailCmd)
            conn.commit()
                
            cursor.execute("SELECT * from Users Where isAdmin >= 0;")

            rows = cursor.fetchall()
            resp = jsonify(rows)
            return resp

        else:
            return jsonify("no seal was clicked")

    except Exception as e:
        print(e)
        return jsonify(1)

    finally:
        cursor.close()
        conn.close()


## Attempts to insert records for a list of observations.
@app.route('/addobservations', methods=['POST', 'GET'])
def add_observations():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)



    try:
        if request.method == 'POST':

            print("yooooo")
            _json = request.json
            #print(_json)
            startUpdate(json.dumps(_json), conn)
            return jsonify('data sent to upload function')

        else:
            return jsonify('error')
    except Exception as e:
        print("Exception: main.py - /addobservations route")
        print(e)
    finally:
        cursor.close()
        conn.close()



# Checks whether the email of the received user belongs to a user with admin privileges.
@app.route('/getadminuser', methods=['POST', 'GET'])
def get_admin_status():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'POST':

            #print("yooooo")
            _json = request.json
            print(_json)

            cursor.execute("SELECT isAdmin from Users Where email= \'" + _json['email'] + "\';")

            rows = cursor.fetchall()
            resp = jsonify(rows)
            return resp
        else:
            return jsonify('error')
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# (Unsure)
# Gets the information for seals which only partially match a provided tag id or mark id.
@app.route('/partials', methods=['GET', 'POST'])
def getpartials():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'POST':

            print("yooooo")
            _json = request.json
            print(_json)
            statement = ('SELECT * FROM '
                        '(SELECT '
                        'O.ObservationID '
                        ', O.ObserverID '
                        ', O.Year '
                        ', O.date '
                        ', O.SLOCode '
                        ', S.Sex '
                        ', O.AgeClass '
                        ', S.Mark '
                        ', S.markDate '
                        ', S.Mark2 '
                        ', S.markDate2 '
                        ', S.T1 '
                        ', S.T2 '
                        ', O.MoltPercent '
                        ', O.Season '
                        ', O.StandardLength '
                        ', O.CurvilinearLength '
                        ', O.AxillaryGirth '
                        ', O.TotalMass '
                        ', O.LastSeenPup '
                        ', O.FirstSeenWeaner '
                        ', O.Rnge '
                        ', O.Comments '
                        ', O.EnteredAno '
                        'FROM '
                        '(  SELECT seals.* '
                        'FROM '
                        '(  '
                        'SELECT COUNT(*) count, inn.sealID FROM  '
                        '(SELECT '
                        'AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  '
                        'FROM '
                        'Seals, '
                        '(SELECT Observations.AgeClass, ObserveSeal.SealID '
                        'FROM '
                        'Observations, '
                        'ObserveSeal, '
                        '(SELECT MAX(Observations.ObservationID) ID FROM '
                        'Seals, Observations, ObserveSeal '
                        'WHERE '
                        'Seals.SealID = ObserveSeal.SealID AND  '
                        'Observations.ObservationID = ObserveSeal.ObservationID '
                        'GROUP BY '
                        'Seals.SealID) id '
                        'WHERE '
                        'Observations.ObservationID = id.ID and '
                        'ObserveSeal.ObservationID = Observations.ObservationID) age, '
                        '(SELECT important.* FROM '
                        '(SELECT inn.SealId, COUNT(*) count  '
                        'FROM '
                        '(SELECT  '
                        'S.SealID,  '
                        'Mark.Mark,  '
                        'Mark.markDate,  '
                        'Mark2.Mark Mark2, '
                        'Mark2.markDate markDate2 '
                        'FROM '
                        'Seals S  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark  '
                        'ON S.SealID = Mark.SealID  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark2  '
                        'ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn '
                        'GROUP BY '
                        'inn.SealID) counts, '
                        '(SELECT  '
                        'S.SealID,  '
                        'Mark.Mark,  '
                        'Mark.markDate,  '
                        'Mark2.Mark Mark2, '
                        'Mark2.markDate markDate2 '
                        'FROM '
                        'Seals S  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark  '
                        'ON S.SealID = Mark.SealID  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark2  '
                        'ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important '
                        'WHERE '
                        'important.SealID = counts.SealID AND  '
                        'counts.count < 2 '
                        'UNION ALL '
                        'SELECT  '
                        'Seals.SealID,  '
                        'M1.Mark, '
                        'M1.markDate MarkDate, '
                        'M2.Mark Mark2, '
                        'M2.markDate MarkDate2 '
                        'FROM '
                        'Seals, '
                        '(SELECT * FROM Marks) M1, '
                        '(SELECT * FROM Marks) M2 '
                        'WHERE '
                        'M1.Mark < M2.Mark AND '
                        'M1.MarkSeal = Seals.SealID AND '
                        'M2.MarkSeal = Seals.SealID '
                        ') AllMarks, '
                        '(SELECT important.SealID, important.T1, important.T2 FROM '
                        '(SELECT inn.SealID, COUNT(*) count '
                        'FROM '
                        '(SELECT '
                        'S.SealID, '
                        'Tag1.TagNumber T1, '
                        'Tag2.TagNumber T2 '
                        'FROM '
                        'Seals S '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag1 '
                        'ON S.SealID = Tag1.SealID '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag2 '
                        'ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn '
                        'GROUP BY '
                        'inn.SealID) counts, '
                        '(SELECT '
                        'S.SealID, '
                        'Tag1.TagNumber T1, '
                        'Tag2.TagNumber T2 '
                        'FROM '
                        'Seals S '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag1 '
                        'ON S.SealID = Tag1.SealID '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag2 '
                        'ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important '
                        'WHERE '
                        'important.SealID = counts.sealID AND  '
                        'counts.count < 2 '
                        'UNION ALL '
                        ' '
                        'SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM '
                        'Seals, '
                        '(SELECT * FROM Tags) Tag1, '
                        '(SELECT * FROM Tags) Tag2 '
                        'WHERE '
                        'Seals.SealId = Tag1.TagSeal AND '
                        'Seals.SealID = Tag2.TagSeal AND '
                        'Tag1.TagNumber < Tag2.TagNumber '
                        ') AllTags '
                        'WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID '
                        'AND age.SealID = AllMarks.SealID ) inn '
                        'GROUP BY '
                        'inn.sealID ) sealcounts, '
                        '(SELECT '
                        'AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  '
                        'FROM '
                        'Seals, '
                        '(SELECT Observations.AgeClass, ObserveSeal.SealID '
                        'FROM '
                        'Observations, '
                        'ObserveSeal, '
                        '(SELECT MAX(Observations.ObservationID) ID FROM '
                        'Seals, Observations, ObserveSeal '
                        'WHERE '
                        'Seals.SealID = ObserveSeal.SealID AND  '
                        'Observations.ObservationID = ObserveSeal.ObservationID '
                        'GROUP BY '
                        'Seals.SealID) id '
                        'WHERE '
                        'Observations.ObservationID = id.ID and '
                        'ObserveSeal.ObservationID = Observations.ObservationID) age, '
                        '(SELECT important.* FROM '
                        '(SELECT inn.SealId, COUNT(*) count  '
                        'FROM '
                        '(SELECT  '
                        'S.SealID,  '
                        'Mark.Mark,  '
                        'Mark.markDate,  '
                        'Mark2.Mark Mark2, '
                        'Mark2.markDate markDate2 '
                        'FROM '
                        'Seals S  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark  '
                        'ON S.SealID = Mark.SealID  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark2  '
                        'ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn '
                        'GROUP BY '
                        'inn.SealID) counts, '
                        '(SELECT  '
                        'S.SealID,  '
                        'Mark.Mark,  '
                        'Mark.markDate,  '
                        'Mark2.Mark Mark2, '
                        'Mark2.markDate markDate2 '
                        'FROM '
                        'Seals S  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark  '
                        'ON S.SealID = Mark.SealID  '
                        'LEFT OUTER JOIN '
                        '(SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate '
                        'FROM Marks) Mark2  '
                        'ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important '
                        'WHERE '
                        'important.SealID = counts.SealID AND  '
                        'counts.count < 2 '
                        'UNION ALL '
                        'SELECT  '
                        'Seals.SealID,  '
                        'M1.Mark, '
                        'M1.markDate MarkDate, '
                        'M2.Mark Mark2, '
                        'M2.markDate MarkDate2 '
                        'FROM '
                        'Seals, '
                        '(SELECT * FROM Marks) M1, '
                        '(SELECT * FROM Marks) M2 '
                        'WHERE '
                        'M1.Mark < M2.Mark AND '
                        'M1.MarkSeal = Seals.SealID AND '
                        'M2.MarkSeal = Seals.SealID '
                        ') AllMarks, '
                        '(SELECT important.SealID, important.T1, important.T2 FROM '
                        '(SELECT inn.SealID, COUNT(*) count '
                        'FROM '
                        '(SELECT '
                        'S.SealID, '
                        'Tag1.TagNumber T1, '
                        'Tag2.TagNumber T2 '
                        'FROM '
                        'Seals S '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag1 '
                        'ON S.SealID = Tag1.SealID '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag2 '
                        'ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn '
                        'GROUP BY '
                        'inn.SealID) counts, '
                        '(SELECT '
                        'S.SealID, '
                        'Tag1.TagNumber T1, '
                        'Tag2.TagNumber T2 '
                        'FROM '
                        'Seals S '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag1 '
                        'ON S.SealID = Tag1.SealID '
                        'LEFT OUTER JOIN '
                        '(SELECT Tags.TagSeal SealID, Tags.TagNumber '
                        'FROM Tags) Tag2 '
                        'ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important '
                        'WHERE '
                        'important.SealID = counts.sealID AND  '
                        'counts.count < 2 '
                        'UNION ALL '
                        'SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM '
                        'Seals, '
                        '(SELECT * FROM Tags) Tag1, '
                        '(SELECT * FROM Tags) Tag2 '
                        'WHERE '
                        'Seals.SealId = Tag1.TagSeal AND '
                        'Seals.SealID = Tag2.TagSeal AND '
                        'Tag1.TagNumber < Tag2.TagNumber '
                        ') AllTags '
                        'WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID '
                        'AND age.SealID = AllMarks.SealID ) seals '
                        'WHERE '
                        'seals.SealID = sealcounts.sealID AND sealcounts.count = 1) S, '
                        ' '
                        '(SELECT main.ObservationID '
                        ', main.Year '
                        ', main.date '
                        ', main.SLOCode '
                        ', main.sex '
                        ', main.AgeClass '
                        ', main.moltPercent '
                        ', main.Year Season '
                        ', Measurements.StandardLength '
                        ', Measurements.CurvilinearLength '
                        ', Measurements.AxillaryGirth '
                        ', Measurements.AnimalMass '
                        ', Measurements.TotalMass '
                        ', main.LastSeenPup '
                        ', main.FirstSeenWeaner '
                        ', main.Rnge '
                        ', main.Comments '
                        ', main.EnteredAno '
                        'FROM '
                        '(SELECT Observations.*, ObserveSeal.SealID '
                        'FROM '
                        'Observations, '
                        'ObserveSeal '
                        'WHERE '
                        'ObserveSeal.ObservationID = Observations.ObservationID) main LEFT OUTER JOIN '
                        'Measurements ON Measurements.ObservationID = main.ObservationID '
                        'WHERE '
                        'main.IsValid = 0) O '
                        'WHERE '
                        'O.SealID = S.SealID '
                        ') disbitch '
                        'WHERE '
                        'disbitch.T1 LIKE \'' + _json['part'] + '\' OR disbitch.T2 LIKE \'' + _json['part'] + '\';')
            cursor.execute(statement)

            rows = cursor.fetchall()
            resp = jsonify(rows)
            return resp
        else:
            return jsonify('error')
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# Gets the data for all the seals
@app.route('/allseals', methods=['GET', 'POST'])
def getAllSeals():
    
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        statement = "Select s.SealID, CONCAT('[', GROUP_CONCAT(DISTINCT T1.AgeClass SEPARATOR ', '), ']')  AgeClass, s.Sex, CONCAT('[', GROUP_CONCAT(DISTINCT T1.TagNumber SEPARATOR ', '), ']')  Tags, CONCAT('[', group_concat(distinct T1.Mark separator ', '), ']') Marks from Seals s left join (Select s2.SealID, ot.TagNumber, m.Mark, o.AgeClass from Seals s2 left join ObserveSeal os1 on os1.SealID = s2.SealID left join ObserveTags ot on ot.ObservationID = os1.ObservationID left join ObserveMarks om on om.ObservationID = os1.ObservationID inner join Marks m on m.MarkID = om.MarkID inner join Observations o on o.ObservationID = os1.ObservationID order by o.Date desc) T1 on T1.SealID = s.SealID group by s.SealID order by s.SealID asc"
        # print(statement)
        if request.method == 'POST':
            pass
        cursor.execute(statement)
        #cursor.execute("DELETE FROM tbl_user WHERE user_id=%s", id)
        rows = cursor.fetchall()
        resp = jsonify(rows)

        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# Gets the data for all the observations
@app.route('/allobservations', methods=['GET', 'POST'])
def getAllObservations():
    
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        statement = "Select o.*, os.SealID, json_arrayagg(ot.TagNumber) Tags, json_arrayagg(m.Mark) Marks from Observations o left join ObserveTags ot on ot.ObservationID = o.ObservationID left join ObserveMarks om on om.ObservationID = o.ObservationID inner join Marks m on om.MarkID = m.MarkID inner join ObserveSeal os on os.ObservationID = o.ObservationID group by o.ObservationID order by o.ObservationID asc"
        #"SELECT O.ObservationID , O.SealID , O.FieldLeader , O.Year , O.date , O.SLOCode , S.Sex , O.AgeClass , S.Mark , S.markDate , S.Mark2 , S.markDate2 , S.T1 , S.T2 , O.MoltPercent , O.Season , O.StandardLength , O.CurvilinearLength , O.AxillaryGirth , O.TotalMass , O.LastSeenPup , O.FirstSeenWeaner , O.Rnge , O.Comments , O.EnteredAno FROM (  SELECT seals.* FROM (  SELECT COUNT(*) count, inn.sealID FROM  (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) inn GROUP BY inn.sealID ) sealcounts,     (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) seals WHERE seals.SealID = sealcounts.sealID AND sealcounts.count = 1) S,  (SELECT main.ObservationID , main.SealID , main.FieldLeader , main.Year , main.date , main.SLOCode , main.sex , main.AgeClass, main.moltPercent , main.Year Season , Measurements.StandardLength , Measurements.CurvilinearLength , Measurements.AxillaryGirth , Measurements.AnimalMass , Measurements.TotalMass, main.LastSeenPup , main.FirstSeenWeaner , main.Rnge , main.Comments , main.EnteredAno FROM (SELECT Observations.*, ObserveSeal.SealID FROM Observations, ObserveSeal WHERE ObserveSeal.ObservationID = Observations.ObservationID) main LEFT OUTER JOIN Measurements ON Measurements.ObservationID = main.ObservationID WHERE main.IsValid = 0) O WHERE O.SealID = S.SealID;"
        # print(statement)
        if request.method == 'POST':
            pass
        cursor.execute(statement)
        #cursor.execute("DELETE FROM tbl_user WHERE user_id=%s", id)
        rows = cursor.fetchall()
        finalRows = []
        for row in rows:
            newRow = {'ObservationID': row["ObservationID"], 'SealID': row["SealID"], 'AgeClass': row["AgeClass"], 'Sex': row["Sex"], 'Tags': json.loads(row["Tags"]), 'Marks': json.loads(row["Marks"]), 'Date': row["Date"], 'Comments': row["Comments"], 'Year': row["Year"], 'MoltPercent': row["MoltPercent"]}
            finalRows.append(newRow)
        resp = jsonify(finalRows)
        #resp.status_code = 200


        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

# The purpose of this method is to get all of the non-approved records. 
@app.route('/notapproved', methods=['GET'])
def getAllNonSeals():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        statement = "SELECT O.ObservationID , O.SealID , O.FieldLeader , O.Year , O.date , O.SLOCode , S.Sex , O.AgeClass , S.Mark , S.markDate , S.Mark2 , S.markDate2 , S.T1 , S.T2 , O.MoltPercent , O.Season , O.StandardLength , O.CurvilinearLength , O.AxillaryGirth , O.TotalMass , O.LastSeenPup , O.FirstSeenWeaner , O.Rnge , O.Comments , O.EnteredAno FROM (  SELECT seals.* FROM (  SELECT COUNT(*) count, inn.sealID FROM  (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) inn GROUP BY inn.sealID ) sealcounts,     (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) seals WHERE seals.SealID = sealcounts.sealID AND sealcounts.count = 1) S,  (SELECT main.ObservationID , main.SealID , main.FieldLeader , main.Year , main.date , main.SLOCode , main.sex , main.AgeClass, main.moltPercent , main.Year Season , Measurements.StandardLength , Measurements.CurvilinearLength , Measurements.AxillaryGirth , Measurements.AnimalMass , Measurements.TotalMass, main.LastSeenPup , main.FirstSeenWeaner , main.Rnge , main.Comments , main.EnteredAno FROM (SELECT Observations.*, ObserveSeal.SealID FROM Observations, ObserveSeal WHERE ObserveSeal.ObservationID = Observations.ObservationID) main LEFT OUTER JOIN Measurements ON Measurements.ObservationID = main.ObservationID WHERE main.IsValid = 1) O WHERE O.SealID = S.SealID;"
        # print(statement)
        cursor.execute(statement)
        #cursor.execute("DELETE FROM tbl_user WHERE user_id=%s", id)
        rows = cursor.fetchall()
        resp = jsonify(rows)
        #resp.status_code = 200


        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# Generates a 404 error
@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404
    return resp


# Updates the ageclass of a particular observation
@app.route('/updateAgeClass', methods=['POST'])
def update_age():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'POST':
            _json = request.json
            print(_json)
            cursor.execute("UPDATE Observations SET AgeClass="+_json['age']+" WHERE ObservationID=" + str(_json['obsID']))
            conn.commit()
            return jsonify("hellowtheienfosdnck")
        else:
            return jsonify('nothing to do')

    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


# This is required to get this python program to run.
if __name__ == "__main__":
    app.run(host='127.0.0.1',port=5000, debug=True)
    #app.run(host='0.0.0.0',port=5000)




