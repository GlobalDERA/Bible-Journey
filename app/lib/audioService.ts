// AUDIO SERVICE - Step 4 Public (Instant human MP3 via SAME Bible key + TTS fallback)
// Good news: NO new signup! Your existing API.Bible key already gives audio:
// GET /v1/audio-bibles -> pick English -> GET /chapters/GEN.3 -> presigned mp3
// Falls back to robot TTS offline. Same buttons.

import { getChapterText } from './bibleService';
import { toPassageId } from './bibleService';

export const AUDIO_SPEEDS = [1, 1.25, 1.5];

let Speech: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Speech = require('expo-speech');
} catch {
  Speech = null;
}

let AudioModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AudioModule = require('expo-audio');
} catch {
  AudioModule = null; // run: npx expo install expo-audio
}

let currentSound: any = null;

const BIBLE_KEY = process.env.EXPO_PUBLIC_BIBLE_API_KEY || '';
let cachedAudioBibleId: string | null = null;

let cachedAudioBibles: { id: string; name: string }[] = [];

async function getAudioBibleList(): Promise<{ id: string; name: string }[]> {
  const key = process.env.EXPO_PUBLIC_BIBLE_API_KEY || BIBLE_KEY;
  if (!key || key.includes('paste-')) return [];
  if (cachedAudioBibles.length > 0) return cachedAudioBibles;
  try {
    const res = await fetch('https://api.scripture.api.bible/v1/audio-bibles?language=eng', { headers: { 'api-key': key } });
    if (!res.ok) {
      console.log(`[Audio] list failed ${res.status}`);
      return [];
    }
    const json = await res.json();
    const list = (json?.data || []).map((b: any) => ({ id: b.id, name: b.name || b.id }));
    console.log(`[Audio] found ${list.length} English audio Bibles: ${list.slice(0, 5).map((b: any) => b.name).join(' | ')}`);
    // Prefer WEB/KJV first, then rest
    list.sort((a: any, b: any) => {
      const score = (n: string) => (/world english|web/i.test(n) ? 0 : /king james/i.test(n) ? 1 : 2);
      return score(a.name) - score(b.name);
    });
    cachedAudioBibles = list;
    return list;
  } catch (e) {
    console.log('[Audio] list error', String(e).slice(0, 120));
    return [];
  }
}

async function getAudioBibleId(): Promise<string | null> {
  const list = await getAudioBibleList();
  if (cachedAudioBibleId) return cachedAudioBibleId;
  if (list[0]?.id) {
    cachedAudioBibleId = list[0].id;
    console.log(`[Audio] using audio Bible ${list[0].name} ${list[0].id}`);
    return list[0].id;
  }
  return null;
}

export async function getApiBibleMp3(ref: string): Promise<string | null> {
  const key = process.env.EXPO_PUBLIC_BIBLE_API_KEY || BIBLE_KEY;
  if (!key || key.includes('paste-')) return null;
  try {
    const list = await getAudioBibleList();
    if (list.length === 0) return null;
    const chapterId = toPassageId(ref); // GEN.5
    // Try each voice until one has this chapter (fixes 404 when first Bible is NT-only)
    for (const b of list.slice(0, 5)) {
      const res = await fetch(`https://api.scripture.api.bible/v1/audio-bibles/${b.id}/chapters/${chapterId}`, {
        headers: { 'api-key': key },
      });
      if (res.ok) {
        const json = await res.json();
        const url = json?.data?.resourceUrl || null;
        if (url) {
          cachedAudioBibleId = b.id;
          console.log(`[Audio] found ${chapterId} in ${b.name}`);
          return url;
        }
      } else {
        console.log(`[Audio] chapter ${chapterId} in ${b.name} failed ${res.status}`);
      }
    }
    return null;
  } catch (e) {
    console.log('[Audio] mp3 error', String(e).slice(0, 120));
    return null;
  }
}

// Old FCBH direct mp3 (only if you later get FCBH key - optional, skip for now)
export function getMp3Url(ref: string): string | null {
  const liveKey = process.env.EXPO_PUBLIC_FCBH_KEY || '';
  if (!liveKey || liveKey.includes('paste-')) return null;
  const passage = toPassageId(ref).replace('.', '_');
  const fileset = process.env.EXPO_PUBLIC_FCBH_FILESET || 'ENGWEBN2DA';
  return `https://cloud.faithcomesbyhearing.com/mp3/hi-res/${fileset}/${passage}.mp3?v=${liveKey}`;
}

export function isAudioReady(): boolean {
  return Speech !== null || AudioModule !== null;
}

export async function speakPassage(ref: string, speed: number = 1): Promise<string> {
  const verses = getChapterText(ref);
  const full = verses.map((v) => v.text).join(' ');

  // 1. Try instant human mp3 via SAME Bible key (no new signup!)
  if (AudioModule) {
    const apiUrl = await getApiBibleMp3(ref);
    const playUrl = apiUrl || getMp3Url(ref);
    if (playUrl) {
      try {
        if (currentSound) {
          await currentSound.unloadAsync?.();
          currentSound = null;
        }
        if (AudioModule.createAudioPlayer) {
          currentSound = AudioModule.createAudioPlayer(playUrl);
          currentSound.setPlaybackRate?.(speed);
          currentSound.play();
          return `Playing human audio ${ref} at ${speed}x`;
        }
      } catch (e) {
        console.log('[Audio] mp3 play failed, fallback TTS', String(e).slice(0, 150));
      }
    }
  }

  if (!Speech) {
    return `Audio not installed yet. Run: npx expo install expo-speech expo-audio. Would speak ${ref} (${verses.length} verses) at ${speed}x.`;
  }
  try {
    await Speech.stop();
    await Speech.speak(full, { rate: speed, language: 'en' });
    return `Playing ${ref} at ${speed}x (robot voice - human mp3 auto-tries with same Bible key when available)`;
  } catch (e) {
    return `Audio error: ${String(e).slice(0, 100)}`;
  }
}

export async function stopAudio(): Promise<void> {
  try {
    await Speech?.stop();
  } catch {}
  try {
    await currentSound?.pause?.();
    await currentSound?.unloadAsync?.();
    currentSound = null;
  } catch {}
}

// Whole-day audio: combines all chapters into one reading (TTS).
// Human mp3 plays per-chapter when single; whole day uses warm robot voice reading all.
export async function speakDay(refs: string[], speed: number = 1): Promise<string> {
  if (refs.length === 1) return speakPassage(refs[0], speed);
  const parts: string[] = [];
  for (const r of refs) {
    const verses = getChapterText(r);
    parts.push(`${r}. ${verses.map((v) => v.text).join(' ')}`);
  }
  const full = parts.join(' ');
  if (!Speech) {
    return `Audio not installed yet. Run: npx expo install expo-speech expo-audio. Would read ${refs.length} chapters at ${speed}x.`;
  }
  try {
    await Speech.stop();
    await Speech.speak(full.slice(0, 8000), { rate: speed, language: 'en' });
    return `Playing full day: ${refs.join(', ')} at ${speed}x`;
  } catch (e) {
    return `Audio error: ${String(e).slice(0, 100)}`;
  }
}
