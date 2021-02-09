import pymysql
from mysql.connector import (connection)
from mysql.connector import errorcode
from datetime import datetime
import json
import pandas
import mysql
import csv
from dateutil import parser




###########################################################################
###########################################################################
#not sure if i need to have this here too
_FL = 0
_YEAR = 1
_DATE = 2
_LOC = 3
_SEX = 4
_AGE = 5
_PUP = 6

_NEWMARK1 = 7
_MARK1 = 8
_MARKPOS1 = 9

_NEWMARK2 = 10
_MARK2 = 11
_MARKPOS2 = 12

_NEWTAG1 = 13
_TAG1 = 14
_TAGPOS1 = 15

_NEWTAG2 = 16
_TAG2 = 17
_TAGPOS2 = 18

_MOLT = 19
_SEASON = 20
_STLENGTH = 21
_CRVLENGTH = 22
_AXGIRTH = 23
_MASS = 24
_TARE = 25
_MASSTARE = 26
_LASTSEEN = 27
_FIRSTSEEN = 28
_RANGE = 29
_COMMENTS = 30
_ENTERANO = 31
_SEALID = 32

from Observation import Observation
###########################################################################
###########################################################################

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

NEWMARK2 = 10
MARK2 = 11
MARKPOS2 = 12

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
        # Config: DB - csc 366
        #cnx = connection.MySQLConnection(user='kbleich',
        #                                password='abc123',
        #                                host='ambari-head.csc.calpoly.edu',
        #                                database='kbleich')

        # Config: localhost
        # cnx = connection.MySQLConnection(user='root',
        #                                 password='password',
        #                                 host='localhost',
        #                                 database='sealDB')

        # Config: AWS iorourke@calpoly.edu
        cnx = connection.MySQLConnection(user='admin',
                                        password='CS492_ij',
                                        host='database-this-is-the-last-time.cvrgneqrnjcb.us-east-2.rds.amazonaws.com',
                                        database='sealDB')


        return cnx
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        return None


# takes a table name to search, a value, and a column to find it in
# searches table and returns true if found
def canFind(cursor, tableName, value, column):
    check = "SELECT * FROM " + tableName + ";"
    cursor.execute(check)
    remaining_rows = cursor.fetchall()
    print(remaining_rows)
    if any(row[column] == value for row in remaining_rows):
        return True # This is a resight
    return False


# puts NULL where there is empty space and puts "'" around string values
def swapNulls(row):
    for index in range(len(row)):
        if (isinstance(row[index], str) and row[index] == ""):
            row[index] = "NULL"
        elif (isinstance(row[index], str) and index not in [YEAR, DATE, MOLT, SEASON,
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
    print(row)
    if row['MAX(MeasurementID)'] is None:
        return 0
    else:
        return int(row['MAX(MeasurementID)'])


def getDate(date):
    # print date
    yourdate = parser.parse(date)
    #datetime_object = datetime.strptime(date, "%m/%d/%Y")
    return "'" + str(yourdate.date()) + "'"


def getDatey(date):
    # print date
    datetime_object = datetime.strptime(date, "%m/%d/%y")
    return "'" + str(datetime_object.date()) + "'"

def getOrAddObserver(cnx, cursor, fieldLeader):
    initials = fieldLeader.split(', ')[0].replace('\'', '')
    fInitial = initials[0]
    lInitial = initials[1]
    check = "SELECT ObsID from Observers o where o.FirstName LIKE '" + fInitial + "%' and o.LastName LIKE '" + lInitial + "%'"
    print(check)
    cursor.execute(check)
    row = cursor.fetchone()
    if row is not None:
        return row["ObsID"]
    statement = "Insert into Observers(FirstName, LastName) Values ('" + fInitial + "', '" + lInitial + "')"
    pushQuery(cnx, cursor, statement)
    getLast_statement = "SELECT LAST_INSERT_ID();"
    cursor.execute(getLast_statement)
    row = cursor.fetchone()
    print(row)
    return row['LAST_INSERT_ID()']


## The first value in the values of the Observation insert is the autoincremented ID of
##  the Observations entity set. 
def insert_observation(cnx, cursor, row, approvalStatus):
    print("\n\n WRITE OBSERVATION...")
    
    print("OVER HERE APPROVAL STATUS IS: ")
    print(approvalStatus)
    observerId = getOrAddObserver(cnx, cursor, row[FL])
    print("Observer: " + str(observerId))
    if "_" in row[TAG1]:
        print("Inside writeObs: {:s} {:s} {:s}".format(row[DATE], row[27], row[28]))

    print("BEFORE BUILDING STRING:")
    print(json.dumps(row))
    statement = (   "INSERT INTO Observations(ObserverID, sex, date, MoltPercent, Comments, AgeClass, Year, SLOCode, isApproved, LastSeenPup, FirstSeenWeaner, WeanDateRange, EnteredInAno) "
                            " VALUES "
                            "(" + str(observerId) +
                            ", " + row[SEX] +
                            ", " + getDate(row[DATE]) +
                            ", " + str(row[MOLT]) +
                            ", " + surr_apos(row[COMMENTS].replace("'", "")) +
                            ", " + str(row[AGE]) +
                            ", " + str(row[YEAR]) +
                            ", " + row[LOC] +
                            ", " + str(approvalStatus) +
                            ", " + ((getDate(row[27])) if row[27] != "NULL" else row[27]) +
                            ", " + ((getDate(row[28])) if row[28] != "NULL" else row[28]) +
                            ", " + str(row[29]) +
                            ", " + str(row[31]) +
                            ");"
                )
    print("AFTER BUILDING STRING")

    try:
        # perform the sql insertion command
        pushQuery(cnx, cursor, statement)
        print("before observation insert")

        # run a query that will get us the id of the last observation we inserted
        getLast_statement = "SELECT LAST_INSERT_ID();"
        cursor.execute(getLast_statement)
        row = cursor.fetchone()
        print(row)
        observationID = row["LAST_INSERT_ID()"]
        
        print("after observation insert: " + str(observationID))
        return observationID
    except mysql.connector.Error as err:
        print(err)
        return -5


# runs a sql command and calls commit() afterwards to keep the changes
def pushQuery(cnx, cursor, query):
    try:
        print(query)
        #row = cursor.execute(query)
        cursor.execute(query)
        cnx.commit()
    except mysql.connector.Error as err:
        print(err)
        exit(1)


# runs a sql query, for getting data
def runQuery(cursor, query):
    try:
        print(query)
        cursor.execute(query)
    except mysql.connector.Error as err:
        print(err)
        exit(1)


# takes cursor and tag to look for
# returns obsID if found, -1 if not found
def getSealIdFromMark(cursor, mark, year):
    # print("mark, {:s} year {:s}".format(mark, year))
    query = "SELECT s.SealID from Seals s inner join ObserveSeal os on os.SealID = s.SealID inner join Observations o on os.ObservationID = o.ObservationID inner join ObserveMarks om on om.ObservationID = o.ObservationID inner join Marks m on m.MarkID = om.MarkID where m.Mark = {:s} and m.Year = {:s};".format(mark, year)
    runQuery(cursor, query)
    row = cursor.fetchone()
    # print("getMark: ", row, mark)
    if (row is None):
        return -1
    else:
        return int(row["SealID"])


# Performs two actions:
# (1) inserts a Marks tuple
# (2) inserts a ObserveMarks tuple
def addMark(cnx, cursor, row, observationID, sealID):
    insert_mark(cnx, cursor, row, observationID, sealID)
    query = "SELECT MAX(MarkID) FROM Marks;"
    runQuery(cursor, query)
    row = cursor.fetchone()
    markid = row["MAX(MarkID)"]
    insert_observeMark(cnx, cursor, markid, observationID)

def insert_observeMark(cnx, cursor, mark, observationID):
    print("making insert observemark statement")
    statement = "INSERT INTO ObserveMarks VALUES ({:d}, {:d});".format(observationID, mark)
    pushQuery(cnx, cursor, statement)

# takes an observation from which to make a new mark
# updates table with the new mark, with error checks
def insert_mark(cnx, cursor, csvRow, obsID, sealID):
    MARK    = 8
    MARKPOS = 9
    YEAR    = 1

    # get the values for our sql statement
    t_markID = "NULL"
    t_mark = csvRow[MARK].replace(" ", "")
    t_markPosition = csvRow[MARKPOS]
    t_markDate = str(getDate(csvRow[2]))
    t_year = csvRow[YEAR]
    t_observationID = str(obsID)
    t_markSeal = str(sealID)
    
    print("Making insert mark statement")
    print("")
    # make the sql statement
    statement = ("INSERT INTO Marks (MarkID, Mark, MarkPosition, markDate, Year, ObservationID) " 
                "VALUES " 
                "(" + t_markID +                                      # MarkID... NULL allows auto-increment to take over
                ", " + t_mark +          # mark
                ", " + t_markPosition +                         # mark position 'b', 'l', 'r'
                ", " + t_markDate +                  # date
                ", " + str(t_year) +                            # year
                ", " + t_observationID + ");")                           # seal id
    print(statement)

    # run the sql statement
    try:
        cursor.execute(statement)
        cnx.commit()
    except mysql.connector.Error as err:
        print(err)
        exit(1)


# returns obsID if found, -1 if not found
def getSealIDFromTag(cursor, tag):
    query = "SELECT s.SealID from Seals s inner join ObserveSeal os on os.SealID = s.SealID inner join Observations o on os.ObservationID = o.ObservationID inner join ObserveTags ot on ot.ObservationID = o.ObservationID inner join Tags t on t.TagNumber = ot.TagNumber where t.TagNumber = {:s};".format(tag)
    runQuery(cursor, query)
    row = cursor.fetchone()
    print("getTag: ", row)
    if (row is None):
        return -1
    else:
        return int(row["SealID"])


def addTag(cnx, cursor, row, tagNumber, observationID, sealID):
    print("test1.5")
    insert_tag(cnx, cursor, row, tagNumber, observationID, sealID)
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
def insert_tag(cnx, cursor, csvRow, tagNumber, observationID, sealID):
    TAGPOS  = 9

    print("making insert tag statement")
    statement = ("INSERT INTO Tags(TagNumber, TagColor, TagPosition, TagDate) VALUES ("
                + str(tagNumber) + ", "        # mark
                + getColor(tagNumber) + ", "          # TODO write getTagColor(row[whichTag][0])
                + csvRow[TAGPOS] + ", "
                + str(getDate(csvRow[2])) + ");")        # 
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
        if ID not in seals:
            seals.append(ID)
        #updateObserveTag(cnx, cursor, ID, obsID)
    for ID in marks:
        if ID not in seals:
            seals.append(ID)
        #updateObserveMark(cnx, cursor, ID, obsID)
    for ID in seals:
        updateObserveSeal(cnx, cursor, ID, sealID)
        dropSeal(cnx, cursor, ID)


def insert_seal(cnx, cursor, row, observationID):
    # insert a seal into DB
    print("here")
    statement = "INSERT INTO Seals VALUES (NULL, {:d}, {:s}, FALSE)".format(observationID, row[SEX])
    pushQuery(cnx, cursor, statement)

    # get ID generated by auto-increment
    print("before insert seal id check")
    getLast_statement = "SELECT LAST_INSERT_ID();"
    runQuery(cursor, getLast_statement)
    row = cursor.fetchone()
    sealID = row["LAST_INSERT_ID()"]
    print("before insert seal id check")
    print("CREATE SEAL GOT THE ID: " + str(sealID))
    return sealID


# adds all non-null tags/marks and then adds a seal, returning the sealID
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

    print("IDs[0] " + str(IDs[0]))
    print("IDs[1] " + str(IDs[1]))
    print("IDs[2] " + str(IDs[2]))

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



# Operates on each of our marks.
# For each mark:
#    if the mark is new --> try to create the mark
#    if the mark isn't new --> find the 
#def processMarks(observationRecord, cursor, row, approvalStatus):
    
    



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
    # see if any of the identifiers in this observation match an existing seal/dossier
    mID = getSealIdFromMark(cursor, row[MARK], str(row[YEAR]))
    print("marked")
    t1ID = getSealIDFromTag(cursor, row[TAG1])
    print("tagged")
    if(row[TAG2]):
        t2ID = getSealIDFromTag(cursor, row[TAG2])

    mainID = positiveMin([mID, t1ID, t2ID])
    if row[_SEALID] > 0:
        mainID = row[_SEALID]
    print("test4")

    # turn the row into an object to make our lives easier
    #observationRecord = Observation(row)

    # process marks    
    #processMarks(observationRecord, cursor, row, approvalStatus)

    # if we don't find the marks or tags
    if(row[_SEALID] <= 0 and mID == -1 and t1ID == -1 and t2ID == -1):
        mainID = addSeal(cnx, cursor, row, observationID)
    else:

        # print("...Processing Mark...")
        # # insert the mark if not already in the DB
        # if (mID == -1 and row[MARK] != "NULL"):                 # didn't find markID    AND     a mark was specified
        #     addMark(cnx, cursor, row, observationID, mainID)
        # elif (mID != -1 and row[MARK] != "NULL"):               # found markID          AND     a mark was specified
        #     query = "SELECT MarkID FROM Marks WHERE Mark = {:s};".format(row[MARK])
        #     runQuery(cursor, query)
        #     fetch = cursor.fetchone()
        #     markid = fetch[0]
        #     insert_observeMark(cnx, cursor, markid, observationID)

        print("...Processing Mark...")
        if (mID == -1 and row[MARK] != "NULL"):                 # didn't find markID    AND     a mark was specified
            addMark(cnx, cursor, row, observationID, mainID)
        elif (mID != -1 and row[MARK] != "NULL"):               # found markID          AND     a mark was specified
            query = "SELECT MarkID FROM Marks WHERE Mark = {:s};".format(row[MARK])
            runQuery(cursor, query)
            fetch = cursor.fetchone()
            markid = fetch["MarkID"]
            insert_observeMark(cnx, cursor, markid, observationID)

        print("...Processing Tag1...")
        # insert tag1 if not already in the DB
        print("test0")
        if (t1ID == -1 and row[TAG1] != "NULL"):                # didn't find tagnum    AND     a tag was specified
            print("test1")
            addTag(cnx, cursor, row, row[TAG1].strip(), observationID, mainID)
            print("test2")
        elif (t1ID != -1):                                      # found tagNum          AND     a tag was specified
            insert_observeTag(cnx, cursor, row[TAG1].strip(), observationID)

        print("...Processing Tag2...")
        # insert tag2 if not already in the DB
        if (t2ID == -1 and row[TAG2] != "NULL"):
            addTag(cnx, cursor, row, row[TAG2].strip(), observationID, mainID)
        elif (t2ID != -1 and row[TAG2] != "NULL"):
            insert_observeTag(cnx, cursor, row[TAG2].strip(), observationID)


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

        # if(mID != mainID and row[MARK] != "NULL" and mID != -1):
        #     divergentM.append(mID)
        #     merge = True
        # if(t1ID == None && mainID==- != mainID and row[TAG1] != "NULL" and t1ID != None):
        #     divergentT.append(t1ID)
        #     merge = True
        # if(t2ID != mainID and row[TAG2] != "NULL" and t2ID !=  None):
        #     divergentT.append(t2ID)
        #     merge = True

        print("...Checking for need to merge...")
        if(merge is True):
            # print("divergents: ", divergentT, divergentM)
            consolidate(cnx, cursor, mainID, divergentT, divergentM)
    print(mID, t1ID, t2ID, mainID)
    print("...Recording relationship btwn OBSERVATIONS and SEALS...")
    observeSeal(cnx, cursor, mainID, observationID)


# Attempts to add a list of observations to the database.
def startUpdate(obj, cnx):
    print("\n\nSTART UPDATE...\n")
    cursor = cursor = cnx.cursor(pymysql.cursors.DictCursor)

    print('in seal upload', obj)
    y = json.loads(obj)
    if isinstance(y[0], dict):
        y = [y]
        print(y)
    j_obj = y[0]
    
    approvalStatus = y[1]["isApproved"]
    print("approval status is: " + str(approvalStatus))

    i = 0
    print(j_obj[0])
    for val in j_obj:
        print("*" + str(i) + "*")
        
        print(val["Mark 1 Position"])
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
        if "SealId" in val:
            row.append(val["SealId"])
        else:
            row.append(0)
        print("before conditions")
        tableName = "Beach"
        sloCode = row[LOC]
        print(sloCode)
        isFound = canFind(cursor, tableName, sloCode, "SLOCode")
        print(isFound)
        if isFound:
            print("   test1")
            swapNulls(row)
            print("   test2")
            processObservation(cnx, cursor, row, approvalStatus)
            print("   test3")
        else:
            print("   ERROR")
            exceptions.write("\"" + str(val["Field Leader Initials"]) + "\""
              + ", " + str(val["Year"])
              + ", " + str(val["Date"])
              + ", " + str(val["Loc."])
              + ", " + str(val["Sex"])
              + ", " + str(val["Age"])
              + ", " + str(val["Pup?"])
              + ", " + str(val["New Mark 1?"])
              + ", " + str(val["Mark 1"])
              + ", " + str(val["Mark 1 Position"])
              + ", " + str(val["New Mark 2?"])
              + ", " + str(val["Mark 2"])
              + ", " + str(val["Mark 2 Position"])
              + ", " + str(val["New Tag1?"])
              + ", " + str(val["Tag1 #"])
              + ", " + str(val["Tag 1 Pos."])
              + ", " + str(val["New Tag2?"])
              + ", " + str(val["Tag2 #"])
              + ", " + str(val["Tag 2 Pos."])
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
              + ", " + str(val["Entered in Ano"])
              + ", " + "Location unkown" + "\n")
        
        i = i + 1

    print(" ****CLOSING STUFF")
    exceptions.close()
    #cnx.close()

#if __name__ == '__main__':
#    main()
