from flask import Flask, jsonify
import argparse
import requests


app = Flask(__name__)

@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route("/static/<path>")
def staticfiles(path):
    return app.send_static_file(path)

@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("images/favicon.ico")

@app.route("/update")
def update():
    # TODO factor these into a function
    r = requests.post("http://%s" % args.host, auth=(args.user, args.passwd),
        json={"method": "getinfo",
              "params": [],
              "id": 1})
    info = r.json()

    r = requests.post("http://%s" % args.host, auth=(args.user, args.passwd),
        json={"method": "list",
              "params": ["rsa"],
              "id": 1})
    rsa = r.json()

    r = requests.post("http://%s" % args.host, auth=(args.user, args.passwd),
        json={"method": "listtransactions",
              "params": [],
              "id": 1})
    transactions = r.json()

    r = requests.post("http://%s" % args.host, auth=(args.user, args.passwd),
        json={"method": "getpeerinfo",
              "params": [],
              "id": 1})
    peerinfo = r.json()

    r = requests.post("http://%s" % args.host, auth=(args.user, args.passwd),
        json={"method": "listaddressgroupings",
              "params": [],
              "id": 1})
    addresses = r.json()

    r = requests.post("http://%s" % args.host, auth=(args.user, args.passwd),
        json={"method": "execute",
              "params": ["beaconstatus"],
              "id": 1})
    beacon = r.json()

    r = requests.post("http://%s" % args.host, auth=(args.user, args.passwd),
        json={"method": "list",
              "params": ["cpids"],
              "id": 1})
    projects = r.json()

    return jsonify(info=info, rsa=rsa, transactions=transactions,
                   peerinfo=peerinfo, addresses=addresses, beacon=beacon,
                   projects=projects)

if __name__ == "__main__":
    argparser = argparse.ArgumentParser(description="Development server")
    argparser.add_argument("-p", "--port", type=int, default=8000, help="Port for HTTP server (default=%d)." % 8000)
    argparser.add_argument("-l", "--listen", type=str, default="127.0.0.1", help="Listen interface for HTTP server (default=%s)." % "127.0.0.1")
    argparser.add_argument("-d", '--debug', action="store_true", default=False, help="Debug mode.")
    argparser.add_argument("-g", "--host", type=str, default="localhost:15715", help="gridcoind RPC host:port (default=%s)." % "localhost:15715")
    argparser.add_argument("-u", "--user", type=str, required=True, help="gridcoind RPC auth username.")
    argparser.add_argument("-a", "--passwd", type=str, required=True, help="gridcoind RPC auth passwd.")
    args = argparser.parse_args()

    app.config["JSONIFY_PRETTYPRINT_REGULAR"] = args.debug
    print("Starting server on port %s with debug=%s" % (args.port, args.debug))
    app.run(host=args.listen, port=args.port, debug=args.debug)