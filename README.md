gridcoinweb
===========
**gridcoinweb** is a monitor application for monitoring your
[gridcoin wallet](https://gridcoin.us). **gridcoinweb** is written in Python
and Javascript using flask, bootstrap and jquery.

Status
======
Still very much a work in progress. Keep an eye on the issues list for the
project, and please feel free to contribute. The data displayed in this app
is not at parity with the gridcoin UI - pull requests are appreciated and
accepted! There's a lot of data available in the
[RPC API](http://wiki.gridcoin.us/RPC_commands).

Dependencies
============
**gridcoinweb** has been developed and tested on Debian Linux, but should
work anywhere the necessary Python packages are available. It will work
with either Python 3 or 2.7.

**gridcoinweb** requires the following dependencies:

* flask - (python3-flask or python-flask Debian package)
* requests - (python3-requests or python-requests Debian package)

Bundled version of [bootstrap](http://getbootstrap.com) and
[jquery](http://jquery.com) are included.

Usage
=====

As a flask application, **gridcoinweb** should really be run with a WSGI
container such as gunicorn, however for development/testing purposes you can
use the built-in flask development server via the "run" script provided
(edit to use python 2.7 instead of python 3 if required):

```
usage: server.py [-h] [-p PORT] [-l LISTEN] [-d] [-g HOST] -u USER
                 -a PASSWD

Development server

optional arguments:
  -h, --help            show this help message and exit
  -p PORT, --port PORT  Port for HTTP server (default=8000).
  -l LISTEN, --listen LISTEN
                        Listen interface for HTTP server (default=127.0.0.1).
  -d, --debug           Debug mode.
  -g HOST, --host HOST  gridcoind RPC host:port (default=localhost:15715).
  -u USER, --user USER  gridcoind RPC auth username.
  -a PASSWD, --passwd PASSWD
                        gridcoind RPC auth passwd.
```

Example:

Start the development server:
```
$ ./run -u rpcuser -a rpcpassword
Starting server on port 8000 with debug=False
 * Running on http://127.0.0.1:8000/ (Press CTRL+C to quit)
```

Then, connect with your browser to http://localhost:8000.

Security
========

**gridcoinweb** should be run on the host where your gridcoin wallet is running.
Running it across the network poses a security risk - please don't do this!

The data passed between your browser and **gridcoinweb** is not secured and
contains sensitive information that is sent in plain text. This is a security
risk and could result in theft of your data and/or wallet. Don't run this on
an open network out of your control, and for the love of Pete don't run this
across the public internet.

License
=======

This project is licensed under a GNU General Public License GPLv3 license.
See the LICENSE file in the source repository and/or distribution.

This project includes the following files which are the properties of their
respective owners:

* js/bootstrap.min.js - [bootstrap](http://getbootstrap.com)
* css/bootstrap.min.css - [bootstrap](http://getbootstrap.com)
* js/jquery.min.js - [jquery](https://jquery.com)

This software is provided free and with no warrantee - users accept all risk
of using it.
