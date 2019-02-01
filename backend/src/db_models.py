from sqlalchemy import create_engine, Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker

# Il motore permette a SQLAlchemy di dialogare con il DataBase
# In questo caso, un database 'sqlite' immagazzinato nel file
# /app/.data/database.db
engine = create_engine('sqlite:////app/.data/database.db', echo=True)
Session = sessionmaker(bind=engine)

# Tutte le classi che utilizzano SQLAlchemy ereditano dalla classe
# Base, generata dalla funzione declarative_base
Base = declarative_base()

# La classe Contact descrive un contatto all'interno della rubrica
class Contact(Base):
  # La tabella su cui verra' memorizzato il contatto
  __tablename__ = 'contacts'
  
  # I campi della tabella
  id = Column(Integer, primary_key=True)
  name = Column(String)
  
  def __repr__(self):
    return "<Contact(name='%s')>" % self.name
  
  def as_dict(self):
    return {
      c.name: getattr(self, c.name) for c in self.__table__.columns
    }

class Voice(Base):
  __tablename__ = "voices"
  
  id = Column(Integer, primary_key=True)
  type = Column(String, nullable=False)
  value = Column(String, nullable=False)
  contact_id = Column(Integer, ForeignKey("contacts.id"))
  
  contact = relationship("Contact", back_populates="voices")
  
  def __repr__(self):
    return "<Voice(type='%s', value='%s')>" % (self.type, self.value)
  
  def as_dict(self):
    return {
      c.name: getattr(self, c.name) for c in self.__table__.columns
    }
  
Contact.voices = relationship(
  "Voice",
  order_by=Voice.type,
  back_populates="contact",
  cascade="all, delete, delete-orphan"
)
  
# always return true, reset won't do any bad
def is_empty():
  return True

def reset():
  Base.metadata.create_all(engine)

def get_contacts():
  session = Session()
  contacts = [c.as_dict() for c in session.query(Contact)]
  return contacts

def get_contact(contact_id):
  session = Session()
  contact = session.query(Contact).filter_by(id=contact_id).first()
  c = contact.as_dict()
  c["voices"] = [v.as_dict() for v in contact.voices]
  return c

def save_contact(contact_id, updates):
  session = Session()
  contact = session.query(Contact).filter_by(id=contact_id).first()
  contact.name = updates["name"]
  contact.voices = [Voice(type=v["type"], value=v["value"]) for v in updates["voices"]]
  session.commit()
  return contact.as_dict()

def new_contact():
  session = Session()
  contact = Contact(name="Unnamed")
  session.add(contact)
  session.commit()
  return contact.as_dict()

def delete_contact(contact_id):
  session = Session()
  contact = session.query(Contact).filter_by(id=contact_id).first()
  session.delete(contact)
  session.commit()
