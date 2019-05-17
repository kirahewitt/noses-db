from mysql.connector import (connection)
from mysql.connector import errorcode
import mysql
import csv
import marks
import tags



obsID = 0
sealID = 0
YEAR = 1
DATE = 2
LOC = 3
SEX = 4
AGE = 5
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
COMMENTS = 30

# takes a table name to search, a value, and a column to find it in
# searches table and returns true if found
def canFind(cursor, tableName, value, column):
    check = "SELECT * FROM " + tableName + ";"
    cursor.execute(check)
    remaining_rows = cursor.fetchall()
    
    if any(row[column] == value for row in remaining_rows):
        return True # This is a resight
    return False

def makeConnection():
    try:
        cnx = connection.MySQLConnection(user='kbleich',
                                        password='abc123',
                                        host='ambari-head.csc.calpoly.edu',
                                        database='kbleich')
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        return cnx

def runQuery(cnx, cursor, query):
    try:
        cursor.execute(query)
        cnx.commit()
    except mysql.connector.Error as err:
        print(err)
        exit(1)

def writeObsv(cursor, row, obsID):
    if row[SEX] == "NULL":
        sex = "NULL"
    else:
        sex = "'" + row[SEX] + "'"
    statement = ("INSERT INTO Observations VALUES ("
                + str(obsID) + ", "
                + "'testEmail', "     # email TODO needs to change to something dynamic
                + sex + ", "                # gender
                + "NULL, "                # date
                + row[MOLT] + ", '"                # molt
                + row[COMMENTS].replace("'", "") + "', '"                # comments
                + row[AGE] + "', "                # Age
                + row[YEAR] + ", '"                # year
                + row[LOC][0:3] + "')")              # SLOCode 
    print(statement)
#    cursor.execute(statement)
    try:
        cursor.execute(statement)
    except mysql.connector.Error as err:
        print(err)
        return -5


def swapNulls(row):
    for index in range(len(row)):
        if (row[index] == ""):
            row[index] = "NULL"

def checkMark(cnx, cursor, obsID, markID, csvRow):
    resight = False
    # query marks for this mark
    # if it exists, return 1
    #otherwise, write it to marks and return -1
#    checkMark = "SELECT * FROM Marks;"
#    cursor.execute(checkMark)
#    remaining_rows = cursor.fetchall()
#    
#  #  if any(row[1] == csvRow[MARK] and row[4] == int(csvRow[YEAR]) 
#            #TODO should I check all elements? Raise err when elements don't match on mark 
#    for row in remaining_rows:
#        if (row[1] == csvRow[MARK] and row[4] == int(csvRow[YEAR])):
    if marks.canFindMark(cursor, csvRow[MARK], csvRow[YEAR]):
        markID = marks.getMarkID(cursor, csvRow[MARK], csvRow[YEAR]) #TODO check if this works :/
        observeMarks = ("INSERT INTO ObserveMarks VALUES (" 
                    + str(obsID) + ", " 
                    + str(markID) + ");")
        runQuery(cnx, cursor, observeMarks)
        resight = True
        print("resight mark: " + csvRow[MARK])
    else:
        # before this func call, should I check for Y/N, speed it up?
        marks.pushMark(cnx, cursor, csvRow)
#        statement = ("INSERT INTO Marks VALUES ("
#                + str(markID) + ", '"       # MarkID
#                + csvRow[MARK] + "', '"        # mark
#                + csvRow[MARKPOS] + "', "          # Year
#                + "'2019-01-01', "          # date
#                + csvRow[YEAR] + ");")        # 
#        print(statement)
#        try:
#            cursor.execute(statement)
#            cnx.commit()
#        except mysql.connector.Error as err:
#            print(err)
#            exit(1)
        markID = marks.getMarkID(cursor, csvRow[MARK], csvRow[YEAR])
        observeMarks = ("INSERT INTO ObserveMarks VALUES (" 
                        + str(obsID) + ", " 
                        + str(markID) + ");")
        print(observeMarks)
        runQuery(cnx, cursor, observeMarks)

        if (resight == False): #never seen this mark this year
            return -1
        return 1

def checkTag(cnx, cursor, obsID, csvRow, whichTag):
    resight = False
    if tags.canFindTag(cursor, csvRow[whichTag]):
        observeTags = ("INSERT INTO ObserveTags VALUES (" 
                    + str(0) + ", "
                    + str(obsID) + ", '" 
                    + csvRow[whichTag] + "');")
        runQuery(cnx, cursor, observeTags)
        resight = True
        print("resight tag: " + csvRow[whichTag])
    else:
        # before this func call, should I check for Y/N, speed it up?
        tags.pushTag(cnx, cursor, csvRow, whichTag)
        observeTags = ("INSERT INTO ObserveTags VALUES (" 
                        + str(0) + ", "
                        + str(obsID) + ", '" 
                        + csvRow[whichTag] + "');")
        print(observeTags)
        runQuery(cnx, cursor, observeTags)

        if (resight == False): #never seen this mark this year
            return -1
        return 1

def addSeal(cnx, cursor, obsID, row):
    if(row[SEX] != "NULL"):
        row[SEX] = "'" + row[SEX] + "'"
    statement = ("INSERT INTO Seals VALUES ("
                + str(0) + ", "
                + str(obsID) + ", "
                + row[SEX] + ", "
                + "FALSE);")
    print statement
    runQuery(cnx, cursor, statement)

def main():
    i = 0
    obsID = 0
    sealID = 0
    markID = 0
    cnx = makeConnection()

    filename = raw_input("Give file name: ")

    cursor = cnx.cursor(buffered=True)
    with open(filename) as csvfile:
   # with open('ElephantSealData18-19.csv') as csvfile:
   # with open('dupTags.csv') as csvfile:
   # with open('DupMarks.csv') as csvfile:
#
#        # TODO this needs to be changed to update based on actual Rookery stuff"
#        # I need to know what Beaches hook to which rookeries
#        locFile.write("INSERT INTO Rookery VALUES('PB', 'Red', 'Pietras Blancas');\n")
#
#        # BEGIN READING
        readCSV = csv.reader(csvfile, delimiter=',')
        for row in readCSV:
            if(i == 0 or all(element == "" for element in row)):
                print("do nothing")
                i = 1
            else:
                swapNulls(row)
                MarkFlag = -1
                Tag1Flag = -1
                Tag2Flag = -1
                if(canFind(cursor, "Beach", row[LOC][0:3], 0)):
                    writeObsv(cursor, row, obsID)
                    cnx.commit()
    #                #if you haven't seen the mark yet
                    if (row[MARK] != "NULL"):
                        MarkFlag = checkMark(cnx, cursor, obsID, markID, row)
                        cnx.commit()
                        if(MarkFlag != -1):
                            markID = markID + 1
                        # eventually we'll need to query the database for the most recent one...oh well
                    if(row[TAG1] != "NULL"):
                        Tag1Flag = checkTag(cnx, cursor, obsID, row, TAG1)
                    if(row[TAG2] != "NULL"):
                        Tag2Flag = checkTag(cnx, cursor, obsID, row, TAG2)
    
                    if(MarkFlag == -1 and Tag1Flag == -1 and Tag2Flag == -1):
                        addSeal(cnx, cursor, obsID, row)
                        sealID = sealID + 1

                    obsID = obsID + 1
    
    cursor.close()
    cnx.close()
if __name__=='__main__':
    main()
