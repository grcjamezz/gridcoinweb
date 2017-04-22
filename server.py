from flask import Flask, jsonify
import argparse
import logging
import requests
import sys
import traceback

import applogging


class Config(object):
    pass


class App(Flask):
    def __init__(self, name):
        super(App, self).__init__(name)
        self.log = logging.getLogger(__name__)
        self.args = None

    def validate_conn(self):
        s = requests.Session()
        info = self.fetch_json(s, method="getinfo")
        if info is not None and info["status"] is not None and info["status"] == 200:
            self.log.info("Good connection to gridcoin wallet")
            return True

        self.log.error(info)
        self.log.error("Unable to communicate with gridcoin wallet.")
        return False

    def set_config(self, args):
        self.args = Config()
        self.args.host = args.host
        self.args.user = args.user
        self.args.passwd = args.passwd

    def fetch_json(self, session, method, params=None, rpcid=1):
        json = None
        raw = None
        auth = None
        status = 0
        if params is None:
            rpcparams = []
        else:
            rpcparams = params

        if self.args.user and self.args.passwd:
            auth = (self.args.user, self.args.passwd)

        try:
            result = session.post("http://%s" % self.args.host, auth=auth,
                              json={"method": method,
                                    "params": rpcparams,
                                    "id": rpcid})
            status = result.status_code
            if status == 200:
                json = result.json()
            else:
                raw = result.text
                self.log.error("Error: %s(%s) returned %d. Output:%s" %
                      (method, ",".join(rpcparams), status, raw))
        except Exception as e:
            raw = traceback.format_exc()
            self.log.error("Error: %s(%s) Exception:%s" % (method, ",".join(rpcparams), raw))

        return {"method": "%s(%s)" % (method, ",".join(rpcparams)),
                "status": status,
                "json": json,
                "raw": raw
               }

app = App(__name__)

@app.before_first_request
def configure():
    app.log.error("YO")
    if app.args is None:
        app.args = Config()
        import appconfig
        app.log.info(appconfig.args)
        app.args.host = appconfig.args["host"]
        app.args.user = appconfig.args["user"]
        app.args.passwd = appconfig.args["passwd"]
        app.validate_conn()

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
    info = app.fetch_json(s, method="getinfo")
    rsa = app.fetch_json(s, method="list", params=["rsa"])
    transactions = app.fetch_json(s, method="listtransactions")
    peerinfo = app.fetch_json(s, method="getpeerinfo")
    addresses = app.fetch_json(s, method="listaddressgroupings")
    beacon = app.fetch_json(s, method="execute", params=["beaconstatus"])
    projects = app.fetch_json(s, method="list", params=["cpids"])

    return jsonify(info=info, rsa=rsa, transactions=transactions,
                   peerinfo=peerinfo, addresses=addresses, beacon=beacon,
                   projects=projects)

if __name__ == "__main__":
    argparser = argparse.ArgumentParser(description="Development server")
    argparser.add_argument("-p", "--port", type=int, default=8000, help="Port for HTTP server (default=%d)." % 8000)
    argparser.add_argument("-l", "--listen", type=str, default="127.0.0.1", help="Listen interface for HTTP server (default=%s)." % "127.0.0.1")
    argparser.add_argument("-d", '--debug', action="store_true", default=False, help="Debug mode.")
    argparser.add_argument("-g", "--host", type=str, default="localhost:15715", help="gridcoind RPC host:port (default=%s)." % "localhost:15715")
    argparser.add_argument("-u", "--user", type=str, help="gridcoind RPC auth username.")
    argparser.add_argument("-a", "--passwd", type=str, help="gridcoind RPC auth passwd.")
    args = argparser.parse_args()

    app.config["JSONIFY_PRETTYPRINT_REGULAR"] = args.debug
    app.log.info("Starting server on port %s with debug=%s" % (args.port, args.debug))
    app.set_config(args)
    if app.validate_conn() is False:
        sys.exit(1)
    app.run(host=args.listen, port=args.port, debug=args.debug)
