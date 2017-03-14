from flask import Flask, render_template, request
import requests
import facebook
import time
import os
import base64
app = Flask(__name__)
version='2.2'
base_url = 'http://10.10.9.243/'


def save_image(image_content, time_stamp, image_location):
    print('1')
    image_file = open(image_location, 'w')
    print(image_content)
    image_file.write(base64.decodestring(image_content))
    print "done saved"

def post_image(accesstoken, version, imagelocation):
    print(str(accesstoken), imagelocation)
    graph = facebook.GraphAPI(access_token=str(accesstoken), version=version)
    print('Hello')
    graph.put_photo(image=open(str(image_location), 'rb'), message='Look at this cool photo!')
    print "done posted"

@app.route('/')
def index():
	return render_template('photo.html')

@app.route('/getsharablelink', methods=['POST'])
def get_sharable_link():
    time_stamp = int(time.time())
    link = base_url + 'preview/'+str(time_stamp)
    image_location = os.getcwd()+'/static/image/image'+str(time_stamp)+'.png'
    image_content = request.form['image']
    save_image(image_content,time_stamp,image_location)
    return link

@app.route('/photo/', methods=['POST'])
def post_page():
    attributes= request.form
    access_token = attributes['accessToken']
    time_stamp = int(time.time())
    image_content = attributes['image']
    tags = attributes['tags']
    image_location = os.getcwd()+'/static/image/image'+str(time_stamp)+'.png'
    print time_stamp, tags
    save_image(image_content, time_stamp, image_location)
    post_image(access_token, version, image_location)
    return render_template('success.html')

@app.route('/preview/<int:id>', methods=['GET'])
def photo_preview_Page(id):
    return render_template('imagePreview.html', source = str(id) + '.png')

if __name__ == '__main__':

    app.run(host='0.0.0.0')
