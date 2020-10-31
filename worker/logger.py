import logging
import json

logging.basicConfig(level=logging.INFO)


def info(msg):
	logging.info(json.dumps({
		'severity': 'info',
		'message': msg
	}, separators=(',', ':')))


def warn(msg):
	logging.info(json.dumps({
		'severity': 'warn',
		'message': msg
	}, separators=(',', ':')))


def error(msg):
	logging.info(json.dumps({
		'severity': 'error',
		'message': msg
	}, separators=(',', ':')))
