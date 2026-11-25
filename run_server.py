"""
Lanceur du serveur Le Binguiss
"""
import sys
import os
import socket

# Ajout du dossier backend au chemin
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, backend_dir)

from app import app, CODE_CAISSE_SECRET
import protection  # bloque la caisse pour les autres appareils


def ip_locale():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except Exception:
        return "127.0.0.1"
    finally:
        s.close()


if __name__ == "__main__":
    ip = ip_locale()
    print("=" * 60)
    print("RESTAURANT & HOTEL LE BINGUISS - GRAND-BASSAM")
    print("=" * 60)
    print("Site Client (ce PC)               : http://127.0.0.1:5000/")
    print(f"Site Client (autres appareils)    : http://{ip}:5000/")
    print("Espace Caisse (ce PC seulement)   : http://127.0.0.1:5000/caisse")
    print(f"Code d'acces Caisse               : {CODE_CAISSE_SECRET}")
    print("=" * 60)
    print("Appuyez sur CTRL+C pour arreter le serveur.")
    app.run(host="0.0.0.0", port=5000, debug=False)