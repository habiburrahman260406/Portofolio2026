import os
import json

portfolio = []

titles_map = {
    # Drone
    'DJI_0067.MP4': 'Dokumentasi Udara Gudang Shopee',
    'DJI_0079.MP4': 'Sinematik Kawasan Perumahan U Ville',
    'DJI_0121.MP4': 'Perspektif Udara Jalan Raya',
    'DJI_0164.MP4': 'Panorama Persawahan dari Udara',
    'DJI_0171.MP4': 'Dokumentasi Udara Pelabuhan & Kapal Ferry',
    'DJI_0172.MP4': 'Dokumentasi Udara Pelabuhan & Kapal Ferry',
    'DJI_0259.MP4': 'Pelepasan Siswa SDN Pamulang Timur',
    'DJI_0268.MP4': 'Perpisahan SDN Pamulang Timur',
    'DJI_0656.MP4': 'Kenangan Perpisahan SDN Sawah Baru',
    'DJI_0748.MP4': 'Pelepasan Siswa SDN Sawah Baru',
    'DJI_0843.MP4': 'International Moslem Pencak Silat Championship 2025 100 Tahun Gontor',
    'DJI_0968.MP4': 'Trip Gunung Papandayan',
    'DJI_0975.MP4': 'Trip Gunung Papandayan',
    'DJI_0988.MP4': 'Eksplorasi Alam Gunung Papandayan',
    'DJI_20260517091700_0356_D.MP4': 'Wisuda Santri Pondok Pesantren Darel Azhar',
    'DJI_20260517092109_0361_D.MP4': 'Prosesi Wisuda Santri Darel Azhar',
    'DJI_20260517092447_0363_D.MP4': 'Wisuda Santri Pondok Pesantren Darel Azhar',
    'Quality Restoration-Ultra HD-DJI_20260206092037_0013_D.mp4': 'Penyambutan Muhaimin Iskandar di Darel Azhar & Syekh Quwait',
    'Quality Restoration-Ultra HD-DJI_20260206104550_0035_D.mp4': 'Penyambutan Muhaimin Iskandar di Darel Azhar & Syekh Quwait',
    
    # Video Editor
    'acc tasyakuran.mp4': 'Dokumentasi Acara Tasyakuran',
    'pantai anyer.mp4': 'Vlog Sinematik Pantai Anyer',
    'U ville.mp4': 'Promo Komersial U Ville',
    'rembes 1 bismillah.mp4': 'Sorotan Vlog & B-Roll Sinematik',
    'bogor fix kali.mp4': 'Dokumentasi Perjalanan Bogor',
    'unpam drone 60 fps.mp4': 'Sinematik Kampus UNPAM 60FPS',
    '0202.mp4': 'Proyek Video Promosi Klien',
    '1005.mp4': 'UPTD SDN Sawah Baru',
    '30 fps.mp4': 'Edit Iklan Produk Komersial',
    'Bismillah finish cuan.mp4': 'Proyek Video Promosi Klien',
    'arsip.mp4': 'Arsip Video Acara Perusahaan',
    'bismillah last fix acc.mp4': 'Sorotan Video Montage / Reel',
    'fix nih pasti.mp4': 'Narasi Sinematik Pendek',
    'jadi.mp4': 'Sorotan Instagram Reels',
    'jadi2.mp4': 'Pelepasan Siswa SDN Pamulang Timur',
    'jajal dlu_1.mp4': 'Perpisahan Santri Kelas 6 Darel Azhar',
    'pikachu1.mp4': 'Eksperimen Creative Color Grading',
    'sound revisi.mp4': 'Sinkronisasi Sinematik Video Musik',
    'sw.mp4': 'Cerita Pendek Media Sosial',
}

# Mapping for online video links (e.g., YouTube or Google Drive share links)
# If a file is not in this map, it defaults to a rotating online stock video link so it always plays on GitHub Pages.
video_urls_map = {
    'DJI_0067.MP4': 'https://youtu.be/upvSngGa7BU',
    'DJI_0079.MP4': 'https://youtu.be/mratTnPaPmQ',
    'DJI_0121.MP4': 'https://youtube.com/shorts/Y3fngNGmC4M?feature=share',
    'DJI_0164.MP4': 'https://youtube.com/shorts/O6AGVVeOeOw?feature=share',
    'DJI_0171.MP4': 'https://youtube.com/shorts/l83vtrAQD84?feature=share',
    'DJI_0172.MP4': 'https://youtu.be/pTIoAnsZZf8',
    'DJI_0259.MP4': 'https://youtu.be/QblzDi5I5Wo',
    'DJI_0268.MP4': 'https://youtu.be/3z77sS7cqmc',
    'DJI_0656.MP4': 'https://youtu.be/ukKESqg6BWk',
    'DJI_0748.MP4': 'https://youtu.be/SpZG4FGl7ns',
    'DJI_0843.MP4': 'https://youtu.be/vkFZGdGt5jI',
    'DJI_0968.MP4': 'https://youtu.be/ayovJDktbyM',
    'DJI_0975.MP4': 'https://youtu.be/76Uz41ge7dU',
    'DJI_0988.MP4': 'https://youtube.com/shorts/8rYyzYm8qpE?feature=share',
    'DJI_20260517091700_0356_D.MP4': 'https://youtu.be/dQhls0dhBjI',
    'DJI_20260517092109_0361_D.MP4': 'https://youtube.com/shorts/GpUeV8ZNEjE?feature=share',
    'DJI_20260517092447_0363_D.MP4': 'https://youtube.com/shorts/Teph8fz_h0c?feature=share',
    'Quality Restoration-Ultra HD-DJI_20260206092037_0013_D.mp4': 'https://youtu.be/Jj31Epr3DRw',
    'Quality Restoration-Ultra HD-DJI_20260206104550_0035_D.mp4': 'https://youtu.be/ncfUQQC4oyw',
}

# Online sample video URLs for fallbacks on GitHub Pages (using YouTube to prevent ISP blocks)
drone_samples = [
    'https://www.youtube.com/watch?v=hBH_MhpxV94',
    'https://www.youtube.com/watch?v=9nIsp83zK1o',
    'https://www.youtube.com/watch?v=981m_1ZJ10Y',
    'https://www.youtube.com/watch?v=mG001_s_U4U'
]

video_samples = [
    'https://www.youtube.com/watch?v=9nIsp83zK1o',
    'https://www.youtube.com/watch?v=hBH_MhpxV94'
]

# Drone
if os.path.exists('drone'):
    # Sort files to ensure stable index assignment
    files = sorted([f for f in os.listdir('drone') if f.lower().endswith('.mp4')])
    for i, file in enumerate(files):
        title = titles_map.get(file, file.replace('_', ' ').split('.')[0].title())
        file_url = video_urls_map.get(file, drone_samples[i % len(drone_samples)])
        portfolio.append({
            'category': 'drone',
            'title': title,
            'file': file_url,
            'thumbnail': f'thumbnails/drone/{os.path.splitext(file)[0]}.jpg',
            'description': 'Sinematografi udara yang direkam dalam resolusi 4K menggunakan perangkat drone profesional.'
        })

# Video Editor
if os.path.exists('video editor'):
    # Sort files to ensure stable index assignment
    files = sorted([f for f in os.listdir('video editor') if f.lower().endswith('.mp4')])
    for i, file in enumerate(files):
        title = titles_map.get(file, file.replace('_', ' ').split('.')[0].title())
        file_url = video_urls_map.get(file, video_samples[i % len(video_samples)])
        portfolio.append({
            'category': 'video',
            'title': title,
            'file': file_url,
            'thumbnail': f'thumbnails/video_editor/{os.path.splitext(file)[0]}.jpg',
            'description': 'Penyuntingan video (editing), desain suara, dan color grading untuk kebutuhan video komersial maupun dokumentasi acara.'
        })

# Foto (skip raw .ARW files, only .JPG)
if os.path.exists('foto'):
    for file in os.listdir('foto'):
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            portfolio.append({
                'category': 'foto',
                'title': f'Foto Kamera - {file.split(".")[0]}',
                'file': f'foto/{file}',
                'thumbnail': f'foto/{file}',
                'description': 'Foto dokumentasi yang diambil menggunakan kamera Sony, menonjolkan pencahayaan, komposisi, dan detail objek.'
            })

# Graphic Design
if os.path.exists('design'):
    for file in os.listdir('design'):
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            title = file.replace('_', ' ').split('.')[0].title()
            if 'ChatGPT' in file:
                title = 'Karya Seni Konseptual'
            elif 'sertifikat' in file.lower():
                title = 'Desain Sertifikat UNPAM'
            elif 'sugoi' in file.lower():
                title = 'Desain Poster Sugrill Sugoi'
            elif 'plakat' in file.lower():
                title = 'Desain Plakat Kenang-Kenangan UNPAM'
            elif 'banner' in file.lower():
                title = 'Banner Backdrop Panggung Acara'
            elif 'quality_restoration' in file.lower():
                title = 'Restorasi Kualitas Foto'
                
            portfolio.append({
                'category': 'design',
                'title': title,
                'file': f'design/{file}',
                'thumbnail': f'design/{file}',
                'description': 'Desain grafis untuk materi branding, poster promosi, plakat penghargaan, dan tata letak digital.'
            })

with open('portfolio-data.js', 'w', encoding='utf-8') as f:
    f.write('const portfolioData = ')
    json.dump(portfolio, f, indent=2)
    f.write(';\n')

print(f'Generated portfolio data in Indonesian with {len(portfolio)} items.')
