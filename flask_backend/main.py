import pymysql
import pandas as pd
from app import app
from db_config import mysql
from flask import jsonify
from flask import flash, request
from werkzeug import generate_password_hash, check_password_hash
from flask_cors import CORS, cross_origin
CORS(app)



@app.route('/delete', methods=['POST', 'GET'])
def delete_user():
    conn = mysql.connect()
    cursor = cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        if request.method == 'POST':
            print("in delete")
            _json = request.json
            obs = _json['obsID']
            tag1 = _json['tag1']
            mark = _json['Mark']
            print(_json)
            print(obs)
            print(tag1)
            print(mark)

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


@app.route('/users')
def users():
    try:
        conn = mysql.connect()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT S.*, Mark.Mark, Mark.markDate, Mark.Year, Tag1.TagNumber as TagNumber1, Tag2.TagNumber as TagNumber2, Mark.MarkID FROM Seals S LEFT OUTER JOIN (SELECT Marks.MarkSeal SealID, Marks.Mark, Marks.MarkDate, Marks.Year, Marks.MarkID FROM Marks) Mark ON S.SealID = Mark.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag1 ON S.SealID = Tag1.SealID LEFT OUTER JOIN (SELECT Tags.TagSeal SealID, Tags.TagNumber FROM Tags) Tag2 ON S.SealID = Tag2.SealID AND Tag1.TagNumber < Tag2.TagNumber AND Tag2.TagNumber > Tag1.TagNumber")
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


@app.route('/user/')
def user(id):
    try:
        #conn = mysql.connect()
        #cursor = conn.cursor(pymysql.cursors.DictCursor)
        #cursor.execute("SELECT * FROM tbl_user WHERE user_id=%s", id)
        row = {"name": "John", "age": 30, "car": null}
        resp = jsonify(row)
        resp.status_code = 200
        return resp
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        conn.close()


@app.route('/update', methods=['POST'])
def update_user():
    try:
        _json = request.json
        _id = _json['id']
        _name = _json['name']
        _email = _json['email']
        _password = _json['pwd']
        # validate the received values
        if _name and _email and _password and _id and request.method == 'POST':
            # do not save password as a plain text
            _hashed_password = generate_password_hash(_password)
            # save edits
            sql = "UPDATE tbl_user SET user_name=%s, user_email=%s, user_password=%s WHERE user_id=%s"
            data = (_name, _email, _hashed_password, _id,)
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(sql, data)
            conn.commit()
            resp = jsonify('User updated successfully!')
            resp.status_code = 200
            return resp
        else:
            return not_found()
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


if __name__ == "__main__":
    app.run()
