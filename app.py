from flask import Flask, render_template


app=Flask(__name__)



@app.route('/')
def starting():
	# return "Welcome to my website"
	return render_template("index.html")

@app.route("/handTracking")
def torch():
	return render_template("handTracking.html")




if __name__ == "__main__":
	app.run(debug=True, port=8080)