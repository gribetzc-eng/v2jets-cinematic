#!/usr/bin/env python3
"""Static server with HTTP Range support — do NOT edit per project.
Range matters when scrubbing <video>; the frame-sequence engine doesn't
strictly need it, but keep it for parity / future use. Usage: python3 serve.py [PORT]"""
import http.server, os, re, socketserver, sys

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8911


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().do_GET()  # directories / index.html
        ctype = self.guess_type(path)
        size = os.path.getsize(path)
        rng = self.headers.get("Range")
        try:
            if rng:
                m = re.match(r"bytes=(\d+)-(\d*)", rng)
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else size - 1
                end = min(end, size - 1)
                if start > end or start >= size:
                    self.send_response(416)
                    self.send_header("Content-Range", f"bytes */{size}")
                    self.end_headers()
                    return
                length = end - start + 1
                self.send_response(206)
                self.send_header("Content-Type", ctype)
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                with open(path, "rb") as f:
                    f.seek(start)
                    self.wfile.write(f.read(length))
            else:
                self.send_response(200)
                self.send_header("Content-Type", ctype)
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Length", str(size))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                with open(path, "rb") as f:
                    self.wfile.write(f.read())
        except (BrokenPipeError, ConnectionResetError):
            pass  # browser aborted a range fetch — normal during scrubbing


class TCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


with TCPServer(("", PORT), Handler) as httpd:
    print(f"serving {DIRECTORY} with Range support on :{PORT}")
    httpd.serve_forever()
