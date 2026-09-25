from youtube_transcript_api import YouTubeTranscriptApi
import sys

def get_transcript(video_id):
    try:
        api = YouTubeTranscriptApi()
        transcript = api.fetch(video_id)
        text = " ".join([t.text for t in transcript])
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    vid1 = "fO0JLrACcOg"
    vid2 = "tcuhDzzoJsQ"
    
    print("--- VIDEO 1 ---")
    t1 = get_transcript(vid1)
    print(t1[:5000])
    
    print("\n\n--- VIDEO 2 ---")
    t2 = get_transcript(vid2)
    print(t2[:5000])
