from flask import Flask, render_template, request, json
import wynn

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/init_bot", methods=["GET"])
def init_bot():
    global bot
    bot = wynn.CreateWynn()
    return json.dumps({'status':'OK'})
    

@app.route("/listen", methods=["GET"])
def listen():
    response_str = bot.listen()
    return json.dumps({'status':'OK', 'response': response_str})

@app.route("/reply", methods=["GET"])
def reply():
    s = bot.reply()
    return json.dumps({'status':'OK', 'response':s})

if __name__ == "__main__":
    app.run()