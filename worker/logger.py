import logging

logging.basicConfig(format='{"severity":"%(levelname)s","message":"%(message)s"}', level=logging.INFO)


def info(msg):
	logging.info(msg)


def warn(msg):
	logging.info(msg)


def error(msg):
	logging.info(msg)
