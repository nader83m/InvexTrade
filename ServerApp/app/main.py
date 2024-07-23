from dotenv import load_dotenv
load_dotenv()



from initialize.application import Application
application = Application()
app = application.create_app()
if __name__ == "__main__":
    app.run(host='193.111.77.163', port='8000')
