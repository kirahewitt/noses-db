from mysql.connector import (connection)
from mysql.connector import errorcode
from datetime import datetime
import json
import pandas
import mysql
import csv
from dateutil import parser

exceptions = open("exceptions.csv", "w+")

FL = 0
YEAR = 1
DATE = 2
LOC = 3
SEX = 4
AGE = 5
PUP = 6
NEWMARK = 7
MARK = 8
MARKPOS = 9
NEWTAG = 13
TAG1 = 14
TAGPOS = 15
NEWTAG2 = 16
TAG2 = 17
TAG2POS = 18
MOLT = 19
SEASON = 20
STLENGTH = 21
CRVLENGTH = 22
AXGIRTH = 23
MASS = 24
TARE = 25
MASSTARE = 26
LASTSEEN = 27
FIRSTSEEN = 28
RANGE = 29
COMMENTS = 30
ENTERANO = 31
approvalStatus = 1


## Places a single apostrophe on either side of a provided string
## and returns the result.
def surr_apos(origStr):
    retStr = "\'" + origStr + "\'"
    return retStr


# # test
def makeConnection():
    try:
        #cnx = connection.MySQLConnection(user='kbleich',
        #                                password='abc123',
        #                                host='ambari-head.csc.calpoly.edu',
        #                                database='kbleich')

        cnx = connection.MySQLConnection(user='root',
                                        password='password',
                                        host='localhost',
                                        database='sealDB')
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        return cnx


# takes a table name to search, a value, and a column to find it in
# searches table and returns true if found
def canFind(cursor, tableName, value, column):
    check = "SELECT * FROM " + tableName + ";"
    cursor.execute(check)
    remaining_rows = cursor.fetchall()
    
    if any(row[column] == value for row in remaining_rows):
        return True # This is a resight
    return False


# puts NULL where there is empty space and puts "'" around string values
def swapNulls(row):
    for index in range(len(row)):
        if (row[index] == ""):
            row[index] = "NULL"
        elif (index not in [YEAR, DATE, MOLT, SEASON,
            STLENGTH, CRVLENGTH, AXGIRTH, MASS, TARE, MASSTARE,
            LASTSEEN, FIRSTSEEN]):
            row[index] = "'" + row[index] + "'"
    # print row


def getTopObsv(cursor):


    

    statement = "SELECT MAX(ObservationID) FROM Observations;"
    #result = runQuery(cursor, statement)
    runQuery(cursor, statement)
    #print('error got to here')
    row = cursor.fetchone()
    if row[0] is None:
        return 0
    else:
        return int(row[0])


def getTopMeasurement(cursor):
    statement = "SELECT MAX(MeasurementID) FROM Measurements;"
    #result = runQuery(cursor, statement)
    runQuery(cursor, statement)
    row = cursor.fetchone()
    if row[0] is None:
        return 0
    else:
        return int(row[0])


def getDate(date):
    # print date
    yourdate = parser.parse(date)
    #datetime_object = datetime.strptime(date, "%m/%d/%Y")
    return "'" + str(yourdate.date()) + "'"


def getDatey(date):
    # print date
    datetime_object = datetime.strptime(date, "%m/%d/%y")
    return "'" + str(datetime_object.date()) + "'"


## The first value in the values of the Observation insert is the autoincremented ID of
##  the Observations entity set. 
def insert_observation(cnx, cursor, row, approvalStatus):
    print("\n\n WRITE OBSERVATION...")


    print("OVER HERE APPROVAL STATUS IS: ")
    print(approvalStatus)
    if "_" in row[TAG1]:
        print("Inside writeObs: {:s} {:s} {:s}".format(row[DATE], row[27], row[28]))


    # Construct the sql command to insert an observation
    
    # statement = ("INSERT INTO Observations "
    #               "VALUES ("
    #             + str() + ", "
    #             + row[FL] + ", "
    #             + "'testEmail', "                          # email 
    #             + row[SEX] + ", "                          # gender
    #             + getDate(row[DATE]) + ", "                # date
    #             + row[MOLT] + ", '"                        # molt
    #             + row[COMMENTS].replace("'", "") + "', "   # comments
    #             + row[AGE] + ", "                          # Age
    #             + row[YEAR] + ", "                         # year
    #             + row[LOC] + ", "                          # (aka SLOCode)
    #             + str(approvalStatus) + ", "
                # + ((getDate(row[27])) if row[27] != "NULL" else row[27]) + ", "
                # + ((getDate(row[28])) if row[28] != "NULL" else row[28]) + ", "
                # + row[29] + ", "
                # + row[31] + ");")              # SLOCode 

    # insertUserCmd = (   "INSERT INTO Users(LoginID, FullName, Password, isAdmin, Affiliation)"
    #                             " VALUES " 
    #                             "(" + surr_apos(_json['loginID']) +
    #                             ", " + surr_apos(_json['fullname']) +
    #                             ", " + surr_apos(_json['password']) +
    #                             ", " + _json['isAdmin'] +
    #                             ", " + surr_apos(_json['affiliation']) +
    #                             ");"
    #                         )

    #print("\nINSERT USER COMMAND: " + insertUserCmd)

    print("BEFORE BUILDING STRING:")
    #statement = ("INSERT INTO Observations (email, sex, date, MoltPercent, Comments, AgeClass, Year, SLOCode) "
    statement = (   "INSERT INTO Observations(ObservationID, FieldLeader, email, sex, date, MoltPercent, Comments, AgeClass, Year, SLOCode, isApproved, LastSeenPup, FirstSeenWeaner, Rnge, EnteredAno) "
                            " VALUES "
                            "(" + "NULL" +                                                     # ObservationID (NULL b/c allows for automatic increment to work)
                            ", " + row[FL] +                                                     # Field Leader
                            ", " + surr_apos("iorourke@calpoly.edu") +
                            ", " + row[SEX] +
                            ", " + getDate(row[DATE]) +
                            ", " + row[MOLT] +
                            ", " + surr_apos(row[COMMENTS].replace("'", "")) +
                            ", " + row[AGE] +
                            ", " + row[YEAR] +
                            ", " + row[LOC] +
                            ", " + str(approvalStatus) +
                            ", " + ((getDate(row[27])) if row[27] != "NULL" else row[27]) +
                            ", " + ((getDate(row[28])) if row[28] != "NULL" else row[28]) +
                            ", " + row[29] +
                            ", " + row[31] +
                            ");"
                )
    print("AFTER BUILDING STRING")

                # + surr_apos("iorourke@calpoly.edu") + ", "                          # email 
                # + row[SEX] + ", "                                                   # sex
                # + getDate(row[DATE]) + ", "                                         # date
                # + row[MOLT] + ", '"                                                 # molt
                # + row[COMMENTS].replace("'", "") + "', "                            # comments
                # + row[AGE] + ", "                                                   # AgeClass
                # + row[YEAR] + ", "                                                  # year
                # + row[LOC] + ", "                                                   # (aka SLOCode)
                # + str(approvalStatus) + ", "                                        # approval status
                # + ((getDate(row[27])) if row[27] != "NULL" else row[27]) + ", "     # last seen as pup
                # + ((getDate(row[28])) if row[28] != "NULL" else row[28]) + ", "     # first seen as weaner
                # + row[29] + ", "                                                    # range
                # + row[31] + ");")                                                   # Entered in Ano
    print("*****BEFORE PRINT STATEMENT")
    print(statement)

    try:
        #cursor.execute(statement)
        #cnx.commit()
        pushQuery(cnx, cursor, statement)
        print("before observation insert")
        getLast_statement = "SELECT LAST_INSERT_ID();"
        
        runQuery(cursor, getLast_statement)
        print("after observation insert")
        row = cursor.fetchone()
        observationID = row[0]
        print("after observation insert: " + str(observationID))
        return observationID
    except mysql.connector.Error as err:
        print(err)
        return -5

def pushQuery(cnx, cursor, query):
    try:
        print(query)
        #row = cursor.execute(query)
        cursor.execute(query)
        cnx.commit()
    except mysql.connector.Error as err:
        print(err)
        exit(1)

def runQuery(cursor, query):
    try:
        print(query)
        cursor.execute(query)
    except mysql.connector.Error as err:
        print(err)
        exit(1)

# takes cursor and tag to look for
# returns obsID if found, -1 if not found
def getMarkId(cursor, mark, year):
    # print("mark, {:s} year {:s}".format(mark, year))
    query = "SELECT MarkID FROM Marks WHERE Mark = {:s} and Year = {:s};".format(mark, year)
    runQuery(cursor, query)
    row = cursor.fetchone()
    # print("getMark: ", row, mark)
    if (row is None):
        return -1
    else:
        return int(row[0])


# Performs two actions:
# (1) inserts a Marks tuple
# (2) inserts a ObserveMarks tuple
def addMark(cnx, cursor, row, observationID, sealID):
    insert_mark(cnx, cursor, row, observationID, sealID)
    query = "SELECT MAX(MarkID) FROM Marks;"
    runQuery(cursor, query)
    row = cursor.fetchone()
    markid = row[0]
    insert_observeMark(cnx, cursor, markid, observationID)

def insert_observeMark(cnx, cursor, mark, observationID):
    statement = "INSERT INTO ObserveMarks VALUES ({:d}, {:d});".format(observationID, mark)
    pushQuery(cnx, cursor, statement)

# takes an observation from which to make a new mark
# updates table with the new mark, with error checks
def insert_mark(cnx, cursor, csvRow, obsID, sealID):
    MARK    = 8
    MARKPOS = 9
    YEAR    = 1
    statement = ("INSERT INTO Marks VALUES ("
                + "NULL" + ", "                                 # MarkID... NULL allows auto-increment to take over
                + csvRow[MARK].replace(" ", "") + ", "          # mark
                + csvRow[MARKPOS] + ", "                        # mark position 'b', 'l', 'r'
                + str(getDate(csvRow[2]))+ ", "                 # date
                + csvRow[YEAR] + ", "                           # year
                + str(sealID) + ");")                           # seal id
    print(statement)
    try:
        cursor.execute(statement)
        cnx.commit()
    except mysql.connector.Error as err:
        print(err)
        exit(1)

# returns obsID if found, -1 if not found
def getTagNumber(cursor, tag):
    query = "SELECT TagNumber FROM Tags WHERE TagNumber = {:s}".format(tag)
    runQuery(cursor, query)
    row = cursor.fetchone()
    print("getTag: ", row)
    if (row is None):
        return -1
    else:
        return int(row[0])


def addTag(cnx, cursor, row, tagNumber, observationID, sealID):
    print("test1.5")
    insert_tag(cnx, cursor, row, tagNumber, observationID)
    print("test1.6")
    insert_observeTag(cnx, cursor, tagNumber, observationID)
    print("test1.7")


## Adds a new tuple to the ObserveTags relation, which represents a tag sighted in a particular observation.
def insert_observeTag(cnx, cursor, tagNumber, observationID):
    #getNewOTAG = "SELECT MAX(OTAG_ID) FROM ObserveTags;"
    #runQuery(cursor, getNewOTAG)
    #row = cursor.fetchone()
    # if(row[0] is not None):
    #     OTAG_ID = int(row[0]) + 1
    # else:
    #     OTAG_ID = 0
    statement = "INSERT INTO ObserveTags VALUES (NULL, {:d}, {:s});".format(observationID, tagNumber)
    pushQuery(cnx, cursor, statement)

def getColor(tag):
    # print ("tag: ", tag)
    if tag == 'G':
        return "'green'"
    elif tag == "W":
        return "'white'"
    elif tag == "B":
        return "'blue'"
    elif tag == "Y":
        return "'yellow'"
    elif tag == "R":
        return "'red'"
    elif tag == "P":
        return "'pink'"
    elif tag == "V":
        return "'violet'"
    elif tag == "O":
        return "'orange'"
    else:
        return "'unknown'"

# takes an observation from which to make a new mark
# updates table with the new mark, with error checks
def insert_tag(cnx, cursor, csvRow, tagNumber, observationID):
    TAGPOS  = 9

    statement = ("INSERT INTO Tags VALUES ("
                + str(tagNumber) + ", "        # mark
                + getColor(tagNumber) + ", "          # TODO write getTagColor(row[whichTag][0])
                + csvRow[TAGPOS] + ", "
                + str(getDate(csvRow[2])) + ", "
                + str(observationID) + ");")        # 
    print(statement)
    try:
        cursor.execute(statement)
        cnx.commit()
    except mysql.connector.Error as err:
        print(err)
        exit(1)

def pushMeasurement(cnx, cursor, obsID, row):
    newID = getTopMeasurement(cursor) + 1

    statement = "INSERT INTO Measurements VALUES ({:d}, {:d}, {:s}, {:s}, {:s}, {:s}, {:s});".format(newID, obsID, 
            row[AXGIRTH], row[MASS], row[TARE], row[CRVLENGTH], row[STLENGTH])
    pushQuery(cnx, cursor, statement)

def dropSeal(cnx, cursor, ID):
    statement = "DELETE FROM Seals WHERE Seals.SealID = {:d};".format(ID)
    pushQuery(cnx, cursor, statement)

def updateMark(cnx, cursor, markID, newSeal):
    statement = ("UPDATE Marks SET "
            + "MarkSeal = {:d} WHERE MarkSeal = {:d};").format(newSeal, markID)
    pushQuery(cnx, cursor, statement)

def updateTag(cnx, cursor, tag, newSeal):
    statement = ("UPDATE Tags SET "
            + "TagSeal = {:d} WHERE TagSeal = {:d};").format(newSeal, tag)
    pushQuery(cnx, cursor, statement)
    

def updateObserveMark(cnx, cursor, old, new):
    print("Update Observe Mark ", old, " to ", new)
    statement = ("UPDATE ObserveMarks SET "
                + "ObservationID = {:d} WHERE ObservationID = {:d};").format(new, old)
    pushQuery(cnx, cursor, statement)

def updateObserveTag(cnx, cursor, old, new):
    print("Update Observe Tag ", old, " to ", new)
    statement = ("UPDATE ObserveTags SET "
                + "ObservationID = {:d} WHERE ObservationID = {:d};").format(new, old)
    pushQuery(cnx, cursor, statement)


# consolidates a seal with tags/IDs that don't match on obsID
# For each tag and mark
def consolidate(cnx, cursor, sealID, tags, marks):
    # print("tags: ", tags, "marks: ", marks)
    seals = []
    for ID in tags:
        updateTag(cnx, cursor, ID, sealID)
        updateMark(cnx, cursor, ID, sealID)
        if ID not in seals:
            seals.append(ID)
        #updateObserveTag(cnx, cursor, ID, obsID)
    for ID in marks:
        #dropSeal(cnx, cursor, ID)
        updateMark(cnx, cursor, ID, sealID)
        updateTag(cnx, cursor, ID, sealID)
        if ID not in seals:
            seals.append(ID)
        #updateObserveMark(cnx, cursor, ID, obsID)
    for ID in seals:
        updateObserveSeal(cnx, cursor, ID, sealID)
        dropSeal(cnx, cursor, ID)

def insert_seal(cnx, cursor, row, observationID):
    # insert a seal into DB
    statement = "INSERT INTO Seals VALUES (NULL, {:d}, {:s}, FALSE)".format(observationID, row[SEX])
    pushQuery(cnx, cursor, statement)

    # get ID generated by auto-increment
    print("before insert seal id check")
    getLast_statement = "SELECT LAST_INSERT_ID();"
    runQuery(cursor, getLast_statement)
    row = cursor.fetchone()
    sealID = row[0]
    print("before insert seal id check")
    print("CREATE SEAL GOT THE ID: " + str(sealID))
    return sealID

# adds all non-null tags/marks and then adds a seal
def addSeal(cnx, cursor, row, observationID):
    sealID = insert_seal(cnx, cursor, row, observationID)
    if(row[MARK] != "NULL"):
        addMark(cnx, cursor, row, observationID, sealID)
    if(row[TAG1] != "NULL"):
        addTag(cnx, cursor, row, row[TAG1], observationID, sealID)
    if(row[TAG2] != "NULL"):
        addTag(cnx, cursor, row, row[TAG2], observationID, sealID)
    return sealID

##  Returns the index of the ID that should be used in identifying the seal to be created.
##  Receives an array: ([mID, t1ID, t2ID])
##    mID = mark id
##    t1ID = tag1 ID
##    t2ID = tag2 ID
def positiveMin(IDs):
    mainID = 99999999999
    if IDs[0] != -1:
        mainID = IDs[0]
    if IDs[1] != -1 and IDs[1] < mainID:
        mainID = IDs[1]
    if IDs[2] != -1 and IDs[2] < mainID:
        mainID = IDs[2]
    return mainID

def observeSeal(cnx, cursor, sealID, obsID):
    statement = "INSERT INTO ObserveSeal(ObservationID, SealID) VALUES ({:d},{:d});".format(obsID, sealID)
    pushQuery(cnx, cursor, statement)

def updateObserveSeal(cnx, cursor, oldSeal, newSeal):
    statement = "UPDATE ObserveSeal SET SealID = {:d} WHERE SealID = {:d};".format(newSeal, oldSeal)
    pushQuery(cnx, cursor, statement)


# "row" contains all the data for the observation we want to insert.
# But before we do any inserting we need to make sure that we don't insert any duplicate Marks, Tags or Seals.
# So this method will look at the identifiers provided for Tags and Marks. If the identifier exists,
#  it will use the existing instance of the tag or mark respectively. If the identifier doesn't exist,
#  it will create it.
# takes an observation and determines if the seal has been seen before
def processObservation(cnx, cursor, row, approvalStatus):

    observationID = insert_observation(cnx, cursor, row, approvalStatus)

    if(row[STLENGTH] != "NULL" or row[CRVLENGTH] != "NULL" or row[AXGIRTH] != "NULL" or row[MASS] != "NULL" or row[TARE] != "NULL" or row[MASSTARE] != "NULL"):
        pushMeasurement(cnx, cursor, observationID, row)

    divergentT = []
    divergentM = []
    merge = False

    mID = getMarkId(cursor, row[MARK], row[YEAR])
    t1ID = getTagNumber(cursor, row[TAG1])
    t2ID = getTagNumber(cursor, row[TAG2])

    mainID = positiveMin([mID, t1ID, t2ID])
    # print "Positive min: {:d}".format(mainID)

    # if we don't find the marks or tags
    if(mID == -1 and t1ID == -1 and t2ID == -1):
        mainID = addSeal(cnx, cursor, row, observationID)
    else:

        print("...Processing Mark...")
        # insert the mark if not already in the DB
        if (mID == -1 and row[MARK] != "NULL"):                 # didn't find markID    AND     a mark was specified
            addMark(cnx, cursor, row, observationID, mainID)
        elif (mID != -1 and row[MARK] != "NULL"):               # found markID          AND     a mark was specified
            query = "SELECT MarkID FROM Marks WHERE Mark = {:s};".format(row[MARK])
            runQuery(cursor, query)
            fetch = cursor.fetchone()
            markid = fetch[0]
            insert_observeMark(cnx, cursor, markid, observationID)

        print("...Processing Tag1...")
        # insert tag1 if not already in the DB
        print("test0")
        if (t1ID == -1 and row[TAG1] != "NULL"):                # didn't find tagnum    AND     a tag was specified
            print("test1")
            addTag(cnx, cursor, row, row[TAG1], observationID, mainID)
            print("test2")
        elif (t1ID != -1):                                      # found tagNum          AND     a tag was specified
            insert_observeTag(cnx, cursor, row[TAG1], observationID)

        print("...Processing Tag2...")
        # insert tag2 if not already in the DB
        if (t2ID == -1 and row[TAG2] != "NULL"):
            addTag(cnx, cursor, row, row[TAG2], observationID, mainID)
        elif (t2ID != -1 and row[TAG2] != "NULL"):
            insert_observeTag(cnx, cursor, row[TAG2], observationID)


        print("...divergent stuff...")
        if(mID != mainID and row[MARK] != "NULL" and mID != -1):
            divergentM.append(mID)
            merge = True
        if(t1ID != mainID and row[TAG1] != "NULL" and t1ID != -1):
            divergentT.append(t1ID)
            merge = True
        if(t2ID != mainID and row[TAG2] != "NULL" and t2ID !=  -1):
            divergentT.append(t2ID)
            merge = True

        print("...Checking for need to merge...")
        if(merge is True):
            # print("divergents: ", divergentT, divergentM)
            consolidate(cnx, cursor, mainID, divergentT, divergentM)
    
    print("...Recording relationship btwn OBSERVATIONS and SEALS...")
    observeSeal(cnx, cursor, mainID, observationID)

# Attempts to add a list of observations to the database.
def startUpdate(obj):
    print("\n\nSTART UPDATE...\n")
    cnx = makeConnection()
    cursor = cnx.cursor(buffered=True)

    # filename = raw_input("Give file name: ")
    # f = open(filename)
    # line = f.read()
    print('in seal upload')
    y = json.loads(obj)
    j_obj = y[0]
    # print(y)
    approvalStatus = y[1]["isApproved"]
    print("approval status is: " + str(approvalStatus))
#    with open(filename) as csvfile:
#        readCSV = csv.reader(csvfile, delimiter=',')
#        for row in readCSV:
    for val in j_obj:
        row = [val["Field Leader Initials"],
                val["Year"],
                val["Date"],
                val["Loc."],
                val["Sex"],
                val["Age"],
                val["Pup?"],
                val["New Mark 1?"],
                val["Mark 1"],
                val["Mark 1 Position"],
                val["New Mark 2?"],
                val["Mark 2"],
                val["Mark 2 Position"],
                val["New Tag1?"],
                val["Tag1 #"],
                val["Tag 1 Pos."],
                val["New Tag2?"],
                val["Tag2 #"],
                val["Tag 2 Pos."],
                val["Molt (%)"],
                val["Season"],
                val["St. Length"],
                val["Crv. Length"],
                val["Ax. Girth"],
                val["Mass"],
                val["Tare"],
                val["Mass-Tare"],
                val["Last seen as P"],
                val["1st seen as W"],
                val["Range (days)"],
                val["Comments"],
                val["Entered in Ano"]]
        if canFind(cursor, "Beach", row[LOC], 0):
            swapNulls(row)
            processObservation(cnx, cursor, row, approvalStatus)
        else:
            exceptions.write("\"" + str(val["Field Leader Initials"]) + "\""
              + ", " + str(val["Year"])
              + ", " + str(val["Date"])
              + ", " + str(val["Loc."])
              + ", " + str(val["Sex"])
              + ", " + str(val["Age"])
              + ", " + str(val["Pup?"])
              + ", " + str(val["New Mark 1?"])
              + ", " + str(val["Mark 1"])
              + ", " + str(val["Mark 1 Position "])
              + ", " + str(val["New Mark 2?"])
              + ", " + str(val["Mark 2"])
              + ", " + str(val["Mark 2 Position"])
              + ", " + str(val["New Tag1?"])
              + ", " + str(val["Tag1 #"])
              + ", " + str(val["Tag 1 Pos. "])
              + ", " + str(val["New Tag2?"])
              + ", " + str(val["Tag2 #"])
              + ", " + str(val["Tag 2 Pos. "])
              + ", " + str(val["Molt (%)"])
              + ", " + str(val["Season"])
              + ", " + str(val["St. Length"])
              + ", " + str(val["Crv. Length"])
              + ", " + str(val["Ax. Girth"])
              + ", " + str(val["Mass"])
              + ", " + str(val["Tare"])
              + ", " + str(val["Mass-Tare"])
              + ", " + str(val["Last seen as P"])
              + ", " + str(val["1st seen as W"])
              + ", " + str(val["Range (days)"])
              + ", " + str(val["Comments"])
              + ", " + str(val["Entered in Ano "])
              + ", " + "Location unkown" + "\n")

    print(" ****CLOSING STUFF")
    exceptions.close()
    cnx.close()

if __name__ == '__main__':
    main()
