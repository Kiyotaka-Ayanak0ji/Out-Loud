import asyncio
import os
from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

from emergentintegrations.llm.openai import OpenAITextToSpeech

OUT = "/app/frontend/public/audio/intro-sample.mp3"
TEXT = (
    "Hi — this is a sample placeholder recording for the Out Loud portfolio intro. "
    "The real voice note will be added once it is recorded. Thanks for listening."
)


async def main():
    tts = OpenAITextToSpeech(api_key=os.getenv("EMERGENT_LLM_KEY"))
    audio = await tts.generate_speech(text=TEXT, model="tts-1-hd", voice="fable")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "wb") as f:
        f.write(audio)
    print("saved", OUT, len(audio), "bytes")


asyncio.run(main())
