import os,requests,argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("filePath")
    args = parser.parse_args()
    
    key      = 'wPx4kT3Qngc7vwKdExtiIlTixNQ5iZVH'
    url      = 'https://mnrf-jcousineau.c9users.io/upload?key={0}'.format(key)
    filePath = os.path.abspath(args.filePath)
    
    if not os.path.isfile(filePath):
        print("File does not exist({0})".format(filePath))
        return

    files = {'iceFile': open(filePath, 'rb')}
    r = requests.post(url, files=files)
    print(r.text)
    
if __name__ == "__main__":
    main()