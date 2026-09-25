from youtube_transcript_api import YouTubeTranscriptApi

try:
    api = YouTubeTranscriptApi()
    transcript = api.fetch("fO0JLrACcOg")
    print(" ".join([t.text for t in transcript])[:1000])
except Exception as e:
    print("ERROR FETCHING VIDEO 1:", type(e), e)
