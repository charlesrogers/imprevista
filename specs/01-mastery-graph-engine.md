# Spec 01: LLM-Powered Mastery Graph Engine

**Status:** Draft
**Date:** 2026-03-22
**Product:** Edgecraft (Mastery Graph)
**Repo:** `/Users/charlesrogers/Documents/mastery-graph/`

---

## 1. The Job This Product Does

### The Struggling Moment

A self-directed learner finishes their third book on Brazilian Jiu-Jitsu, or marketing, or options trading. They have 400 highlights, 80 pages of notes, and 12 hours of podcast transcripts saved. They sit down to practice and realize: they cannot answer any of these questions:

- What are the actual prerequisite dependencies between the skills in this domain?
- Which skill is the bottleneck holding back everything downstream?
- When they fail at a technique, what is the root cause vs. the symptom?
- What does "intermediate" actually look like for this specific skill, with measurable benchmarks?

They open Notion. They start organizing notes by topic. After 6 hours they have a prettier filing cabinet. The knowledge still does not compound into a training plan. The notes describe WHAT to do but never diagnose WHY something is failing, never map what depends on what, and never define what "good enough to move on" looks like at each level.

The compensating behavior is brutal: they re-read chapters, watch the same YouTube videos again hoping something sticks, ask Reddit "what should I practice next," and cycle between skills randomly. Coaches -- the people who DO have this structured knowledge in their heads -- charge $150/hour and can only serve one person at a time. Their expertise dies with their retirement.

### Who This Is For

**Primary:** Self-directed learners (28-45) who consume 20+ books/year and actively practice physical or intellectual skills. They have tried Obsidian, Anki, Notion second-brain systems and found them good for storage but useless for progression planning and diagnosis.

**Secondary:** Coaches and trainers who have deep domain expertise but no system for structuring it into transmissible diagnostic frameworks. They repeat the same corrections hundreds of times and wish they could hand someone a document that says "if you're experiencing X, the root cause is Y, here's the fix."

### Why This Matters at 10-Year Scale

Every domain has an implicit skill graph that lives only in expert heads. Those experts retire, die, or can only serve a handful of students. The diagnostic tree format -- symptom to root cause to fix to coaching cue, with source attribution -- is a novel knowledge structure that no existing tool produces. If this engine works, it becomes the infrastructure layer for structured expertise in any domain. The practical-shooting domain already has 36 skills, 200+ diagnostics, and 150+ coaching cues extracted from 3 sources. That took approximately 40 hours of manual curation. The engine should compress that to 4 hours of human review on top of automated extraction.

### The Job Statement

Help me turn raw learning material into a structured training system that tells me what to learn, in what order, what "good" looks like at each level, and -- most importantly -- what's causing my current plateau and how to fix it.

---

## 2. What Right Looks Like

### The Ideal End State

You drop 3 books on Brazilian Jiu-Jitsu (PDFs, epub, or pasted text) and 15 podcast transcript files into `raw/bjj/`. You run a command. Over 10-15 minutes, the engine:

1. Chunks and embeds all source material with page/timestamp attribution preserved
2. Extracts 47 skill candidates with proposed categories (guard work, passing, submissions, escapes, takedowns, positional control, mental game)
3. Maps 83 prerequisite edges between skills, forming a DAG
4. Generates 4-level progressions for each skill with observable behaviors and measurable benchmarks at each level
5. Constructs 180+ diagnostic tree entries: "opponent keeps passing my guard" maps to 3 root causes (hip escape timing, frame placement, grip fighting deficiency) each with a specific drill prescription and coaching cue
6. Flags 12 items for human review: 4 ambiguous prerequisite edges, 3 skills that might be duplicates, 5 diagnostic entries where the fix doesn't clearly address the root cause

You open the review interface. For each flagged item, you confirm, reject, or edit. The validated graph merges into the domain. Two weeks later, you find a new podcast with John Danaher. You drop the transcript in and run incremental ingestion. The engine adds 8 new diagnostic entries to existing skills and proposes 2 new skills with prerequisites mapped to the existing graph. You review and merge in 20 minutes.

### Quality Bar

The output must match or exceed the quality of the manually curated practical-shooting domain. Concretely:

- **Progression levels** must include observable behaviors ("what it looks like"), measurable benchmarks, specific practice focus, common plateaus, and how to break through. NOT "beginner: knows the basics, intermediate: getting better, advanced: very good."
- **Diagnostic trees** must have genuine causal chains. The root cause must actually explain the symptom. The fix must address the root cause, not the symptom. The coaching cue must be something a human coach would actually say in the moment -- short, memorable, actionable.
- **Source attribution** on every fact. "Ben Stoeger, Skills and Drills Reloaded, 2018" or "John Danaher, BJJ Fanatics instructional, timestamp 14:23." No orphan claims.
- **Prerequisites must form a valid DAG.** No cycles. No orphan skills unreachable from any root. Every prerequisite edge must be defensible -- you could explain to a domain expert why skill A must come before skill B.
- **The Key Concept section** for each skill must identify the single non-obvious insight that separates people who understand this skill from people who don't. Not a summary -- an edge. (Example from grip: "Connection, not force. The most common error at every level is conflating grip quality with grip intensity.")

### Architectural Decisions That Make This Right

- **Multi-pass extraction pipeline.** A single prompt cannot produce structured skill graphs. Each pass has a specific job and a specific output schema.
- **Human-in-the-loop validation.** The engine proposes, the human disposes. Every generated artifact is flagged with a confidence score. Low-confidence items require explicit human approval before merging.
- **Graph coherence validation.** Automated checks: cycle detection, orphan detection, prerequisite chain depth verification, duplicate skill detection, progression level consistency.
- **Source attribution on every fact.** Every claim traces back to a source document, page, or timestamp. Untraceable claims are flagged.
- **Incremental ingestion.** Adding a new book to an existing 40-skill domain does not require rebuilding the graph. The engine diffs new extractions against existing skills and proposes targeted additions.
- **Cross-domain skill transfer detection.** "Grip pressure asymmetry" in shooting maps to "fretting hand pressure" in guitar maps to "tension management" in rock climbing. The engine should surface these connections.
- **The diagnostic tree as the killer feature.** This is the moat. Nobody else produces structured symptom-to-root-cause-to-fix chains from raw content. The entire pipeline is optimized for diagnostic quality.

---

## 3. What Wrong Looks Like

### Wrong: Single-Prompt Extraction

"Here's a book about BJJ. Extract all skills with prerequisites and diagnostic trees." The LLM produces 15 vaguely-named skills ("Guard Basics," "Passing Fundamentals") with no prerequisite logic, generic progression levels ("beginner: learning the moves"), and diagnostic trees that are just restated technique descriptions. The skill names don't match the terminology in the source material. Prerequisites are guessed based on the LLM's training data, not the source. This is what every "AI summarizer" produces and it is worthless for actual training.

### Wrong: No Human Validation

Auto-generated graphs have subtle errors that compound. A wrong prerequisite edge (claiming "spider guard" requires "de la Riva guard" when the source material says the opposite) means someone studies in the wrong order. Diagnostic trees recommend fixes that address the wrong root cause -- "your guard is getting passed because your grips are weak" when the actual issue is hip escape timing. These errors are invisible until someone follows the advice and gets worse. Without a human expert reviewing, the graph accumulates confident-sounding garbage.

### Wrong: Treating All Sources Equally

A Reddit comment from a white belt and a John Danaher instructional get the same weight. A blog post with no citations and a peer-reviewed sports science paper contribute equally to progression benchmarks. The engine must score source quality: primary sources (original research, expert practitioners with verified credentials) outweigh secondary sources (summaries, discussions), which outweigh tertiary sources (Reddit, forum posts). Source quality propagates to the facts extracted from that source.

### Wrong: Monolithic Graph

One giant skill tree where everything is interconnected and nothing is extractable. You cannot pull out "guard work" as a standalone subgraph. You cannot merge two independently-built domains. You cannot diff version 3 of a domain against version 2. The graph must be composable: skills belong to categories, categories form subgraphs, subgraphs can be extracted, merged, and versioned independently.

### Wrong: Pretty Visualization, Shallow Content

An impressive-looking interactive graph with 50 nodes and beautiful edges. You click on a node and get: "Guard passing is the act of moving past your opponent's legs to achieve a dominant position. Prerequisites: guard basics." No progression levels. No diagnostics. No coaching cues. No benchmarks. This is a knowledge map, not a mastery system. The visualization is the least important part.

### Wrong: No Grounding in Revealed Behavior

Skills defined by what textbooks say matters vs. what actually differentiates novices from experts in observed performance. If every BJJ textbook says "hip escape is fundamental" but video analysis of competition matches shows guard retention correlates more with frame placement, the engine should surface that tension rather than just echoing the conventional wisdom. This is where the "Edges" section (from the existing schema) becomes critical -- the engine should actively look for places where standard teaching contradicts observed expert behavior.

---

## 4. Architecture

### System Overview

```
raw/[domain]/           Ingestion Pipeline          domains/[domain]/
  books/        -->  [Chunk] --> [Embed] -->          domain.yaml
  transcripts/       [Extract] --> [Map] -->          graph.yaml
  notes/             [Progress] --> [Diagnose] -->    skills/*.md
                     [Validate] --> [Review] -->      sources/*.md
                     [Merge]
```

### Storage Layer

**Primary storage: Filesystem (YAML + Markdown).** This is a deliberate choice. The existing system uses flat files and it works. Git provides versioning, diffing, and collaboration for free. No database server to run.

**Embedding store: SQLite + sqlite-vss (or ChromaDB local).** Stores chunked source material with vector embeddings for retrieval during extraction passes. One SQLite file per domain at `domains/[domain]/.embeddings.db`. This file is gitignored -- it is a cache that can be rebuilt from sources.

**Why not Neo4j/Postgres:** The graph is small (30-100 nodes per domain) and the adjacency list in `graph.yaml` is sufficient. Neo4j adds operational complexity for zero benefit at this scale. If cross-domain queries become important at 50+ domains, migrate then.

### Ingestion Pipeline (Python)

The pipeline is a sequence of Python scripts in `engine/`, orchestrated by a CLI (`engine/cli.py`). Each pass reads from the previous pass's output and writes structured JSON to `engine/staging/[domain]/[pass-name].json`. The final merge step writes to `domains/[domain]/`.

**Technology choices:**
- Python 3.12+ (matches local dev environment; if deploying, pin to 3.10 for Heroku compat)
- `anthropic` SDK for Claude API calls (Sonnet 4 for extraction passes, Opus 4 for validation/diagnostic generation)
- `tiktoken` for token counting and chunk management
- `sqlite-vss` or `chromadb` for local vector storage
- `PyYAML` for graph.yaml manipulation
- `networkx` for DAG validation (cycle detection, topological sort, connectivity)
- `click` for CLI

### Frontend (Next.js)

The existing Next.js app at `app/` already renders domains from the filesystem. Enhancements:
- **Review interface:** A new route `/{domain}/review` that shows pending extractions from `engine/staging/` with approve/reject/edit controls. Server actions write back to staging, and a "merge" button commits to the domain files.
- **Diagnostic navigator:** The planned `/{domain}/diagnostics` page (already spec'd in TODO.md). Flattened searchable view of all diagnostic trees.
- **Learning path generator:** Given a target skill and current level, compute the shortest prerequisite path and render it as a checklist with links to each skill's progression section.

### API Design

REST API routes in the Next.js app for consumption by other Imprevista products:

```
GET /api/domains                          -- list all domains
GET /api/domains/[domain]/graph           -- full skill DAG as JSON
GET /api/domains/[domain]/skills/[id]     -- single skill with all content
GET /api/domains/[domain]/diagnostics     -- all diagnostic entries, filterable
GET /api/domains/[domain]/path?from=X&to=Y -- prerequisite path between skills
```

No auth needed initially (public read-only). Add API keys if consumption grows.

---

## 5. The Extraction Pipeline in Detail

### Pass 0: Ingestion and Chunking

**Input:** Raw files in `raw/[domain]/` (PDF, epub, txt, markdown, SRT/VTT transcripts).

**Process:**
1. Convert all formats to plain text with metadata preserved (page numbers for PDFs, timestamps for transcripts).
2. Chunk using a semantic chunking strategy: split on paragraph/section boundaries, target 800-1200 tokens per chunk, overlap 100 tokens. Each chunk retains its source file, page/timestamp range, and a sequential chunk ID.
3. Generate embeddings (OpenAI `text-embedding-3-small` or local `nomic-embed-text`) and store in the vector DB.
4. Write a manifest to `engine/staging/[domain]/manifest.json` with chunk count, source files processed, and token totals.

**Output:** Vector DB populated, manifest written.

### Pass 1: Entity Extraction (Skill Candidates)

**Model:** Claude Sonnet 4
**Strategy:** Process chunks in batches of 5-8. For each batch, prompt the model to extract:
- Skill candidates: distinct learnable capabilities mentioned in the text
- For each candidate: a proposed ID (kebab-case), name, category guess, level guess (1-4), and a 1-2 sentence description
- Supporting quotes from the chunk (verbatim, with chunk IDs for attribution)

**Prompt structure:**
```
You are extracting discrete, learnable skills from instructional content about {domain}.

A "skill" is a distinct capability that:
- Can be practiced independently
- Has observable quality differences between levels
- Has prerequisites (or is a root skill)
- Someone could be "stuck" on (enabling diagnostic reasoning)

For each chunk batch, extract every skill candidate. Be specific -- "guard retention" not "defense." Use the terminology from the source material, not generic names.

[chunks]

Return JSON array of skill candidates with: id, name, category_guess, level_guess, description, supporting_quotes[{text, chunk_id}].
```

**Deduplication:** After processing all batches, run a consolidation pass that merges duplicate skill candidates (same concept, different names across chunks). Use embedding similarity + LLM judgment to merge.

**Output:** `engine/staging/[domain]/pass1-entities.json` -- deduplicated skill candidate list.

### Pass 2: Relationship Mapping (Prerequisites and Hierarchy)

**Model:** Claude Sonnet 4
**Input:** The skill candidate list from Pass 1, plus RAG retrieval of relevant chunks for each skill pair.

**Process:** For each skill candidate, retrieve the top 5 most relevant chunks. Prompt the model to determine:
- Prerequisites: which other skill candidates must be learned first? Why? (Cite the source.)
- Parent skill: is this a sub-skill of a broader skill?
- Category confirmation: does the category guess from Pass 1 hold up in context?
- Level refinement: given the prerequisites, does the level assignment make sense?

**Prompt includes the rule:** "A prerequisite means skill A is genuinely required before B can be learned effectively -- not just that they're related. The test: could someone practice B without having learned A? If yes, it's not a prerequisite."

**Validation:** Run `networkx.is_directed_acyclic_graph()` on the result. If cycles exist, flag the edges involved for human review. Check for orphans (skills with no path from any root skill). Check maximum prerequisite chain depth (flag if > 8 -- likely over-specified).

**Output:** `engine/staging/[domain]/pass2-relationships.json` -- skill list with confirmed prerequisites and hierarchy.

### Pass 3: Progression Level Generation

**Model:** Claude Opus 4 (higher quality needed for nuanced level descriptions)
**Input:** Each skill with its supporting chunks (RAG-retrieved).

**Process:** For each skill, generate 4 progression levels. The prompt enforces the existing schema:
```
For skill "{name}" in the domain of {domain}, generate 4 progression levels.

Each level MUST include:
- **What it looks like:** Observable behavior someone watching would see. Be specific and concrete.
- **Benchmark:** A measurable test or target. Include numbers where possible.
- **Key focus:** What to practice to advance to the next level.
- **Common plateau:** What keeps people stuck at this level.
- **How to break through:** Specific practice prescription.

Level names and equivalents: {from domain.yaml}

Ground every claim in the source material. If the source doesn't provide benchmarks for a level, say so explicitly rather than inventing numbers.
```

**Quality gate:** If the model returns generic progressions ("Level 1: learning the basics"), the pass fails for that skill and it's flagged for human authoring.

**Output:** `engine/staging/[domain]/pass3-progressions.json`

### Pass 4: Diagnostic Tree Construction

**Model:** Claude Opus 4
**Input:** Each skill with supporting chunks, plus the progression levels from Pass 3.

**This is the most important pass.** The prompt is heavily engineered:
```
You are building a diagnostic tree for the skill "{name}".

A diagnostic tree maps observable SYMPTOMS to ROOT CAUSES to FIXES to COACHING CUES.

Rules:
1. Symptoms must be things a practitioner or observer can actually see/feel. "Bad technique" is not a symptom. "Shots pulling left consistently" is.
2. Root causes must be causal explanations, not restatements of the symptom. "Pulling shots left" caused by "not aiming right" is circular. "Pulling shots left" caused by "sympathetic tension in dominant hand during trigger press" is causal.
3. Fixes must address the root cause, not the symptom. If the root cause is grip tension, the fix is a specific drill for grip relaxation, not "aim more carefully."
4. Coaching cues must be short (under 15 words), memorable, and something a coach would say in real-time during practice. Not a paragraph -- a phrase.
5. Every diagnostic must cite a specific source. If you cannot attribute it, mark it as [NEEDS_ATTRIBUTION].
6. Include "How to diagnose" -- a specific test or observation to confirm this root cause vs. other possible causes.

Generate as many symptom entries as the source material supports. Quality over quantity -- 3 excellent diagnostics beat 10 shallow ones.
```

**Output:** `engine/staging/[domain]/pass4-diagnostics.json`

### Pass 5: Cross-Reference Validation

**Model:** Claude Sonnet 4 (cheaper, used for structured checks)
**Input:** All outputs from Passes 1-4.

**Automated checks (no LLM needed):**
- DAG validation: `networkx` cycle detection, orphan detection, connectivity
- Schema compliance: every skill has all required sections
- Source attribution: flag any claim without a source citation
- Duplicate detection: embedding similarity between skill descriptions (flag pairs > 0.92 cosine similarity)
- Prerequisite depth: flag chains > 8 deep

**LLM checks:**
- Coherence: "Given skill A requires B and C, and B requires D, does this prerequisite chain make logical sense for the domain?"
- Diagnostic quality: "Does this fix actually address this root cause? Rate 1-5."
- Progression consistency: "Are the Level 2 benchmarks harder than Level 1 and easier than Level 3 for every skill?"

**Output:** `engine/staging/[domain]/pass5-validation.json` -- list of issues with severity (error/warning/info) and suggested fixes.

### Pass 6: Human Review Workflow

**Not an LLM pass.** The review interface in the Next.js app displays:
- All validation errors and warnings from Pass 5
- Low-confidence items (skills, prerequisites, diagnostics) flagged during extraction
- Side-by-side: proposed content vs. source material chunk
- Actions: approve, reject, edit inline, merge with existing skill, split into multiple skills

The human reviews and resolves all items. Nothing merges to the domain without explicit human approval.

### Pass 7: Incremental Merge

**Process:**
1. Diff proposed skills against existing `graph.yaml` and `skills/*.md`
2. For existing skills: append new diagnostics, coaching cues, and source citations. Do not overwrite existing content unless the human explicitly chose to during review.
3. For new skills: create new `.md` files and add entries to `graph.yaml`
4. Update `sources/*.md` with the new source attribution file
5. Run the full validation suite one more time on the merged result
6. Git commit with a message listing sources ingested and skills added/modified

---

## 6. What Makes This Defensible

### The Diagnostic Tree Format Is the Moat

No other tool produces structured symptom-to-root-cause-to-fix chains from raw content. Notion stores notes. Obsidian links them. Anki quizzes them. None of them answer "I'm stuck -- why?" This format was battle-tested on practical shooting (200+ diagnostics validated by a competitive shooter) before any automation existed. The format is proven. The extraction pipeline encodes the format into prompts that enforce causal rigor.

### Curated Domain Expertise in Prompt Engineering

The extraction prompts are not generic. The Pass 4 diagnostic prompt encodes hard-won knowledge about what makes a good diagnostic tree (causal chains, not symptom restatement; observable symptoms, not vague complaints; coaching cues that are phrases not paragraphs). This prompt quality comes from manually building 7 domains. Someone who hasn't done the manual work will write prompts that produce surface-level output.

### Accumulated Validated Graphs Become Training Signal

Every human correction during review (rejecting a bad prerequisite, fixing a diagnostic root cause, editing a progression level) is a training signal. After 20 domains, the system has thousands of human-validated examples of what "good" looks like and hundreds of examples of what the LLM gets wrong. This corpus improves prompt engineering and could eventually fine-tune a domain-specific extraction model.

### Network Effects in Cross-Domain Transfer

With 3 domains, cross-domain transfer is a curiosity. With 30 domains, it's a knowledge asset. "Tension management" appears in shooting (grip), music (fretting hand), rock climbing (finger crimps), surgery (instrument handling), and archery (bow hand). The engine can surface: "You're studying archery? Here are 4 validated diagnostic trees from shooting that apply directly to bow hand tension." No single-domain tool can do this.

### Composable Subgraphs Enable Ecosystem

The YAML/Markdown format is intentionally simple and open. Other tools can read it, remix it, embed it. A coaching platform could consume the API. An Anki plugin could generate cards from diagnostic trees. A training app could use the prerequisite DAG to sequence workouts. Openness at the data layer creates lock-in at the extraction layer -- anyone can use the output, but only this engine produces it at quality.

---

## 7. Phases

### Phase 1: Semi-Automated Extraction (4-6 weeks)

**What ships:** CLI tool (`engine/cli.py`) with commands: `ingest`, `extract`, `validate`, `review`, `merge`. The pipeline runs Passes 0-5 and produces staged output. Human review happens via markdown inspection (not yet a UI). Merge is a CLI command.

**Concrete deliverables:**
- `engine/` directory with pipeline scripts
- Chunking + embedding for PDF, txt, markdown, transcript formats
- 5-pass extraction producing the full skill file schema
- `networkx`-based validation (cycles, orphans, depth)
- Tested on 2 new domains end-to-end, comparing output quality to the manually-built practical-shooting domain

**Success gate:** A domain expert reviews LLM-extracted output for a domain they know and rates 70%+ of diagnostic trees as "accurate or fixable with minor edits." Prerequisite DAG has < 10% spurious edges.

**Estimated cost per domain:** ~$15-25 in API calls (Sonnet for Passes 1-2, Opus for Passes 3-4, Sonnet for Pass 5).

### Phase 2: Review UI + Full Pipeline (4-6 weeks)

**What ships:** The Next.js review interface at `/{domain}/review`. Human review moves from CLI to browser. Confidence scoring on all extracted items. Side-by-side source comparison. One-click approve/reject/edit.

**Concrete deliverables:**
- Review UI with staged item display, source chunk viewer, inline editing
- Confidence scoring model (heuristic, not ML -- based on source count, extraction consistency, embedding similarity to existing skills)
- Batch processing mode for large sources (books split across multiple sessions)
- Diagnostic navigator page (`/{domain}/diagnostics` -- the Feature 3 from TODO.md)
- Coaching cue library page (`/{domain}/cues` -- Feature 4 from TODO.md)

**Success gate:** End-to-end time from "drop a book" to "validated domain" is under 4 hours of human time (vs. 40+ hours manually). Quality parity with manual curation at 80%+ of skills.

### Phase 3: Cross-Domain Transfer + Learning Paths (6-8 weeks)

**What ships:** Cross-domain skill mapping. Learning path generator. Spaced repetition integration.

**Concrete deliverables:**
- Cross-domain embedding index that maps skills across domains by semantic similarity
- "Transfer insights" section auto-generated for skills with cross-domain parallels
- Learning path generator: input a target skill and current level, get a sequenced prerequisite path with estimated time-to-mastery
- Anki deck export from diagnostic trees and coaching cues
- Minimum 10 domains in the system to make cross-domain transfer meaningful

**Success gate:** Cross-domain transfer suggestions are rated "relevant" by domain experts 60%+ of the time. Learning paths produce logically-sequenced prerequisite chains that a domain expert would endorse.

### Phase 4: API + Ecosystem (4-6 weeks)

**What ships:** Public read-only API. Embeddable widgets. Third-party integration points.

**Concrete deliverables:**
- REST API with the routes specified in Section 4
- Embeddable skill card widget (drop into any webpage to show a skill's diagnostic tree)
- Webhook on domain update (notify consumers when a domain's graph changes)
- SDK/client library for Python and TypeScript
- Documentation site with API reference and integration guides

**Success gate:** At least one external consumer (coaching platform, training app, or Anki plugin) is actively using the API.

---

## 8. Risks and Mitigations

### Risk: LLM Extraction Quality Is Too Low

**Likelihood:** Medium. Single-pass extraction is definitely too low. Multi-pass may still produce mediocre diagnostics.
**Impact:** High. The entire product value depends on extraction quality.
**Mitigation:** Phase 1 is explicitly a quality measurement phase. If extraction quality doesn't hit 70% "accurate or minor edit" on diagnostic trees, do not proceed to Phase 2. Instead, invest in prompt engineering and consider fine-tuning on the 7 manually-built domains as training data. The fallback position is: the engine handles Passes 0-2 (chunking, entity extraction, relationship mapping) and humans author Passes 3-4 (progressions and diagnostics) with RAG-retrieved source material as reference. This still saves 60% of the manual effort.

### Risk: LLM API Costs Scale Poorly

**Likelihood:** Low-medium. Opus 4 is expensive for Passes 3-4.
**Impact:** Medium. At $15-25/domain it's fine. At $100+/domain it limits scale.
**Mitigation:** Use Sonnet for everything except diagnostic generation (Pass 4) and progression levels (Pass 3). Monitor cost per domain and set budget caps. If costs exceed $30/domain, evaluate whether Sonnet with better prompts can replace Opus for some passes. Haiku for Pass 5 validation checks.

### Risk: Domain Expertise Bottleneck

**Likelihood:** High. The human reviewer needs domain knowledge to catch subtle errors.
**Impact:** High. A non-expert approving bad prerequisites or diagnostics produces a graph that looks authoritative but gives bad advice.
**Mitigation:** Two strategies: (1) Build domains only in areas where the team has expertise or access to experts. (2) Implement a "confidence tier" system where high-confidence items (multiple sources agree, high embedding consistency) can be auto-approved, and only low-confidence items require expert review. This reduces expert time from "review everything" to "review the hard 20%."

### Risk: Hallucinated Source Attribution

**Likelihood:** Medium. LLMs can invent plausible-sounding citations.
**Impact:** High. Fake sources destroy credibility and could cause real harm in safety-critical domains.
**Mitigation:** Every source citation must link to a chunk ID in the embedding store. The validation pass (Pass 5) checks that cited sources exist in the ingested material. Any citation that cannot be traced to an actual chunk is flagged as `[NEEDS_ATTRIBUTION]` and blocked from merging without human verification. The prompt explicitly instructs: "If you cannot cite a source for a claim, mark it [NEEDS_ATTRIBUTION]. Do not invent citations."

### Risk: Legal / Copyright Concerns

**Likelihood:** Low-medium. Ingesting copyrighted books to produce structured extractions.
**Impact:** Medium. Could limit distribution.
**Mitigation:** The output is transformative -- structured skill graphs with diagnostics, not reproductions of the source text. Source attribution gives credit. Verbatim quotes are minimal and used for coaching cues (short phrases, fair use). Do not reproduce extended passages. The ingested source material (embeddings DB) is gitignored and never distributed -- only the extracted, transformed knowledge is published.

### Risk: Graph Drift Over Incremental Ingestion

**Likelihood:** Medium. After 10 incremental ingestions, the graph may have contradictions or redundancies.
**Impact:** Medium. Confusing for users, undermines trust.
**Mitigation:** Full validation suite runs on the complete merged graph after every incremental ingestion, not just on the new additions. Periodic "graph audit" pass that reviews the entire domain for internal consistency. Version the graph in git so any degradation can be diffed against a known-good state.

---

## 9. Success Metrics

### Extraction Quality (the metric that matters)

- **Diagnostic accuracy rate:** Percentage of LLM-generated diagnostic trees rated "accurate" or "needs minor edit" by a domain expert. Target: 70% at Phase 1, 85% at Phase 3.
- **Prerequisite precision:** Percentage of proposed prerequisite edges that a domain expert confirms as correct. Target: 80%.
- **Prerequisite recall:** Percentage of prerequisites that an expert would add that the engine found. Target: 65% (it's okay to miss some; it's worse to hallucinate them).
- **Progression specificity score:** Human rating (1-5) of whether progression levels contain concrete, measurable, domain-specific content vs. generic filler. Target: 4.0+ average.

### Efficiency (the reason to build this)

- **Human hours per domain:** Time from raw sources to validated, published domain. Current manual process: 40+ hours. Phase 1 target: 15 hours. Phase 2 target: 4 hours.
- **Cost per domain:** LLM API cost for full extraction pipeline. Target: < $30.
- **Incremental ingestion time:** Human time to add one new source to an existing domain. Target: < 30 minutes.

### User Value (does the output help people learn?)

- **Diagnostic resolution rate:** When a user searches for a symptom in the diagnostic navigator, do they find a relevant entry? Measure via search-to-click-through rate.
- **Learning path completion:** If a user follows a generated prerequisite path, do they report progress? (Requires user accounts -- Phase 3+.)
- **Expert endorsement rate:** Percentage of domains where a recognized expert in the field reviews the graph and rates it "useful for learners." Target: 70%+.
- **Cross-domain transfer hit rate:** Percentage of cross-domain skill suggestions rated "relevant" by someone who practices both domains. Target: 60%.

### Scale (is this becoming a platform?)

- **Domain count:** Number of validated, published domains. Phase 1: 9 (7 existing + 2 new). Phase 3: 20. Phase 4: 30+.
- **Total skills across all domains:** Phase 1: ~300. Phase 3: ~1000.
- **Total diagnostic entries:** Phase 1: ~800. Phase 3: ~3000.
- **API consumers:** Phase 4 target: at least 1 external integration.

---

## Appendix: Data Model

### Skill Node Schema (TypeScript)

```typescript
interface SkillNode {
  id: string;                    // kebab-case, unique within domain
  name: string;                  // human readable
  category: string;              // references domain.yaml categories
  level: 1 | 2 | 3 | 4;
  parentId: string | null;       // hierarchy (sub-skill relationship)
  prerequisites: string[];       // DAG edges (must-learn-before)
  description: string;           // 1-2 sentences
  keyInsight: string;            // the non-obvious edge
  correctExecution: string;      // what right looks like
  progressionLevels: ProgressionLevel[];
  diagnostics: DiagnosticEntry[];
  commonErrors: CommonError[];
  coachingCues: CoachingCue[];
  edges: EdgeInsight[];          // non-obvious insights
  relatedSkills: RelatedSkill[];
  trainingDrills: Drill[];
  sources: SourceCitation[];
  confidence: number;            // 0-1, extraction confidence
  lastModified: string;          // ISO date
}

interface ProgressionLevel {
  level: 1 | 2 | 3 | 4;
  whatItLooksLike: string;
  benchmark: string;
  keyFocus: string;
  commonPlateau: string;
  howToBreakThrough: string;
}

interface DiagnosticEntry {
  symptom: string;
  rootCause: string;
  howToDiagnose: string;
  fix: string;
  coachingCue: string;
  source: string;
  confidence: number;
}

interface SourceCitation {
  author: string;
  work: string;
  year: number;
  chunkIds: string[];            // traceability to raw source
  contribution: string;          // what this source added
}
```

### Staging Format

Each pass writes JSON to `engine/staging/[domain]/`. The staging directory is gitignored. After human review and merge, the staging directory is cleared. This provides a clean audit trail: you can inspect what the LLM proposed vs. what was approved.

```
engine/staging/bjj/
  manifest.json              # Pass 0 output
  pass1-entities.json        # skill candidates
  pass2-relationships.json   # prerequisites + hierarchy
  pass3-progressions.json    # 4-level progressions
  pass4-diagnostics.json     # diagnostic trees
  pass5-validation.json      # issues + confidence scores
  review-decisions.json      # human approve/reject/edit log
```
