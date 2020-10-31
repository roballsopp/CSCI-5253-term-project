import os
import logging
import psycopg2
from psycopg2.extras import execute_values

logger = logging.getLogger(__name__)

PG_DATABASE = os.getenv('PG_DATABASE')
PG_USER = os.getenv('PG_USER')
PG_PWD = os.getenv('PG_PWD')
PG_HOST = os.getenv('PG_HOST')


def parse_cursor_results(cur):
	results = {
		'description': cur.description,
		'rowcount': cur.rowcount,
		'query': cur.query,
		'statusmessage': cur.statusmessage
	}

	if cur.description:
		# this slightly ugly comprehension takes the raw output from the connector and turns it into a more usable list.
		#   if the db table has fields `a`, `b`, and `c`, this outputs a list of dicts like [{ 'a': val, 'b': val, 'c':val }, { ... }, ...]
		results['rows'] = [
			{cur.description[i].name: rowData[i] for i in range(len(cur.description))}
			for rowData in cur.fetchall()
		]

	return results


class Connection:
	def __init__(self):
		logger.info(f'Connecting to {PG_DATABASE} db at {PG_HOST}...')
		self._connection = psycopg2.connect(database=PG_DATABASE, user=PG_USER, password=PG_PWD, host=PG_HOST, port="5432")
		logger.info('Connected.')

	def __enter__(self):
		self._connection.__enter__()
		return self

	def __exit__(self, exc_type, value, traceback):
		self._connection.__exit__(exc_type, value, traceback)

	def find_job(self, job_id):
		with self._connection.cursor() as cur:
			cur.execute('SELECT * FROM processing_jobs WHERE id = %(job_id)s', {'job_id': job_id})
			return parse_cursor_results(cur)

	def begin_processing(self, job_id):
		with self._connection.cursor() as cur:
			cur.execute("UPDATE processing_jobs SET state = 'running' WHERE id = %(job_id)s AND state = 'queued'",
									{'job_id': job_id})
			return parse_cursor_results(cur)

	def fail_processing(self, job_id):
		with self._connection.cursor() as cur:
			cur.execute("UPDATE processing_jobs SET state = 'error' WHERE id = %(job_id)s AND state = 'running'",
									{'job_id': job_id})
			return parse_cursor_results(cur)

	def finish_processing(self, job_id, transients):
		formatted = [(job_id, t['sample'], t['time']) for t in transients]
		with self._connection.cursor() as cur:
			execute_values(cur, "INSERT INTO transients (job_id, sample, time) VALUES %s", formatted)
			cur.execute("UPDATE processing_jobs SET state = 'success' WHERE id = %(job_id)s AND state = 'running'",
									{'job_id': job_id})
			return parse_cursor_results(cur)
