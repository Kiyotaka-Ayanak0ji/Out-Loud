"""Copy the supplied Bonus Section audio and transcript into the frontend."""
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE_AUDIO = ROOT / "ElevenLabs_Bonus_Section.mp3"
SOURCE_TRANSCRIPT = ROOT / "Bonus Transcript.txt"
OUT_DIR = ROOT / "frontend/public/audio"


def main():
    for source in (SOURCE_AUDIO, SOURCE_TRANSCRIPT):
        if not source.is_file():
            raise FileNotFoundError(f"Required bonus asset not found: {source}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    audio_out = OUT_DIR / "bonus-clip.mp3"
    transcript_out = OUT_DIR / "bonus-transcript.txt"
    shutil.copyfile(SOURCE_AUDIO, audio_out)
    shutil.copyfile(SOURCE_TRANSCRIPT, transcript_out)
    print(f"Copied {audio_out} and {transcript_out}")


if __name__ == "__main__":
    main()
