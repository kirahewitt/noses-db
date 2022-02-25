import pymysql
import pandas as pd
import json
from app import app
from ETL3 import startUpdate
from db_config import mysql
from flask import jsonify
from flask import flash, request
from flask import g, Flask
from flask import render_template
import json
import logging
import bcrypt
#from werkzeug import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
bleh = Flask(__name__)
app.config['DEBUG'] = True
app.config['TESTING'] = False
app.config['MAIL_SERVER'] = "smtp.gmail.com" ## 
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True 
app.config['MAIL_USERNAME'] = "esealdata.donotreply@gmail.com"
app.config['MAIL_PASSWORD'] = "lF01P6GQ2hm2"
app.config['MAIL_DEFAULT_SENDER'] = "noses.donotreply@gmail.com"
app.config['MAIL_MAX_EMAILS'] = True
mail = Mail(app)

def sendSuccessEmailMessage(emailDestination, firstName):
    print("\n\nINSIDE SEND SUCCESS EMAIL")

    msg = Message(subject='[N.O.S.E.S.]: Thanks for your interest in N.O.S.E.S.', 
                  recipients=[emailDestination], 
                  body=("Hi " + firstName + ",\n\n" + "Thanks for your interest in becoming a part of N.O.S.E.S. We will be in contact shortly to inform you whether your request for an account has been approved.\n\n" + "Best,\n\n" + "-The N.O.S.E.S. Team"))

    print("Message content: ")
    print(msg)

    mail.send(msg)
    return "Message sent!"


## This method is used by a user with admin level permmissions to create a new user account.
def sendEmailMessage_newAccountCreatedForUser(emailDestination, firstName, lastName, tempPassword):
    print("\n\nINSIDE SEND SUCCESS EMAIL")

    msg = Message(subject='[N.O.S.E.S.]: Your new account is waiting for you!', 
                  recipients=[emailDestination], 
                  body=("Hi " + firstName + ",\n\n" + 
                        "A new account has been created for you on the N.O.S.E.S. system. Your login credentials are as follows:\n\n"  +

                        "username: \t" + emailDestination + "\n" +
                        "temporary password: \t" + tempPassword + "\n\n" +

                        "You can change your password at any time via the 'Reset Password' button on the Sign In page." + "\n\n" +
                        
                        "Best,\n\n" + "-The N.O.S.E.S. Team"))

    print("Message content: ")
    print(msg)

    mail.send(msg)
    return "Message sent!"


## This method is used by a user with admin level permmissions to create a new user account.
def sendEmailMessage_passwordChangedNotification(emailDestination, firstName):
    print("\n\nINSIDE SEND EMAIL -- passwordChangedNotification")

    msg = Message(subject='[N.O.S.E.S.]: Password Change Notification', 
                  recipients=[emailDestination], 
                  body=("Hi " + firstName + ",\n\n" + 
                        "The purpose of this message is to notify you that your password has just been changed. If you didn't change this password, contact your system administrator.\n\n"  +
                        "Best,\n\n" + "-The N.O.S.E.S. Team"))

    print("Message content: ")
    print(msg)

    mail.send(msg)
    return "Message sent!"

# @app.route('/', methods=['GET'])
# def root():
# 	return render_template('index.html')

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
            markID = []
            tagID = []
            print(obs)

            print("1")
            cursor.execute("SELECT * FROM ObserveSeal WHERE ObservationID=" + str(obs))
            row = cursor.fetchone()
            if row is not None:
              sealID = row['SealID']
            else:
              sealID = None
            print("2")
            cursor.execute("SELECT * FROM ObserveMarks WHERE ObservationID=" + str(obs))
            row = cursor.fetchone()
            while row is not None:
              markID.append(row['MarkID'])
              row = cursor.fetchone()
            print("3")
            cursor.execute("SELECT * FROM ObserveTags WHERE ObservationID=" + str(obs))
            row = cursor.fetchone()
            while row is not None:
              tagID.append(row['TagNumber'])
              row = cursor.fetchone()

            print("4")
            cursor.execute("DELETE FROM Measurements WHERE ObservationID=" + str(obs))
            print("5")
            cursor.execute("DELETE FROM FieldLeaderForObs WHERE ObservationID=" + str(obs))
            print("6")
            cursor.execute("DELETE FROM UploadContainingObs WHERE ObservationID=" + str(obs))

            print("7")
            cursor.execute("DELETE FROM ObserveSeal WHERE ObservationID=" + str(obs))
            print("8")
            cursor.execute("DELETE FROM ObserveMarks WHERE ObservationID=" + str(obs))
            print("9")
            cursor.execute("DELETE FROM ObserveTags WHERE ObservationID=" + str(obs))

            if sealID is not None:
              print("10")
              cursor.execute("SELECT * FROM ObserveSeal WHERE SealID=" + str(sealID))
              row = cursor.fetchone()
            else:
              row = None

            if row is None and sealID is not None:
              print("11")
              cursor.execute("DELETE FROM Seals WHERE SealID=" + str(sealID))
            elif sealID is not None:
              nextObservation = row['ObservationID']
              print("12 " + str(nextObservation))
              cursor.execute("UPDATE Seals s SET s.ObservationID=" + str(nextObservation) + " WHERE s.SealID=" + str(sealID))

            if len(markID) > 0:
              for m in markID:
                print("13")
                cursor.execute("SELECT * FROM ObserveMarks WHERE MarkID=" + str(m))
                row = cursor.fetchone()

                if row is None:
                  print("14")
                  cursor.execute("DELETE FROM Marks WHERE MarkID=" + str(m))
                else:
                  nextObservation = row['ObservationID']
                  print("15")
                  cursor.execute("UPDATE Marks m SET m.ObservationID=" + str(nextObservation) + " WHERE m.MarkID=" + str(m))

            if len(tagID) > 0:
              for t in tagID:
                print("16")
                cursor.execute("SELECT * FROM ObserveTags WHERE TagNumber='" + str(t) + "'")
                row = cursor.fetchone()

                if row is None:
                  print("17")
                  cursor.execute("DELETE FROM Tags WHERE TagNumber='" + str(t) + "'")
                else:
                  nextObservation = row['ObservationID']
                  print("18")
                  cursor.execute("UPDATE Tags t SET t.TagSeal=" + str(nextObservation) + " WHERE t.TagNumber='" + str(t) + "'")
            
            print("19")
            cursor.execute("DELETE FROM Observations WHERE ObservationID=" + str(obs))
            conn.commit()
            resp = jsonify('Observation deleted successfully!')
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
      username = _json['username']
      print(_json)
      cursor.execute("Update Users Set isAdmin=-1 where username=\'" + username + "\';")

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
      username = _json['username']
      priv = _json['isAdmin']
      print(_json)

      cursor.execute("Update Users Set isAdmin="+ str(priv) + " where username=\'" + username + "\';")
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

@app.route('/updateuserpassword', methods=['POST', 'GET'])
def updateuserpassword():
  # set up connection to the mysql database
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    
    if request.method == 'POST':
      # get the input from the person accessing this REST endpoint
      _json = request.json
      print(_json)

      # get the fields out of the json
      email = _json['email']
      newPassword = _json['newPassword']

      salt = bcrypt.gensalt(rounds=12)
      encoded_newPassword = str(bcrypt.hashpw(newPassword.encode('utf8'), salt))
      
      updatePasswordQuery = ("UPDATE Users SET Password=\"" + encoded_newPassword + "\" WHERE Email=" + surr_apos(email) + ";")

      cursor.execute(updatePasswordQuery)
      conn.commit()

      return jsonify("Success: The overwrite of the former password was successful")

    else:
      return jsonify("Error: Received unexpected GET request. Expected POST")
      
  except Exception as e:
    print("Error(updateuserpassword): ")
    print(e)

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

      # get the fields out of the json
      email = _json['email']
      username = get_username_forEmail(email)
      oldPassword = _json['oldPassword']
      newPassword = _json['newPassword']

      # get the current password 
      hashedPassword_inDatabase = get_password_forUsername(username)

      # apply utf8 encodings to the old password guess and the hashed pw in the db
      encoded_oldPassword = oldPassword.encode('utf8')
      encoded_hashedPassword_inDatabase = convert_byte_string_to_unicodeString(hashedPassword_inDatabase)

      # print("\nencoded_oldPassword:")
      # print(encoded_oldPassword)
      # print("\nencoded_oldPassword:")
      # print(encoded_hashedPassword_inDatabase)

      passwordIsCorrect = bcrypt.checkpw( encoded_oldPassword , encoded_hashedPassword_inDatabase )
      
      if passwordIsCorrect:

        salt = bcrypt.gensalt(rounds=12)
        encoded_newPassword = str(bcrypt.hashpw(newPassword.encode('utf8'), salt))
        
        updatePasswordQuery = ("UPDATE Users SET Password=\"" + encoded_newPassword + "\" WHERE Email=" + surr_apos(email) + ";")

        cursor.execute(updatePasswordQuery)
        conn.commit()

        # get the name of the user:
        rows = getUserObserver_viaUsername(username)
        
        print("HERES THE VALUE OF 'resp':")
        print(rows)
        print("\n\n")

        firstName = rows[0]['FirstName']
        sendEmailMessage_passwordChangedNotification(email, firstName)

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
# DEPRECATED. Better to access all data based on the username (which is unchanging)
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


# Gets the current password for a particular user
def get_password_forUsername(username):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query = ("SELECT * FROM Users WHERE Username=" + surr_apos(username) + ";")
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


# Retrieves the username that is currently associated with the provided email
def get_username_forEmail(email):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query = ("SELECT * FROM Users WHERE Email=" + surr_apos(email) + ";")
    cursor.execute(query)
    rows = cursor.fetchall()

    desiredUsername = rows[0]['Username']
    return desiredUsername

  except Exception as e:
    print("Error(get_username_forEmail): ")
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
      username = _json['username']
      password = _json['password']

      # determine the next UserID and the next ObsID, for the Users and Observers entity sets, respectively.
      nextUserId = int(getLatestUser()) + 1
      nextObserverId = int(getLatestObserver()) + 1

      # verify that we're not going to attempt to add a user for an email already in use
      if isEmailInUseByAnyUser(email):
        raise Exception("A verified user with that email already exists in this system.") 

      # verify that we're not going to attempt to add a user for a username already in use
      if isUsernameInUseByAnyUser(username):
        raise Exception("A verified user with that username already exists in this system.") 

      # try to make the observer tuple first
      submit_new_userAccountRequest_ObserverHelper(firstName, lastName, nextObserverId)

      # store user vars
      userQuery_nextUserId = str(nextUserId)
      userQuery_username = username                    # given
      userQuery_initials = firstName[0] + lastName[0]  # get first character of first and last name for initials
      userQuery_isAdmin = str(0)                       # can't be an admin b/c this is just a request
      userQuery_affiliation = ""                       # won't have any affiliation by default
      userQuery_email = email                          # given
      userQuery_obsID = str(nextObserverId)            # 
      userQuery_isVerifiedByAdmin = str(0)             # Can't be a verified user because this is just a request.

      # generate hash for provided password
      salt = bcrypt.gensalt(rounds=12)
      userQuery_password = str(bcrypt.hashpw(password.encode('utf8'), salt))

      # make a new object/query for the user
      # username, password, initials, isAdmin, affiliation, email, obsID, isVerifiedByAdmin
      query = (" INSERT INTO Users (UserID, Username, Password, Initials, isAdmin, Affiliation, Email, ObsID, isVerifiedByAdmin) VALUES( " + 
               " " + userQuery_nextUserId + ", " + 
               " " + surr_apos(userQuery_username) + ", " +
               " \"" + userQuery_password + "\", " + 
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
      conn.commit()

      # store the response and return it as json
      rows = cursor.fetchall()
      resp = jsonify(rows)
      
      sendSuccessEmailMessage(email, firstName)

      return resp

    else:
      return jsonify("Error: Received unexpected GET request. Expected POST")

  except Exception as e:
    print("Error(submit-new-userAccountRequest): ")
    print(e)

  finally:
    cursor.close()
    conn.close()


##
## Method that handles all the logic of adding a new image to be used as a user's profile image.
## Needs to have access to the desired user's id, as well as the image information
## While it seems like a waste of space to let users' old profile images take up space on the DB, 
##  the Image entity set to represent images associated with BOTH seals and Users. 
##
## The process of updating the database with all the information for the relationship of a user's profile image involves three steps:
##  1. Add the picture to the Image entity set
##  2. Record who uploaded the image -- add a tuple to the ImageUploadedBy entity set
##  3. Record that this image is now for the user's profile -- add a tuple to ImageForProfile entity set
##
## Super important part of this is that the connection created by this method is passed to all the other methods.
## This is key, because we don't want to apply all the changes we make to these tables unless every step was successful.
##
@app.route('/uploadImage_forUserProfile', methods=['POST', 'GET'])
def uploadImage_forUserProfile():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    _json = request.json
    userId = _json['userId']
    pictureData = _json['pictureData']
    caption = _json['caption']


    print("\n\nNOW OUTPUTTING THE TYPE OF 'getLatestImageId()':")
    tempVal = getLatestImageId()
    print(type(getLatestImageId()))
    print(type(tempVal))


    nextImageId = int(getLatestImageId()) + 1
    
    # put the image in the DB

    insertTuple_Image(conn, cursor, nextImageId, pictureData, caption)

    # add/update the recorded association of the user with this new image
    insertTuple_Image_for_UserAccount(conn, cursor, userId, nextImageId)

    print("made it just before commit")

    # only commit after both previous methods succeed.
    conn.commit()

    return "success"

  except Exception as e:
    print(e)

  finally:
      cursor.close()
      conn.close()


##
## getAll_UserProfileImages
##
@app.route("/getAll_UserProfileImages", methods=['POST', 'GET'])
def getAll_UserProfileImages():

  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    

    # make the query
    query = ( " SELECT Users.UserID, Image.id, Image.pictureData " + 
              " FROM Users, Image, Image_for_UserAccount as IFU " +
              " WHERE Users.userID = IFU.userId AND IFU.imageId = Image.id" + ";")
    
    print("getAll_UserProfileImages -- finished making query:")
    print(query)

    # execute the query
    cursor.execute(query)

    print("getAll_UserProfileImages -- Query finished executing, fetching rows...")

    rows = cursor.fetchall()

    print("getAll_UserProfileImages -- value of rows variable:")
    print(rows)
  
    if (len(rows) > 0):

      # get rid of the b'' wrapper  around the picture data
      for row in rows:
        temp = str(row['pictureData'])
        row['pictureData'] = convert_withoutEncoding_byte_to_Unicode(temp)

      return jsonify(rows)

    else:
      return jsonify("")

    

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()


## 
## Retrieves the profile image for the user provided in the request.
## 
@app.route("/getUserProfileImage", methods=['POST'])
def getUserProfileImage():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    username = request.json['username']

    # make the query
    query = ( " SELECT Users.UserID, Users.Username, Image.pictureData " + 
              " FROM Image, Users, Image_for_UserAccount as IFU " +
              " WHERE Users.userID = IFU.userId AND IFU.imageId = Image.id AND Users.Username = '" + username + "';")
    
    # print("getUserProfileImage -- finished making query:")
    # print(query)

    # execute the query
    cursor.execute(query)

    # print("getUserProfileImage -- Query finished executing, fetching rows...")

    rows = cursor.fetchall()

    # print("getUserProfileImage -- value of rows variable:")
    # print(rows)
  
    if (len(rows) > 0):
      desiredData = rows[0]['pictureData']

      # print("getuserProfileImage -- desiredData ( what the mainpy will return for the user image)")
      # print(desiredData)
      # print("getuserProfileImage -- Type of desiredData")
      # print(type(desiredData))

      desiredData_str = str(desiredData)

      # print("\n\n\n\ndesiredData as string:\n")
      # print(desiredData_str)

      imageUnicodeString = convert_withoutEncoding_byte_to_Unicode(desiredData_str)

      # print("\n\n\n\ngetuserProfileImage -- made the imageUnicodeString:\n")
      # print(imageUnicodeString)

      imageJson = {"pictureData" : imageUnicodeString }

      # print("getuserProfileImage -- made the jsonObject")
      # print(imageJson)

      return jsonify(imageJson)

    else:
      return ""

    

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()


## 
## Retrieves the id of the Image tuple with the highest integer value
## 
def getLatestImageId():
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query_latestImageID = "SELECT * FROM Image ORDER BY id DESC LIMIT 1;"
    cursor.execute(query_latestImageID)
    rows = cursor.fetchall()
    
    if (len(rows) > 0):
      latestId = rows[0]['id']
    else:
      latestId = 0

    return latestId

  except Exception as e:
    print("Error(getLatestImageId)")
    print(e)

  finally:
    cursor.close()
    conn.close()

## 
## Inserts a tuple for the relationship -- associates an image with a user/observer's profile.
## Allows an image to serves as a user's profile picture.
## The entity set Image_for_UserAccount is expected to only associate one image for any user.
##
def insertTuple_Image_for_UserAccount(conn, cursor, userId, imageId):

  print("insertTuple_Image_for_UserAccount(...)...")

  tupleExists = tupleExists_Image_for_UserAccount(conn, cursor, userId, imageId)

  if tupleExists:  
    print("tuple exists!")
    query = ("UPDATE Image_for_UserAccount SET imageId=%s WHERE userId=%s")
    queryValues = (imageId, userId)
    cursor.execute(query, queryValues)

  else:
    print("tuple doesn't exist!")
    query = ("INSERT INTO Image_for_UserAccount(userId, imageId) Values(%s, %s)")
    queryValues = (userId, imageId)
    cursor.execute(query, queryValues)


##
## Determines whether there is already a tuple in the Image_for_UserAccount, for
##  for the provided (userId, imageId) pair.
##
def tupleExists_Image_for_UserAccount(conn, cursor, userId, imageId):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    # make the query
    query = ("SELECT COUNT(*) FROM Image_for_UserAccount WHERE userId=%s")
    queryValues = (str(userId))
    
    # execute the query
    cursor.execute(query, queryValues)
    rows = cursor.fetchall()

    # get the count
    count = rows[0]['COUNT(*)']

    # if the value is > 0, there is already record. just return result of (value > 0)
    return count > 0

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()


## 
## Inserts a tuple to record all the images uploaded by a user. 
## 
#def insertTuple_ImageUploadedBy()


##
## Inserts a tuple for the relationship that associates an image with the observation it belongs to.
## That is, when someone makes an observation of a seal, and provides an image, this is used.
## 
#def insertTuple_ImageWithObservation()


##
## Will store an image in the database and if successful, returns the new .
##
def insertTuple_Image(conn, cursor, newImageId, pictureData, caption):
  print("insertTuple_Image(...)...")

  # make the query
  query = (" INSERT INTO Image (id, pictureData, caption) VALUES(%s, %s, %s)")
  queryValues = (str(newImageId), pictureData, caption)

  # print("image id: " + str(newImageId))
  # print("picture data: ")
  # print(pictureData)
  # print("caption: " + caption)

  # execute the query
  cursor.execute(query, queryValues)

  # store the response and return it as json
  rows = cursor.fetchall()
  resp = jsonify(rows)
  
  return resp



## 
## A route used by a user with admin level permissions to create a new user account.
## 
@app.route("/addNewUser_forAdmin", methods=['POST'])
def addNewUser_forAdmin():

  print("\n\n\n\n MADE IT TO THE BEGINNING OF 'saveUserEditChanges'")

  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:

    if request.method == 'POST':
      _json = request.json


      # set aside all the variables we need from the input
      firstName = _json['firstName']
      lastName = _json['lastName']
      email = _json['email']
      username = _json['username']
      password = _json['password']
      isAdmin = _json['isAdmin']
      affiliation = _json['affiliation']
      
      
      # determine the next UserID and the next ObsID, for the Users and Observers entity sets, respectively.
      nextUserId = int(getLatestUser()) + 1
      nextObserverId = int(getLatestObserver()) + 1

      # verify that we're not going to attempt to add a user for an email already in use
      emailAlreadyInUse = isEmailInUseByAnyUser(email)
      if emailAlreadyInUse:
        raise Exception("A verified user with that email already exists in this system.") 

      # verify that we're not going to attempt to add a user for a username already in use
      if isUsernameInUseByAnyUser(username):
        raise Exception("A verified user with that username already exists in this system.") 

      # try to make the observer tuple first
      submit_new_userAccountRequest_ObserverHelper(firstName, lastName, nextObserverId)

      # store user vars
      userQuery_nextUserId = str(nextUserId)
      userQuery_username = username                       # given
      userQuery_initials = firstName[0] + lastName[0]  # get first character of first and last name for initials
      userQuery_isAdmin = str(isAdmin)                       # can't be an admin b/c this is just a request
      userQuery_affiliation = affiliation                       # won't have any affiliation by default
      userQuery_email = email                          # given
      userQuery_obsID = str(nextObserverId)            # 
      userQuery_isVerifiedByAdmin = str(1)             # Can't be a verified user because this is just a request.

      # generate hash for provided password
      salt = bcrypt.gensalt(rounds=12)
      userQuery_password = str(bcrypt.hashpw(password.encode('utf8'), salt))

      # make a new object/query for the user
      # username, password, initials, isAdmin, affiliation, email, obsID, isVerifiedByAdmin
      query = (" INSERT INTO Users (UserID, Username, Password, Initials, isAdmin, Affiliation, Email, ObsID, isVerifiedByAdmin) VALUES( " + 
               " " + userQuery_nextUserId + ", " + 
               " " + surr_apos(userQuery_username) + ", " + 
               " \"" + userQuery_password + "\", " + 
               " " + surr_apos(userQuery_initials) + ", " + 
               " " + userQuery_isAdmin + ", " + 
               " " + surr_apos(userQuery_affiliation) + ", " + 
               " " + surr_apos(userQuery_email) + ", " + 
               " " + userQuery_obsID + ", " + 
               " " + userQuery_isVerifiedByAdmin + ") " + ";")

      print("\nquery to execute (ADDING NEW USER AS ADMIN):")
      print(query)

      # execute the query
      cursor.execute(query)
      conn.commit()

      query =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID, U.isVerifiedByAdmin " + 
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

      # sendEmailMessage_newAccountCreatedForUser(email, firstName, lastName, password)

      return resp
    else:
      print("Request method was for GET instead of POST")
    

  except Exception as e:
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


##
## Retrieves the id of the Users tuple with the highest integer value
##
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


## Deftermines whether a particular email is already in use by some user
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
    print("Error(isEmailInUseByAnyUser): ")
    print(e)

  finally:
    cursor.close()
    conn.close()

  
## Deftermines whether a particular username is already in use by some user
def isUsernameInUseByAnyUser(username):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    query = (" SELECT * " +
              " FROM  Users " +
              " WHERE Username = " + surr_apos(username) + ";")
    cursor.execute(query)
    rows = cursor.fetchall()
    resp = jsonify(rows)

    usernameAlreadyInUse = len(rows) > 0
    return usernameAlreadyInUse

  except Exception as e:
    print("Error(isEmailInUseByAnyUser): ")
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
def submit_new_userAccountRequest_ObserverHelper(firstName, lastName, nextObserverId):
  
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

      query =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
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

      query =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
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
    

    query =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
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



## Gets a specific user observer via a provided email
## DEPRECATED. better to access all data based on the unchanging value of Username
def getUserObserver_viaEmail(email):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    # execute a query to get all the users
    # query = (" SELECT * FROM Users, Observers WHERE Users.ObsID=Observers.ObsID;")
    

    query =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
              " FROM Observers as O, Users as U " +
              " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0 AND U.Email =" + surr_apos(email) + ";")


    cursor.execute(query)

    # store the response and return it as json
    rows = cursor.fetchall()
    resp = jsonify(rows)

    # output results for sanity check
    print("Result of getSingleUser - Flask API")
    print(rows)

    return rows

  except Exception as e:
    print(e)

  finally:
    cursor.close()
    conn.close()




## Gets a specific user observer via a provided username
def getUserObserver_viaUsername(username):
  conn = mysql.connect()
  cursor = conn.cursor(pymysql.cursors.DictCursor)

  try:
    
    query =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
              " FROM Observers as O, Users as U " +
              " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0 AND U.Username =" + surr_apos(username) + ";")


    cursor.execute(query)

    # store the response and return it as json
    rows = cursor.fetchall()
    resp = jsonify(rows)

    # output results for sanity check
    print("Result of getSingleUser - Flask API")
    print(rows)

    return rows

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
      givenUsername = request.json['username']
      givenPassword = request.json['password']

      # get the hashed password for the user
      getUserTupleQuery_forHash =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID, U.Password " + 
                                    " FROM Observers as O, Users as U " +
                                    " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0 " + " AND U.Username = " + surr_apos(givenUsername) + ";")

      # get query results
      cursor.execute(getUserTupleQuery_forHash)
      rows = cursor.fetchall()
      
      # if the length is 0 (user does not exist), return json containing "incorrect password"
      if (len(rows) == 0):
        return jsonify("Email/Password combination does not exist in the DB.")

      hashedPassword_inDatabase = rows[0]['Password']

      # rebuild the hashed password as utf... doesn't recognize the string as utf otherwise.
      encoded_givenPassword = givenPassword.encode('utf8')
      encoded_hashedPassword_inDatabase = convert_byte_string_to_unicodeString(hashedPassword_inDatabase)

      # print("\n\nHERE's THE ENCODED PASSWORD FROM USER:")
      # print(encoded_givenPassword)
      # print("\n\n")

      # print("\ntype of encoded_hashedPassword_inDatabase")
      # print(type(encoded_hashedPassword_inDatabase))

      passwordIsCorrect = bcrypt.checkpw( encoded_givenPassword , encoded_hashedPassword_inDatabase )
      
      if passwordIsCorrect:
        # get the user without the password
        getUserTupleQuery =  (" SELECT O.FirstName, O.LastName, U.isVerifiedByAdmin, U.UserID, U.Username, U.Initials, U.isAdmin, U.Affiliation, U.Email, O.ObsID " + 
                              " FROM Observers as O, Users as U " +
                              " WHERE U.ObsID = O.ObsID AND U.isAdmin>=0 " + " AND U.Username = " + surr_apos(givenUsername) + ";")

        # run query and get the result.
        cursor.execute(getUserTupleQuery)
        rows = cursor.fetchall()
        resp = jsonify(rows)
        
        # if the length is 0, return json containing "incorrect password"
        if (len(rows) == 0):
          return jsonify("Email/Password combination does not exist in the DB.")

        return resp

      else:
        return jsonify("Email/Password combination does not exist in the DB.")
      
      

  except Exception as e:
    print(e)
  finally:
    cursor.close()
    conn.close()



def convert_withoutEncoding_byte_to_Unicode(inputStr):
  inputLength = len(inputStr)

  #chop the parts we don't want
  choppedStr = inputStr[2 : inputLength-1]

  return choppedStr


##
## this function requires that the value it receives have the format b'....',
## b/c that's the representation of a unicode string
##
def convert_byte_string_to_unicodeString(inputStr):
  inputLength = len(inputStr)
  # print("inputlength: " + str(inputLength))

  #chop the parts we don't want
  choppedStr = inputStr[2 : inputLength-1]

  # print("\nNew string after chopping: ")
  # print(choppedStr)

  encodedString = choppedStr.encode('utf8')

  # print("\nNew string after encoding: ")
  # print(encodedString)
  return encodedString


## Places a single apostrophe on either side of a provided string
## and returns the result.
def surr_apos(origStr):
  retStr = "\'" + origStr + "\'"
  return retStr


## Attempts to insert records for a list of observations.
@app.route('/addobservations', methods=['POST', 'GET'])
def add_observations():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)



    try:
        if request.method == 'POST':

            print("1")
            _json = request.json
            print("2")
            #print(_json)
            startUpdate(json.dumps(_json), conn)
            print("3")
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
        statement = "Select o.*, os.SealID, json_arrayagg(ot.TagNumber) Tags, json_arrayagg(m.Mark) Marks from Observations o left join ObserveTags ot on ot.ObservationID = o.ObservationID left join ObserveMarks om on om.ObservationID = o.ObservationID left join Marks m on om.MarkID = m.MarkID left join ObserveSeal os on os.ObservationID = o.ObservationID where o.isApproved > 0 group by o.ObservationID order by o.Date desc"
        #"SELECT O.ObservationID , O.SealID , O.FieldLeader , O.Year , O.date , O.SLOCode , S.Sex , O.AgeClass , S.Mark , S.markDate , S.Mark2 , S.markDate2 , S.T1 , S.T2 , O.MoltPercent , O.Season , O.StandardLength , O.CurvilinearLength , O.AxillaryGirth , O.TotalMass , O.LastSeenPup , O.FirstSeenWeaner , O.Rnge , O.Comments , O.EnteredAno FROM (  SELECT seals.* FROM (  SELECT COUNT(*) count, inn.sealID FROM  (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) inn GROUP BY inn.sealID ) sealcounts,     (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) seals WHERE seals.SealID = sealcounts.sealID AND sealcounts.count = 1) S,  (SELECT main.ObservationID , main.SealID , main.FieldLeader , main.Year , main.date , main.SLOCode , main.sex , main.AgeClass, main.moltPercent , main.Year Season , Measurements.StandardLength , Measurements.CurvilinearLength , Measurements.AxillaryGirth , Measurements.AnimalMass , Measurements.TotalMass, main.LastSeenPup , main.FirstSeenWeaner , main.Rnge , main.Comments , main.EnteredAno FROM (SELECT Observations.*, ObserveSeal.SealID FROM Observations, ObserveSeal WHERE ObserveSeal.ObservationID = Observations.ObservationID) main LEFT OUTER JOIN Measurements ON Measurements.ObservationID = main.ObservationID WHERE main.IsValid = 0) O WHERE O.SealID = S.SealID;"
        # print(statement)
        print("here")
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
def getNotApproved():
        
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        statement = "Select o.*, os.SealID, json_arrayagg(ot.TagNumber) Tags, json_arrayagg(m.Mark) Marks from Observations o left join ObserveTags ot on ot.ObservationID = o.ObservationID left join ObserveMarks om on om.ObservationID = o.ObservationID inner join Marks m on om.MarkID = m.MarkID inner join ObserveSeal os on os.ObservationID = o.ObservationID where o.isApproved = 0 group by o.ObservationID order by o.ObservationID asc"
        #"SELECT O.ObservationID , O.SealID , O.FieldLeader , O.Year , O.date , O.SLOCode , S.Sex , O.AgeClass , S.Mark , S.markDate , S.Mark2 , S.markDate2 , S.T1 , S.T2 , O.MoltPercent , O.Season , O.StandardLength , O.CurvilinearLength , O.AxillaryGirth , O.TotalMass , O.LastSeenPup , O.FirstSeenWeaner , O.Rnge , O.Comments , O.EnteredAno FROM (  SELECT seals.* FROM (  SELECT COUNT(*) count, inn.sealID FROM  (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) inn GROUP BY inn.sealID ) sealcounts,     (SELECT AllTags.T1, AllTags.T2,  AllMarks.*, Seals.Sex, age.AgeClass  FROM Seals, (SELECT Observations.AgeClass, ObserveSeal.SealID FROM Observations, ObserveSeal, (SELECT MAX(Observations.ObservationID) ID FROM Seals, Observations, ObserveSeal WHERE Seals.SealID = ObserveSeal.SealID AND  Observations.ObservationID = ObserveSeal.ObservationID GROUP BY Seals.SealID) id WHERE Observations.ObservationID = id.ID and ObserveSeal.ObservationID = Observations.ObservationID) age,  (SELECT important.* FROM (SELECT inn.SealId, COUNT(*) count  FROM (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) inn GROUP BY inn.SealID) counts, (SELECT  S.SealID,  Mark.Mark,  Mark.markDate,  Mark2.Mark Mark2, Mark2.markDate markDate2 FROM Seals S  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark  ON S.SealID = Mark.SealID  LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate FROM Marks) Mark2  ON S.SealID = Mark2.SealID  AND Mark.Mark < Mark2.Mark) important WHERE important.SealID = counts.SealID AND  counts.count < 2 UNION ALL  SELECT  Seals.SealID,  M1.Mark, M1.markDate MarkDate, M2.Mark Mark2, M2.markDate MarkDate2 FROM Seals, (SELECT * FROM Marks) M1, (SELECT * FROM Marks) M2 WHERE M1.Mark < M2.Mark AND M1.MarkSeal = Seals.SealID AND M2.MarkSeal = Seals.SealID ) AllMarks, (SELECT important.SealID, important.T1, important.T2 FROM (SELECT inn.SealID, COUNT(*) count FROM (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) inn GROUP BY inn.SealID) counts, (SELECT S.SealID, Tag1.TagNumber T1, Tag2.TagNumber T2 FROM Seals S LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber) important WHERE important.SealID = counts.sealID AND  counts.count < 2 UNION ALL  SELECT Seals.SealID, Tag1.TagNumber, Tag2.TagNumber FROM Seals, (SELECT * FROM Tags) Tag1, (SELECT * FROM Tags) Tag2 WHERE Seals.SealId = Tag1.TagSeal AND Seals.SealID = Tag2.TagSeal AND Tag1.TagNumber < Tag2.TagNumber ) AllTags WHERE AllTags.SealID = AllMarks.SealID AND Seals.SealID = AllTags.SealID AND age.SealID = AllMarks.SealID ) seals WHERE seals.SealID = sealcounts.sealID AND sealcounts.count = 1) S,  (SELECT main.ObservationID , main.SealID , main.FieldLeader , main.Year , main.date , main.SLOCode , main.sex , main.AgeClass, main.moltPercent , main.Year Season , Measurements.StandardLength , Measurements.CurvilinearLength , Measurements.AxillaryGirth , Measurements.AnimalMass , Measurements.TotalMass, main.LastSeenPup , main.FirstSeenWeaner , main.Rnge , main.Comments , main.EnteredAno FROM (SELECT Observations.*, ObserveSeal.SealID FROM Observations, ObserveSeal WHERE ObserveSeal.ObservationID = Observations.ObservationID) main LEFT OUTER JOIN Measurements ON Measurements.ObservationID = main.ObservationID WHERE main.IsValid = 0) O WHERE O.SealID = S.SealID;"
        # print(statement)
        print("here")
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

@app.route('/approveobs', methods=['POST'])
def approveObs():
        
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        if request.method == 'POST':
            _json = request.json
            id = _json["obsId"]
            print(id)
            if (id == -1):
              statement = "Update Observations o SET o.isApproved = 1 where o.isApproved = 0"
            else:
              statement = "Update Observations o SET o.isApproved = 1 where o.ObservationID = " + str(id)
            cursor.execute(statement)
            conn.commit()
            resp = id
            return {"obsId": resp}
        return -1
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

@app.route('/approveallobs', methods=['POST'])
def approveAllObs():
    print("/approveallobs")
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        if request.method == 'POST':
            print("in post")
            statement = "Update Observations o SET o.isApproved = 1 where o.isApproved = 0"
            cursor.execute(statement)
            conn.commit()
            return 1
        return -1
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
    #app.run(host='127.0.0.1',port=5000, debug=True)
    #app.run(host="0.0.0.0")
    app.run(host='0.0.0.0',port=5000)




