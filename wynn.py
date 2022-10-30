import openai
import pyttsx3
import speech_recognition as sr
from api_key import API_KEY


class CreateWynn:
    def __init__(self):
        openai.api_key = API_KEY
        self.engine = pyttsx3.init()
        self.listener = sr.Recognizer()
        self.mic = sr.Microphone()
        self.conversation = ""
        self.user_name = "Pranjal"
        self.engine.say("Hi! I am Wynn. Welcome to the future.")
        pass

    def listen(self):
        with self.mic as source:
            self.listener.adjust_for_ambient_noise(source, duration=0.2)
            self.audio = self.listener.listen(source)
        pass

    def process(self):
        try:
            user_input = self.listener.recognize_google(self.audio)
        except:
            pass

        prompt = self.user_name + ": " + user_input + "\n Wynn:"

        self.conversation += prompt

        response = openai.Completion.create(engine='text-davinci-001', prompt=self.conversation, max_tokens=100)
        response_str = response["choices"][0]["text"].replace("\n", "")
        response_str = response_str.split(self.user_name + ": ", 1)[0].split("Wynn: ", 1)[0]

        self.conversation += response_str + "\n"
        self.response = response_str
        return response_str

    def reply(self):
        self.engine.say(self.response_str)
        self.engine.runAndWait()
        pass