import pymysql
import pandas as pd
import json
from app import app
from ETL2 import startUpdate
from db_config import mysql
from flask import jsonify
from flask import flash, request
from flask import g
from werkzeug import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin
CORS(app)

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
            cursor.execute("Update Users Set isAdmin=0 where email=\'" + email + "\';")

            conn.commit()
            cursor.execute("SELECT * from Users Where isAdmin > 0;")

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
            cursor.execute("SELECT * from Users Where isAdmin > 0;")

            rows = cursor.fetchall()
            resp = jsonify(rows)
            return resp
        else:
            return jsonify('no delete')
    except Exception as e:
        return jsonify(1)
    finally:
        cursor.close()
        conn.close()

@app.route('/getseal', methods=['POST', 'GET'])
def get_seal():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'POST':
            _json = request.json
            obj = _json['SealID']

            cursor.execute("SELECT o.* from Observations as o, ObserveSeal as os WHERE o.ObservationID=os.ObservationID and os.SealID=" + str(obj))

            rows = cursor.fetchall()
            resp = jsonify(rows)
            return resp
        else:
            return jsonify("no seal was clicked")
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

@app.route('/adduser', methods=['POST', 'GET'])
def add_user():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'GET':
            cursor.execute("SELECT * from Users Where isAdmin > 0;")
            rows = cursor.fetchall()
            resp = jsonify(rows)
            return resp

        if request.method == 'POST':
            _json = request.json
            print(_json)
            cursor.execute("INSERT INTO Users (LoginID, FullName, isAdmin, Affiliation) values (\'" + _json['loginID'] + "\', \'" + _json['fullname'] + "\', " + _json['isAdmin'] + ", \'" + _json['affiliation'] + "\');")
            cursor.execute("INSERT INTO Observers values (\'" + _json['email'] + "\', '', '', \'" + _json['loginID'] + "\');")
            cursor.execute("UPDATE Users SET email = \'" + _json['email'] + "\' WHERE LoginID = \'" + _json['loginID'] + "\';")
            
            conn.commit()
                
            cursor.execute("SELECT * from Users Where isAdmin > 0;")

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

@app.route('/addseals', methods=['POST', 'GET'])
def add_seals():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'POST':

            #print("yooooo")
            _json = request.json
            # print(_json)
            startUpdate(json.dumps(_json))

            return jsonify('data sent to upload function')
        else:
            return jsonify('error')
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()

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

@app.route('/allseals', methods=['GET'])
def getAllSeals():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        statement = ('SELECT '
                    'O.ObservationID '
                    ', O.SealID '
                    ', O.FieldLeader '
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
                    ', O.AuxillaryGirth '
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
                    ' '
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
                    ' '
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
                    ' '
                    ' '
                    ' '
                    ' '
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
                    ' '
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
                    ' '
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
                    'AND age.SealID = AllMarks.SealID ) seals '
                    '-- ) seals  '
                    'WHERE '
                    'seals.SealID = sealcounts.sealID AND sealcounts.count = 1) S, '
                    ' '
                    '(SELECT main.ObservationID '
                    ', main.SealID '
                    ', main.FieldLeader '
                    ', main.Year '
                    ', main.date '
                    ', main.SLOCode '
                    ', main.sex '
                    ', main.AgeClass '
                    '-- main.isPup '
                    ', main.moltPercent '
                    ', main.Year Season '
                    ', Measurements.StandardLength '
                    ', Measurements.CurvilinearLength '
                    ', Measurements.AuxillaryGirth '
                    ', Measurements.AnimalMass '
                    ', Measurements.TotalMass '
                    '-- Measurements.Tare '
                    '-- Measuremenets.MassTare '
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
                    'O.SealID = S.SealID ')
        print(statement)
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


@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404
    return resp

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


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000)




