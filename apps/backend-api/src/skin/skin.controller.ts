import {
  Controller, Post, Body, HttpException, HttpStatus, Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { ConfigurationService } from '../config/configuration.service';
import type { Request } from 'express';

interface SkinAnalyzeRequestDto {
  imageBase64: string; // raw base64, no data URI prefix
  mimeType?: string;
}

const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];

const SKIN_ANALYSIS_PROMPT = `You are a clinical dermatology AI. Your job is to analyze a photograph of a human face for skin health metrics.

STEP 1 — FACE DETECTION (do this first):
If the image does NOT contain a clearly visible human face with visible skin (e.g. it's a blank wall, object, dark image, or obscured face), respond with ONLY this JSON:
{"faceDetected": false, "reason": "No human face visible in image"}

STEP 2 — SKIN ANALYSIS (only if face is detected):
Analyze the visible facial skin and return JSON with these fields:
- faceDetected: true
- overallScore: 0-100. Be honest: 50=average, 70=good, 85+=excellent. Do NOT default to high scores.
- hydration: 0-100. Look for: plumpness, glow, fine dehydration lines. Dull/tight skin = low (30-50).
- redness: 0-100. Visible red/pink areas, uneven tone, broken capillaries. Clear even skin = low (5-20).
- pigmentation: 0-100. Dark spots, uneven tone, melasma. Even tone = low (10-25).
- acneRisk: "LOW" | "MODERATE" | "HIGH". Active pimples/cysts = HIGH. Closed comedones = MODERATE.
- sensitivity: "LOW" | "MODERATE" | "HIGH". Redness + thin skin + visible vessels = HIGH.
- barrierHealth: 0-100. Flaking, redness, tightness = low. Smooth, supple, no irritation = high.
- estimatedSkinAge: number. Estimate biological skin age from texture, elasticity, lines. Can differ from actual age.
- confidence: 0-100. Your confidence in this assessment. Lower if lighting is poor or face partially visible.
- keyInsights: 1-2 sentences summarizing the most important finding and recommendation.

Return ONLY valid JSON. No markdown. No explanation outside the JSON.`;


// Allowed origins for CORS / origin validation in production.
// Empty array = allow all (dev mode). Set via ALLOWED_ORIGINS env var in production.
// Example: ALLOWED_ORIGINS=https://app.skincare-platform.com,https://skincare-platform.com
const ALLOWED_ORIGINS_RAW = process.env.ALLOWED_ORIGINS ?? '';
const ALLOWED_ORIGINS: string[] = ALLOWED_ORIGINS_RAW
  ? ALLOWED_ORIGINS_RAW.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

@Public()
// 5 analyze calls per IP per minute — key 'global' matches ThrottlerModule.forRoot name.
// ThrottlerGuard is applied globally via APP_GUARD in AppModule.
@Throttle({ global: { ttl: 60_000, limit: 5 } })
@Controller('skin')
export class SkinController {
  constructor(private readonly config: ConfigurationService) {}

  @Post('analyze')
  async analyze(@Body() body: SkinAnalyzeRequestDto, @Req() req: Request) {
    // --- Origin validation (production hardening) ---
    if (ALLOWED_ORIGINS.length > 0) {
      const origin = req.headers['origin'] ?? req.headers['referer'] ?? '';
      const allowed = ALLOWED_ORIGINS.some((o) => String(origin).startsWith(o));
      if (!allowed) {
        throw new HttpException(
          'Origin not permitted',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // --- Input validation ---
    if (!body?.imageBase64 || body.imageBase64.length < 100) {
      throw new HttpException('imageBase64 is required and must be a valid base64 image', HttpStatus.BAD_REQUEST);
    }

    const apiKey = this.config.geminiApiKey;
    if (!apiKey) {
      throw new HttpException('Gemini API key not configured on server', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const mimeType = body.mimeType || 'image/jpeg';
    const requestBody = JSON.stringify({
      contents: [
        {
          parts: [
            { text: SKIN_ANALYSIS_PROMPT },
            { inline_data: { mime_type: mimeType, data: body.imageBase64 } },
          ],
        },
      ],
    });

    for (const model of GEMINI_MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
        });

        if (resp.ok) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = await resp.json() as any;
          const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          const match = rawText.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            // Face not detected — return 422 so client shows a helpful message
            if (parsed.faceDetected === false) {
              throw new HttpException(
                parsed.reason || 'No human face detected in the image. Please take a clear photo of your face.',
                HttpStatus.UNPROCESSABLE_ENTITY,
              );
            }
            return { source: model, result: parsed };
          }
          throw new HttpException('Gemini returned non-JSON response', HttpStatus.BAD_GATEWAY);
        }

        const status = resp.status;
        if (status === 404 || status === 429) {
          continue; // cascade to next model
        }

        const errText = await resp.text();
        throw new HttpException(`Gemini error ${status}: ${errText.slice(0, 200)}`, HttpStatus.BAD_GATEWAY);
      } catch (err) {
        if (err instanceof HttpException) throw err;
        throw new HttpException(`Network error calling Gemini: ${String(err)}`, HttpStatus.BAD_GATEWAY);
      }
    }

    throw new HttpException('All Gemini models quota-exhausted or unavailable', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
