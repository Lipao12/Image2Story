#!/bin/bash
gunicorn --workers 4 --bind 0.0.0.0:10000 server.py:app