import argparse
import contextlib
import http.server
import os
import socket
import socketserver
import sys
import threading
import time
import webbrowser
from pathlib import Path


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
	daemon_threads = True


def find_free_port(preferred: int) -> int:
	with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
		sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
		try:
			sock.bind(("127.0.0.1", preferred))
			return preferred
		except OSError:
			pass
		# Ask OS for a free port
		sock.bind(("127.0.0.1", 0))
		return sock.getsockname()[1]


def run_server(port: int) -> ThreadingHTTPServer:
	Handler = http.server.SimpleHTTPRequestHandler
	server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
	return server


def main() -> None:
	parser = argparse.ArgumentParser(description="Serve the portfolio locally")
	parser.add_argument("--port", "-p", type=int, default=8000, help="Port to run on (default: 8000)")
	parser.add_argument("--no-open", action="store_true", help="Do not open the browser automatically")
	args = parser.parse_args()

	# Serve from the directory containing this script
	project_root = Path(__file__).parent.resolve()
	os.chdir(project_root)

	port = find_free_port(args.port)
	server = run_server(port)

	def serve():
		with contextlib.suppress(KeyboardInterrupt):
			server.serve_forever(poll_interval=0.2)

	thread = threading.Thread(target=serve, daemon=True)
	thread.start()

	url = f"http://127.0.0.1:{port}/index.html"
	print("\nServing portfolio locally")
	print(f"Root: {project_root}")
	print(f"URL:   {url}")
	print("Press Ctrl+C to stop.\n")

	if not args.no_open:
		# Small delay to ensure server is ready
		time.sleep(0.3)
		with contextlib.suppress(Exception):
			webbrowser.open(url)

	try:
		while thread.is_alive():
			time.sleep(0.5)
	except KeyboardInterrupt:
		pass
	finally:
		server.shutdown()
		server.server_close()


if __name__ == "__main__":
	main() 