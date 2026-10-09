import json
import sqlite3

import pytest
from fastapi.testclient import TestClient

import app as website


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setenv('DATABASE_PATH', str(tmp_path / 'test_contacts.db'))
    website._ATTEMPTS.clear()
    with TestClient(website.app) as browser:
        yield browser


def test_homepage(client):
    resp = client.get('/')
    assert resp.status_code == 200
    assert 'Il futuro' in resp.text
    assert "default-src 'self'" in resp.headers['content-security-policy']


def test_projects(client):
    resp = client.get('/api/projects')
    assert resp.status_code == 200
    assert len(resp.json()) == 3
    assert resp.json()[0]['category'] == 'ai'


def test_contact_valid(client, tmp_path):
    payload = {'name':'Mario Rossi','email':'mario@example.com','topic':'Collaborazione',
               'message':'Vorrei discutere con te un progetto web interessante.',
               'consent': True, 'website': ''}
    resp = client.post('/api/contact', json=payload)
    assert resp.status_code == 201
    with sqlite3.connect(tmp_path / 'test_contacts.db') as db:
        assert db.execute('SELECT COUNT(*) FROM messages').fetchone()[0] == 1


def test_contact_needs_consent(client):
    payload = {'name':'Mario Rossi','email':'mario@example.com','topic':'Collaborazione',
               'message':'Vorrei discutere con te un progetto web interessante.',
               'consent': False}
    assert client.post('/api/contact', json=payload).status_code == 422


def test_contact_rate_limit(client):
    payload = {'name':'Mario Rossi','email':'mario@example.com','topic':'Collaborazione',
               'message':'Vorrei discutere con te un progetto web interessante.',
               'consent': True}
    for _ in range(5):
        assert client.post('/api/contact', json=payload).status_code == 201
    assert client.post('/api/contact', json=payload).status_code == 429


def test_bot_honeypot_does_not_store(client, tmp_path):
    payload = {'name':'Mario Rossi','email':'mario@example.com','topic':'Collaborazione',
               'message':'Vorrei discutere con te un progetto web interessante.',
               'consent': True, 'website':'spam.example'}
    assert client.post('/api/contact', json=payload).status_code == 201
    with sqlite3.connect(tmp_path / 'test_contacts.db') as db:
        assert db.execute('SELECT COUNT(*) FROM messages').fetchone()[0] == 0
