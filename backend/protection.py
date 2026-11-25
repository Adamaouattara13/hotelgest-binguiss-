import socket
from flask import request, abort
from app import app

# Appareils autorisés à utiliser la caisse (ce PC uniquement).
# Pour une tablette de la caisse, ajoute son IP, par exemple "192.168.1.20".
IP_AUTORISEES = {"127.0.0.1", "::1"}
try:
    IP_AUTORISEES.update(socket.gethostbyname_ex(socket.gethostname())[2])
except Exception:
    pass

PREFIXES = ("/caisse", "/api/caisse", "/api/auth", "/css/caisse.", "/js/caisse.")


@app.before_request
def proteger_caisse():
    if request.path.startswith(PREFIXES):
        if request.remote_addr not in IP_AUTORISEES:
            abort(404)