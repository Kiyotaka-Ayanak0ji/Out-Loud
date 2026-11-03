"""One-off: generate the AI-voiced Bonus Section clip as a static MP3."""
import asyncio
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.openai import OpenAITextToSpeech

load_dotenv(Path(__file__).parent / ".env")
OUT = Path(__file__).resolve().parents[1] / "frontend/public/audio/bonus-clip.mp3"
SCRIPT = (
    "You found the whisper. This is an AI voice reading a note from Ansik. "
    "Out Loud began as an experiment: what happens when you build by talking instead of typing? "
    "For Ansik, voice cut writing time by about eighty to ninety percent. "
    "He believes it can also open technology to people in their own regional languages, from rural India to remote South Africa. "
    "Two riddles stand between you and the final word. Listen closely, think like an engineer, and good luck."
)


async def main():
    tts = OpenAITextToSpeech(api_key=os.environ["EMERGENT_LLM_KEY"])
    audio = await tts.generate_speech(text=SCRIPT, model="tts-1-hd", voice="coral")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(audio)
    print(OUT, len(audio))


asyncio.run(main())
