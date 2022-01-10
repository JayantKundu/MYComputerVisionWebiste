from flask import Flask, render_template


app=Flask(__name__)



@app.route('/')
def starting():
	# return "Welcome to my website"
	return render_template("index.html")

@app.route("/handTracking")
def torch():
	return render_template("handTracking.html")

@app.route("/handTracking1")
def torch1():
	return render_template("handTracking1.html")

@app.route("/handTracking2")
def torch2():
	return render_template("handTracking2.html")




if __name__ == "__main__":
	app.run(port=8080)