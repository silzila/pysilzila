import os
import pathlib
import uvicorn

# Serves as relative root path. Used in other modules
root_folder = pathlib.Path(__file__).resolve().parent.parent


def main():
    """Main Entry Point of Silzila App.
    This function will start app, the backend which serves API.
    """

    uvicorn.run("silzila.app.app:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == '__main__':
    main()
