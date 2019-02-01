CONTACTS = []
NEXT_ID = 0

def is_empty():
  return NEXT_ID == 0

def reset():
  global CONTACTS, NEXT_ID
  CONTACTS = [{
    "id": 1,
    "name": "Emanuele",
    "voices": []
  }, {
    "id": 2,
    "name": "Alessandro",
    "voices": []
  }]
  NEXT_ID = 3

def get_contacts():
  return sorted(CONTACTS, key=lambda c: c["name"])

def get_contact(id):
  [contact] = (c for c in CONTACTS if c["id"] == id)
  return contact

def save_contact(id, updates):
  contact = get_contact(id)
  contact["name"] = updates["name"]
  contact["voices"] = updates["voices"]
  return contact

def new_contact():
  global NEXT_ID
  contact = {
    "id": NEXT_ID,
    "name": "Unnamed",
    "voices": []
  }
  CONTACTS.append(contact)
  NEXT_ID += 1
  return contact

def delete_contact(id):
  [index] = (i for i, c in enumerate(CONTACTS) if c["id"] == id)
  CONTACTS.pop(index)
