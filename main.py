import uvicorn

if __name__ == "__main__":
    # first app - folder, second - file name, thrid is app object
    uvicorn.run("app.app:app", host="0.0.0.0", port=8000, reload=True)
