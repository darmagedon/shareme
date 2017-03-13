#!/usr/bin/python
import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/home/lftechnology/domains/shareme.lftechnology.com/public_html/")

from app.routes import app as application

