from sqlalchemy import Column, Integer, String, Text

from app.database.connection import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    target_audience = Column(Text, nullable=False)
    target_location = Column(String, nullable=True)
    key_topics = Column(Text, nullable=False)
    campaign_goal = Column(Text, nullable=False)