from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess
import sys
import textwrap


def getWaveCode(code):
  return textwrap.dedent(
    '''\
from h2o_wave import site, ui

page = site['/demo']

{code}

page.save()
    '''.format(code=code))


class MyServer(BaseHTTPRequestHandler):

  def do_POST(self):
    content_length = int(self.headers['Content-Length'])
    post_data = self.rfile.read(content_length).decode('utf-8')
    print(post_data)
    subprocess.run([sys.executable, '-c', getWaveCode(post_data)])
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.end_headers()

def run():
  webServer = HTTPServer(('localhost', 2000), MyServer)
  print('webserver started')

  try:
    webServer.serve_forever()
  except KeyboardInterrupt:
    pass

  webServer.server_close()
  print('server closed')

run()