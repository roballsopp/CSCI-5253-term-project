from google.cloud import storage
import os

AUDIO_BUCKET = os.getenv('AUDIO_BUCKET')

client = storage.Client()
bucket = client.bucket(AUDIO_BUCKET)


def get_blob(blob_key):
	blob = bucket.get_blob(blob_key)
	return blob.download_as_bytes()