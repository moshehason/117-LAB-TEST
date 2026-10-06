#!/usr/bin/env python3
import argparse, math, random, subprocess, os
from datetime import datetime
from zoneinfo import ZoneInfo
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W,H,FPS,DUR = 1080,1920,24,7
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def clamp(v,a,b): return max(a,min(b,v))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("out")
    args=ap.parse_args()
    today=datetime.now(ZoneInfo("Asia/Jerusalem"))
    seed=int(today.strftime("%Y%j"))+117
    rng=random.Random(seed)

    font=ImageFont.truetype(FONT,440)
    base=Image.new("L",(W,H),0)
    d=ImageDraw.Draw(base)
    box=d.textbbox((0,0),"117",font=font)
    tw,th=box[2]-box[0],box[3]-box[1]
    x0=(W-tw)//2
    y0=(H-th)//2-20
    d.text((x0,y0),"117",font=font,fill=255)

    # deterministic parasite/tissue anchors
    anchors=[]
    for _ in range(42):
        for _try in range(500):
            x=rng.randint(x0-5,x0+tw+5); y=rng.randint(y0-5,y0+th+5)
            if 0<=x<W and 0<=y<H and base.getpixel((x,y))>120:
                anchors.append((x,y,rng.uniform(10,32),rng.uniform(0,math.tau)))
                break

    cmd=["ffmpeg","-hide_banner","-loglevel","error","-y",
         "-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-",
         "-f","lavfi","-i",f"sine=frequency={63+seed%23}:sample_rate=48000:duration={DUR}",
         "-f","lavfi","-i",f"sine=frequency={131+seed%41}:sample_rate=48000:duration={DUR}",
         "-f","lavfi","-i",f"anoisesrc=color=pink:amplitude=0.07:sample_rate=48000:duration={DUR}",
         "-filter_complex",
         "[1:a]volume=0.18,lowpass=f=170[a0];"
         "[2:a]volume=0.08,tremolo=f=4.7:d=0.65[a1];"
         "[3:a]volume=0.22,highpass=f=420,lowpass=f=3500,tremolo=f=8.2:d=0.42[a2];"
         "[a0][a1][a2]amix=inputs=3:normalize=0,"
         "afade=t=in:st=0:d=0.25,afade=t=out:st=6.35:d=0.65[a]",
         "-map","0:v:0","-map","[a]",
         "-c:v","libx264","-preset","slow","-crf","16","-pix_fmt","yuv420p",
         "-c:a","aac","-b:a","160k","-ar","48000","-ac","2",
         "-movflags","+faststart","-shortest",args.out]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE)

    for i in range(FPS*DUR):
        t=i/FPS
        chaos=clamp(1-abs(t-3.5)/1.8,0,1)
        bg=Image.new("RGB",(W,H),(248,247,244))

        # breathe + subtly distort the full 117 silhouette
        pulse=1+0.028*math.sin(math.tau*t/1.8)
        mw=max(1,int(W*pulse)); mh=max(1,int(H*pulse))
        scaled=base.resize((mw,mh),Image.Resampling.BICUBIC)
        mask=Image.new("L",(W,H),0)
        mask.paste(scaled,((W-mw)//2,(H-mh)//2))

        # horizontal organic shear by slicing the mask
        warped=Image.new("L",(W,H),0)
        bands=28
        bh=H//bands+2
        for b in range(bands):
            y=b*(H//bands)
            strip=mask.crop((0,y,W,min(H,y+bh)))
            amp=(6+30*chaos)*math.sin(b*0.57+t*2.1)
            warped.paste(strip,(int(amp),y))

        # black body
        black=Image.new("RGB",(W,H),(10,10,10))
        bg.paste(black,(0,0),warped)

        # fluorescent tissue growing inside the mark
        tissue=Image.new("L",(W,H),0)
        td=ImageDraw.Draw(tissue)
        for k,(ax,ay,r,ph) in enumerate(anchors):
            rr=r*(1+1.7*chaos)
            px=ax+chaos*68*math.sin(ph+t*(0.8+(k%5)*0.06))
            py=ay+chaos*56*math.cos(ph*1.4-t*(0.7+(k%7)*0.04))
            td.ellipse((px-rr,py-rr,px+rr,py+rr),fill=220)
        tissue=tissue.filter(ImageFilter.GaussianBlur(radius=14+16*chaos))
        tissue=ImageChops.multiply(tissue,warped)
        pink=Image.new("RGB",(W,H),(255,36,135))
        bg.paste(pink,(0,0),tissue)

        # at peak, the organism grows thin nerves/tendrils outside the glyph
        if chaos>0.28:
            dr=ImageDraw.Draw(bg,"RGBA")
            for k,(ax,ay,r,ph) in enumerate(anchors[::3]):
                amp=chaos*(56+18*(k%4))
                ex=ax+amp*math.sin(ph+t*1.45)
                ey=ay+amp*math.cos(ph*1.7-t*1.1)
                dr.line((ax,ay,ex,ey),fill=(255,36,135,int(55+115*chaos)),width=max(2,int(2+4*chaos)))
                rr=4+4*chaos
                dr.ellipse((ex-rr,ey-rr,ex+rr,ey+rr),fill=(255,36,135,int(110+100*chaos)))

        # small misregistration shadow = physical print/object feeling
        edge=warped.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(0.6))
        shadow=Image.new("RGB",(W,H),(35,35,35))
        shifted=Image.new("L",(W,H),0); shifted.paste(edge,(2,-1))
        bg.paste(shadow,(0,0),shifted.point(lambda v:int(v*0.23)))

        # restrained analog texture, never scanlines
        grain=Image.effect_noise((W,H),3.2+2.5*chaos).convert("L")
        grain=grain.point(lambda v: int((v-128)*0.07+128))
        g=Image.merge("RGB",(grain,grain,grain))
        bg=Image.blend(bg,g,0.035)

        p.stdin.write(bg.tobytes())

    p.stdin.close()
    rc=p.wait()
    if rc:
        raise SystemExit(rc)

if __name__=="__main__":
    main()
