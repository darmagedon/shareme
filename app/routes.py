from flask import Flask, render_template, request
import requests
import facebook
app = Flask(__name__)
version='2.2'


def get_image(image_url):
    image_url = requests.get(image_url)
    image_file = open('static/images/image'+str(time.time()), 'w')
    image_file.write(image_url.content)

def post_image(access_token, version):
    graph = facebook.GraphAPI(access_token=access_token, version=version)
    graph.put_photo(image=open('/home/lftechnology/domains/shareme.lftechnology.com/shareme/app/static/image/football-score-clipart-1.jpg', 'rb'), message='Look at this cool photo!')

@app.route('/')
def index():
    return render_template('photo.html')

@app.route('/photo')
def post_page():
#    access_token = 'EAACuoLleKugBAHs2ZBLdPW2ZCFQ7LdhIqIzSAxJTI97FcSahyyo0ItOs7SpK1LNsaiJsULL3hNVJ3VJuyVomNAD3ACihxOZC2476FUJNtFg9vxEJJgYbLgZAhZAzUTNWHUdau63VxYla2YZCe2z0mmpAaIeIhz6HXhL1OARwQT7GK6k1xSem5Y'
    access_token = 'EAAKkjCzmq2QBAK6C5WmbgdxZCRkulgf8dowT5HuzrwMS0z1ZCtOiKZACsNLLOt8mEO0kgRd7JFVBALynLCZAXywgMmKVVhZBBqNLkClUC91cIUx0pVNUkcwcDp1Jamn0XkA1XQV5S9tNM4P8pFcR9qersaxS0DiVTZAdyk0dohDFZAWkEt5QLw1'	
    post_image(access_token, version)
    return render_template('success.html')


if __name__ == '__main__':

    app.run(host='0.0.0.0')