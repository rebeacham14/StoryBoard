from dataclasses import dataclass
from typing import List

@dataclass
class Character:
    name: str
    role: str
    traits: List[str]
    motivation: str
    arc: str
    symbolism: str

@dataclass
class Item:
    name: str
    description: str
    thematic_purpose: str
    gameplay_utility: str


@dataclass
class Location:
    name: str
    description: str
    thematic_purpose: str
    gameplay_importance: str

@dataclass
class Event:
    title: str
    time_order: int
    involved_characters: List[str]
    location: str
    conflict: str
    outcome: str
    theme: str
