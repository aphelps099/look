import http.server
import socketserver
import os

os.chdir("/Users/aaron/Desktop/look/new-site-look")
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8090), handler) as httpd:
    httpd.serve_forever()
