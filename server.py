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
    s = requests.Session()
    info = fetch_json(s, method="getinfo")
    rsa = fetch_json(s, method="list", params=["rsa"])
    transactions = fetch_json(s, method="listtransactions")
    peerinfo = fetch_json(s, method="getpeerinfo")
    addresses = fetch_json(s, method="listaddressgroupings")
    beacon = fetch_json(s, method="execute", params=["beaconstatus"])
    projects = fetch_json(s, method="list", params=["cpids"])

    return jsonify(info=info, rsa=rsa, transactions=transactions,
                   peerinfo=peerinfo, addresses=addresses, beacon=beacon,
                   projects=projects)


def fetch_json(session, method, params=[], id=1):
    auth = None
    if args.user and args.passwd:
        auth = (args.user, args.passwd)

    r = session.post("http://%s" % args.host, auth=auth,
                     json={"method": method,
                           "params": params,
                           "id": id})
    # TODO: Encapsulate happy path and error into a single object model
    if r.status_code == 200:
        return r.json()

    return {"gridcoinweb": {"status": r.status_code,
                            "response": r.text}
           }


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