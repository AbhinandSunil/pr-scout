from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "PR Scout API is running"}