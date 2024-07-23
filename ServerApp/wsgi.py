from app.initialize.application import Application

application = Application()
app = application.create_app()
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)
