from flask import Flask, jsonify, request, send_from_directory

import db_models as models

app = Flask(__name__)

@app.route('/')
@app.route('/<path:path>')
def serve_app(path=None):
  if models.is_empty():
    models.reset()
  if path is None or path == "":
    path = "index.html"
  return send_from_directory('/app/dist', path)

@app.route('/app/contacts')
def get_contacts():
  return jsonify(models.get_contacts())

@app.route('/app/contacts', methods=['POST'])
def new_contact():
  return jsonify(models.new_contact())

@app.route('/app/contacts/<int:contact_id>')
def get_contact(contact_id):
  return jsonify(models.get_contact(contact_id))

@app.route('/app/contacts/<int:contact_id>', methods=['POST'])
def save_contact(contact_id):
  return jsonify(models.save_contact(contact_id, request.json))

@app.route('/app/contacts/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
  models.delete_contact(contact_id)
  return jsonify("OK")

@app.after_request
def add_header(r):
  r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
  r.headers["Pragma"] = "no-cache"
  r.headers["Expires"] = "0"
  r.headers['Cache-Control'] = 'public, max-age=0'
  return r

if __name__ == "__main__":
  app.run()
