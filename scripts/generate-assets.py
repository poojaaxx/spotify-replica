"""Reproducible original cover illustrations and instrumental sample loops. No downloads."""
from pathlib import Path
import math
import struct
import wave

ROOT = Path(__file__).resolve().parents[1] / 'public'
palettes = [('#092f2f','#55d5b8','AFTER','HOURS'),('#351a51','#d4a4f9','SOFT','FOCUS'),('#a73517','#ffc163','GOLDEN','HOUR'),('#142e58','#88b6ee','BLUE','ROOM'),('#503136','#f0b0bb','SLOW','SUNDAY'),('#3b441b','#d6e484','GREEN','ESCAPE')]
for i,(bg,fg,a,b) in enumerate(palettes):
    (ROOT/'covers').mkdir(exist_ok=True)
    circles=''.join(f'<circle cx="{200+j*12}" cy="{185+j*5}" r="{120-j*13}" fill="none" stroke="{fg}" stroke-width="2" opacity=".65"/>' for j in range(8))
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="{bg}"/><stop offset="1" stop-color="{fg}" stop-opacity=".3"/></linearGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".12"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter></defs><rect width="400" height="400" fill="{bg}"/><rect width="400" height="400" fill="url(#g)"/>{circles}<path d="M0 320 Q100 200 200 310 T400 260V400H0Z" fill="{fg}" opacity=".18"/><g fill="{fg}" font-family="Arial,sans-serif" font-weight="900"><text x="25" y="57" font-size="13" letter-spacing="5">THE DAILY COLLECTION</text><text x="25" y="320" font-size="48" letter-spacing="-2">{a}</text><text x="25" y="367" font-size="48" letter-spacing="-2">{b}</text></g><rect width="400" height="400" filter="url(#n)" opacity=".4"/></svg>'''
    (ROOT/'covers'/f'{i}.svg').write_text(svg)

(ROOT/'audio').mkdir(exist_ok=True)
for i,root in enumerate([130.81,146.83,164.81,174.61,196,220]):
    rate=16000
    length=24
    frames=bytearray()
    for n in range(rate*length):
        t=n/rate
        beat=t%0.5
        chord=[1,1.25,1.5,2][int(t/3)%4]
        pad=sum(math.sin(2*math.pi*root*f*t) for f in [1,1.25,1.5])/3
        melody=math.sin(2*math.pi*root*chord*2*t)*math.exp(-beat*7)
        kick=math.sin(2*math.pi*55*t)*math.exp(-(t%1)*22)
        fade=min(1,t/1.5,(length-t)/2)
        value=(.15*pad+.12*melody+.1*kick)*fade
        frames.extend(struct.pack('<h',int(value*32767)))
    with wave.open(str(ROOT/'audio'/f'{i}.wav'),'wb') as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(rate)
        audio.writeframes(frames)
print('Created 6 original covers and 6 original 24-second instrumental samples.')
