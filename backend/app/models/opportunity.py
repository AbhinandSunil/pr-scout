from sqlalchemy import Column, Integer, String, Text

from app.database.connection import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    organization = Column(String, nullable=True)
    location = Column(String, nullable=True)
    topics = Column(Text, nullable=False)
    url = Column(String, nullable=True)
    date = Column(String, nullable=True)