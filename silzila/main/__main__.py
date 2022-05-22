import webbrowser
import uvicorn
import os
import pathlib
from threading import Timer

root_folder = pathlib.Path(__file__).resolve().parent.parent
print('root_folder ===============================', root_folder)


def main():
    print("starting server ++++...........")
    print("CURRENT W D ========================", os.getcwd())
    # Timer(2, open_browser).start()
    uvicorn.run("silzila.app.app:app", host="0.0.0.0", port=8000, reload=True)


def open_browser():
    webbrowser.open_new_tab("http://localhost:8000")


if __name__ == '__main__':

    main()
