from flask import Flask, request, jsonify
from flask_cors import CORS
from sympy import factorint

app = Flask(__name__)
CORS(app)

# Convert number to base-g
def to_base_g(num, base):
    if num == 0:
        return "0"

    digits = ""
    while num > 0:
        digits = str(num % base) + digits
        num //= base
    return digits


# Generate generalized Mersenne numbers
def get_mersenne_number(g, max_n, base):
    results = []

    for n in range(1, max_n + 1):
        M_n = (g**n - 1) // (g - 1)

        factors = factorint(M_n)

        results.append({
            "n": n,
            "value": M_n,
            "base_value": to_base_g(M_n, base),
            "factors": [
                {
                    "prime": p,
                    "exp": e,
                    "prime_power": f"{p}^{e}",  
                    "base_value": to_base_g(p**e, base)
                }
                for p, e in factors.items()
            ]
        })
    return results


# API endpoint (React will call this)
@app.route("/api/mersenne", methods=["POST"])
def mersenne():
    try:
        print("🔥 REQUEST HIT")

        data = request.get_json()
        print("DATA:", data)

        g = int(data["g"])
        max_n = int(data["max"])
        base = int(data["base"])

        # safety check
        if g <= 1:
            return jsonify({"error": "g must be > 1"}), 400

        result = get_mersenne_number(g, max_n, base)

        print("🔥 SUCCESS")
        return jsonify(result)

    except Exception as e:
        import traceback

        print("\n🔥🔥 FULL PYTHON ERROR 🔥🔥")
        print(traceback.format_exc())   # THIS is what we need

        return jsonify({
            "error": str(e),
            "type": type(e).__name__
        }), 500


# Run server
import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)