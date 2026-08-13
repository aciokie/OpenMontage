# Mandatory Assets Review — AI News, August 2026

**Gate status:** Awaiting human approval. No full video draft has been rendered.

## Review package

- **Visual filmstrip:** `snapshots/assets-review-contact-sheet.jpg` — one actual Remotion still from the midpoint of each of the nine approved scenes.
- **Audio reel:** `assets/review/assets-review-audio-preview.mp3` — all nine normalized Lessac narration sections on the exact 100-second schedule, mixed with the provisional music candidate at 16% gain.
- **Captions:** `assets/subtitles/ai-news-august-2026.srt` and `caption-pages.json` — clause-aware timing against the actual narration durations.
- **Structured inventory:** `artifacts/asset-manifest.json` — costs, provenance, licenses, model/settings, dimensions, durations, and SHA-256 hashes.

## Visual coverage

| Scene | Time | Primary subject | Evidence treatment |
|---|---:|---|---|
| 1 | 0–9s | Financial-district city | Bifurcating access/stakes signal |
| 2 | 9–23s | Laptop + phone | GPT-5.6 / $20 device ledger |
| 3 | 23–35s | Edge device | Muse Glimmer cloud-to-laptop route |
| 4 | 35–44s | Code laptop | Muse Spark 1.2 learned-weight blocks |
| 5 | 44–49s | Server technician | Physical-compute iris bridge |
| 6 | 49–65s | Financial district | $500B+ and six institution bands |
| 7 | 65–78s | EU flag/building | DISCLOSE / LABEL / MACHINE-MARK proof sheet |
| 8 | 78–93s | Gym smartphone | Booking route turns from green to red |
| 9 | 93–100s | Typographic closure | CAPITAL / RULES / CONSEQUENCES + returning split signal |

## Stock provenance and license status

| Asset | Credit | Canonical source | License | Status |
|---|---|---|---|---|
| City `PhYq704ffdA` | Sean Pollock | Unsplash | Unsplash License | Approved representative crop; exact approved SHA retained |
| Laptop/phone `15YTRXKuJ14` | Lilly Rum | Unsplash | Unsplash License | Verified free/non-Plus |
| Code laptop `QkYZsgJt9Rg` | Daniil Komov | Unsplash | Unsplash License | Verified free/non-Plus |
| EU flag `9IijGDLb1D4` | Dmitrii E. | Unsplash | Unsplash License | Verified free/non-Plus |
| Gym app `3912952` | ThisIsEngineering | Pexels | Pexels License | Canonical page confirms free use |
| Server technician `19226354` | panumas nikhomkhai | Pexels | Pexels License | Canonical page confirms free use |

Unsplash license: <https://unsplash.com/license>
Pexels license: <https://www.pexels.com/license/>

## Narration

- Provider/model: local Piper `en_US-lessac-medium`, the explicitly approved voice identity.
- Nine sections; normalized to a `-16 LUFS` target and `-1.5 dBTP` ceiling, mono PCM16/48 kHz.
- All actual section durations are within ±15% of their planned slots.
- Accessibility captions reflect the approved script and actual narration schedule.
- Historical approved sample approval remains documented in `artifacts/sample-preflight.json`; its original audio was lost in the ignored-state regression and was not falsely substituted.

## Music fallback requiring explicit approval

The approved Pixabay source family could not be acquired despite browser, CDN, and shell attempts. Four other Pixabay candidates were rejected for Content ID registration. The transparent fallback candidate is:

- **Title:** `Procedural Signal Current`
- **Source:** original, project-local procedural composition (NumPy synthesis + FFmpeg normalization)
- **Duration / tempo:** 104.04 seconds / 114.8 BPM
- **License:** original work created for this project; no third-party Content ID claim
- **Cost:** $0
- **File:** `assets/music/procedural-signal-current-114bpm.mp3`
- **Decision record:** `d-010` in `artifacts/decision-log.json`
- **Current state:** disabled in render props and edit decisions until this gate is approved

## Cost and quality checks

- Provider spend: **$0.00** against approved **$2.00** cap.
- Slideshow-risk score: **0.58 / strong**.
- Representative still render: **9/9 passed** at 1920×1080.
- TypeScript check: passed.
- Artifact, stage-review, decision-log, edit-decision, and checkpoint schema validation: **passed**.
- Remotion project TypeScript validation (`tsc --noEmit --skipLibCheck`): **passed**.
