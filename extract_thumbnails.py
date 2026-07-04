import os
import cv2

def extract_thumbnails(video_dir, output_dir, target_width=640):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")

    files = [f for f in os.listdir(video_dir) if f.lower().endswith(('.mp4', '.mkv', '.avi', '.mov'))]
    print(f"Found {len(files)} video files in '{video_dir}'")

    for file in files:
        video_path = os.path.join(video_dir, file)
        thumb_name = os.path.splitext(file)[0] + '.jpg'
        thumb_path = os.path.join(output_dir, thumb_name)

        # Skip if already exists
        if os.path.exists(thumb_path):
            print(f"Thumbnail for {file} already exists. Skipping.")
            continue

        print(f"Extracting frame from: {file}...")
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"Error: Could not open video {file}")
            continue

        # Get total frames and FPS
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        
        # We try to grab frame at 1.5 seconds (or frame 30-45 depending on FPS) to avoid black intros
        target_frame = int(fps * 1.5) if fps > 0 else 30
        if target_frame >= total_frames:
            target_frame = int(total_frames / 2) if total_frames > 0 else 0

        cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
        ret, frame = cap.read()

        # If 1.5s frame is not readable, try the first frame
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()

        if ret:
            # Resize frame to maintain aspect ratio with target width
            h, w, _ = frame.shape
            target_height = int(h * (target_width / w))
            resized_frame = cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_AREA)
            
            # Save frame as JPEG
            cv2.imwrite(thumb_path, resized_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
            print(f"Successfully saved thumbnail to {thumb_path}")
        else:
            print(f"Error: Could not read frame from {file}")

        cap.release()

if __name__ == '__main__':
    print("Starting thumbnail extraction process...")
    # Extract drone videos
    extract_thumbnails('drone', 'thumbnails/drone')
    # Extract video editor videos
    extract_thumbnails('video editor', 'thumbnails/video_editor')
    print("Thumbnail extraction process completed!")
