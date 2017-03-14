from flask import Flask, render_template, request
import requests
import facebook
import time
import os
import base64
app = Flask(__name__)
version='2.2'
base_url = 'https://shareme.lftechnology.com/'


def save_image(image_content, time_stamp, image_location):
    print('1')
    image_file = open(image_location, 'wb')
    print(image_content)
    image_file.write(image_content.decode('base64'))
    print "done saved"

def post_image(access_token, version, image_location, tags):
    print(access_token, image_location)
    graph = facebook.GraphAPI(access_token=access_token, version=version)
    print('Hello')
    graph.put_photo(image=open(str(image_location), 'rb'), message=tags)
    print "done posted"

@app.route('/')
def index():
	return render_template('photo.html')

@app.route('/getsharablelink', methods=['POST'])
def get_sharable_link():
    time_stamp = int(time.time())
    link = base_url + 'preview/'+str(time_stamp)
    image_location = os.getcwd()+'/static/image/image'+str(time_stamp)+'.png'
    image_content = request.form['image'].split(',')[1]
    save_image(image_content,time_stamp,image_location)
    return link

@app.route('/photo', methods=['POST'])
def post_page():
    attributes= request.form
    access_token = attributes['accessToken']
    time_stamp = int(time.time())
    access_token = attributes['accessToken']
    image_content = attributes['image']
    tags = attributes['tags']
    image_location = os.getcwd()+'/static/image/image'+str(time_stamp)+'.png'
    print time_stamp, tags
    save_image(image_content, time_stamp, image_location)
    post_image(access_token, version, image_location, tags)
    return render_template('success.html')

@app.route('/preview/<int:id>', methods=['GET'])
def photo_preview_Page(id):
    return render_template('imagePreview.html', source = 'image' + str(id) + '.png')

if __name__ == '__main__':

    app.run(host='0.0.0.0')
