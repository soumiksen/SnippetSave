from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/snippets', methods=['GET'])
def get_snippets():
    return jsonify({'snippets': []}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
