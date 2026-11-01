# Content plan

AI-Guide's editorial roadmap. Update this file **in the same commit**
where a lesson gets written, moved, or deleted. Serves to know at
any moment what exists, what's missing, and what's coming next.

## Goal and audience

AI-Guide teaches how to use AI in a practical and aware way, prioritizing the
**non-technical** Italian audience. The path goes from "I don't know what it is"
("Fondamenti", Fundamentals) to "I use it every day" ("Uso quotidiano", Everyday use) to "I use it
at work" ("Sul lavoro", At work), with two modules dedicated to the school
world ("Per studenti", For students, and "Per docenti", For teachers) and a final advanced module for developers
and anyone who wants to integrate it into their own tools ("Per chi vuole di più", For those who want more).

Editorial principles:

- **Every lesson is self-explanatory**: 400-1200 words, at least one concrete example.
- **No unexplained jargon** relative to the level declared in the frontmatter.
- **Zero AI patterns**: voice guide in `.claude/skills/voice-guide/SKILL.md`.
- **Practice before theory** whenever it makes sense. Lessons that warrant it
  have an `<EsercizioLLM>` or a `<ChatDemo>` (see catalog in `CLAUDE.md`).

## Status legend

- ✅ written and published
- ✍️ in progress (draft or QA underway)
- ⏳ planned, not yet written
- 🆕 idea to evaluate, not confirmed

## Module 1: Fondamenti (level `principiante`)

Target: people who have never used ChatGPT or a conversational AI. Zero jargon.
Six lessons of 5-8 minutes each, designed as a linear path.

1. ✅ **Ma cos'è l'IA?** (`fundamentals/what-is-ai`)
   General demystification. What it really is, what it isn't. The two families
   (specialized AI vs conversational AI). Four myths to clear up right away.
   **Full review cycle** (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-18).

2. ✅ **Cos'è un prompt?** (`fundamentals/what-is-a-prompt`)
   The word "prompt" and the mental model "it's like writing a clear
   message to someone who wants to help you". Before/after example with `<ChatDemo>`
   (vague vs clear). Four ingredients of a clear prompt, a warning
   about "magic prompts". **Full review cycle** (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-18). Style-checker
   returned OK with no changes requested.

3. ✅ **La tua prima conversazione** (`fundamentals/first-conversation`)
   The most practical lesson in the module. List of the main conversational
   AIs with links, `<ChatDemo>` as a preview, `<EsercizioLLM>` that
   reuses `public/skills/primo-esercizio.txt` for the first guided dialogue.
   **Full review cycle** (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-18). Style-checker caught a
   remaining factual inconsistency after integrating the questions
   ("Three typical situations" while the list had grown to four
   bullets), fixed as "The most common situations".

4. ✅ **Come fa l'IA a "capire"?** (`fundamentals/how-ai-understands`)
   Explanation of the "one word at a time" mechanism, how it learned
   (huge text, patterns not memories), three practical consequences for the
   reader (it doesn't know, context matters, memory only within the same chat),
   why it seems intelligent, and finally the term "LLM" as a
   technical label at the end of the page. Reuses the black holes `<ChatDemo>` as a visual
   anchor. **Full review cycle** (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-18). Style-checker
   returned OK with no changes requested.

5. ✅ **Quando fidarsi e quando no** (`fundamentals/when-to-trust-it`)
   Opens with the problem of "convincing even when wrong". `<ChatDemo>`
   with a summary of a made-up book to show a hallucination in
   action. Practical "where it's good / where it's bad" map, three moves
   to verify with increasing effort, and a closing mindset ("brilliant
   but inconsistent assistant"). Term "hallucination" introduced halfway
   through as a label. Bridge to lesson 6. **Full review cycle**
   (`analyze-lesson` + `integrate-questions` + `style-checker`, 2026-04-18).
   Style-checker caught "as you saw above" (forbidden by the voice guide's
   "see above/below" rule), fixed with an explicit reference to
   the made-up book example.

6. ✅ **Quello che condividi quando usi l'IA** (`fundamentals/privacy-basics`)
   Lesson on the privacy of your own conversations, not about the site's
   data (there's already `/it/privacy/` for that). Non-legal tone, "your
   grandmother asks". Five blocks: what the AI sees when you talk to it, what
   happens after the message (retention, training, safety review
   + differences between Free / Plus / Team / Enterprise), what not to share
   (third-party data, other people's sensitive documents, professional secrets,
   credentials), settings you can change (training opt-out,
   temporary chats, deletion), a closing mental model
   ("treat it like a trusted colleague but with an unknown information
   chain"). Closes the Fondamenti module and bridges to *Uso
   quotidiano*. **Full review cycle** (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-19). Four
   callouts added during integration: memorization fear, anonymizing
   before pasting, verifying the opt-out went through, caution
   with lesser-known AI apps. Style-checker suggested neutralizing
   "Settings that really exist" (slightly defensive) into "Settings you can change", applied.

**Current status**: 6 out of 6 published, **Fondamenti module complete at
100%**. Review cycle closed on all lessons, learning check-in
active on all of them (`<LlmExercise variant="review">` section
before "What comes next", with a dedicated prompt in
`public/skills/<locale>/review-<slug>.txt`).
The old `cos-e-un-llm.mdx` had been renamed to `come-capisce-l-ia.mdx`
and rewritten from scratch: the old URL `/it/fondamenti/cos-e-un-llm/` no
longer exists (not an issue for now, the site isn't published yet).

## Module 2: Uso quotidiano (mixed level `principiante` / `intermedio`)

Target: people who have used ChatGPT / Claude / Gemini a few times and want
to bring them into daily life with more awareness. Module spec:
`docs/superpowers/specs/2026-04-20-uso-quotidiano-module-design.md`.

Structure validated 2026-04-20. Eight lessons, pedagogical order =
writing order. Mixed level per lesson (5 `principiante`, 3
`intermedio`): the tag reflects the real difficulty of the single
lesson, not a module-wide label.

1. ✅ **Chiedere bene** (`everyday-use/ask-well`, `principiante`)
   Techniques for writing a request that works: clarity,
   context, expected format, role. Bridge from *Cos'è un prompt?* in
   Fondamenti. Absorbs the "AI vs Google" case as a callout. **Full
   review cycle** (`analyze-lesson` + `integrate-questions` +
   `add-defs` + style-check, 2026-04-20). Main integrations:
   explicit bridge to the four levers of Fondamenti 2, labeling
   the levers in the good example, distinguishing role vs "magic prompts",
   AI vs Google callout nuanced around "not Google".

2. ✅ **Iterare la conversazione** (`everyday-use/iterate-the-conversation`, `principiante`)
   The prompt as a dialogue, not a single command. "Magic prompts"
   demystified. Central example: planning a weekend in Florence
   over four rounds (constraints, deep dive, change of angle). Full
   review cycle (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-21). Main integrations: callout on the
   chat memory limit, "when to open a new chat" paragraph,
   round 4 "change of angle" to cover all three types of
   follow-up in the central example.

3. ✅ **Capire una cosa complicata** (`everyday-use/understand-something-complex`, `principiante`)
   Translating bureaucratese into everyday language: contract, medical report,
   utility bill, condo regulations. Full review cycle
   (`analyze-lesson` + `integrate-questions` + `style-checker`,
   2026-04-23). Main integrations: `:::tip` callout on PDFs and
   paper documents between the techniques and privacy sections, a
   clarifying line on medical reports at the opening (bridge to *Cose da NON
   fare*), explicit difference between technique 1 and technique 2, "the
   words" paragraph in the verification section to cover non-numeric
   inaccuracies, privacy callout extended to third-party documents and with
   a gloss on POD (meter reading point).

4. ✅ **Riassumere un documento lungo** (`everyday-use/summarize-a-long-document`, `principiante`)
   PDFs, articles, books. How to ask for a reliable summary and how to
   verify it. Full review cycle (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-23). Main
   integrations: explicit difference from lesson 3 at the opening
   (scale vs complexity, with a combination of techniques for
   documents that are both long and difficult), Technique 1 with
   contextual examples of "depth" and "good for you" vs "good for
   anyone", Technique 3 extended to documents without numbered sections and
   with an explicit difference from Technique 1, `:::tip` callout
   rewritten with concrete instructions on uploading and on what happens
   when the document is "too big", *What to verify* section
   with the two reasons behind the higher frequency of fabrications on
   long documents. Style-checker caught a leftover "spot-check"
   in the summary, four occurrences of "davvero" (a defensive word),
   "di fatto" (buzzword), a close repetition of "plausible"
   and a parallel triad in the closing: all fixed.

5. ✅ **Imparare un argomento nuovo** (`everyday-use/learn-something-new`, `intermedio`)
   AI as a tutor: multi-level explanations, follow-up
   quizzing, quality verification. Prerequisites extended to
   `when-to-trust-it` in addition to `what-is-a-prompt` (a lesson placed
   higher up on verification). Full review cycle
   (`analyze-lesson` + `integrate-questions` + `style-checker`,
   2026-04-23). Main integrations: a "quick rule" on the starting
   level in Technique 1, replacing the opaque metaphor
   "local chisel" with "fine-grained", the reason why generic
   analogies (*"ledger book"*) fail, a paragraph on the analogy
   breaking down, an "ask the AI" variant, an explicit difference
   between Technique 1 and Technique 2, adjusting the quiz and adding
   caution about feedback in Technique 3, a fourth `<ChatDemo>` with the
   full user/AI turn to show the quizzing loop,
   an escalation for the case "the AI insists everything is fine",
   a clarification of what a "credible source" is + a callout on
   niche topics, a mechanical explanation of the Feynman
   test, a structural reason why math/programming/
   medicine are the riskiest areas, a final callout on
   skills vs concepts. Style-checker: OK verdict, 3 fixes
   applied on "davvero/veramente" in the "really understanding" thread.

6. ✅ **Scrivere meglio** (`everyday-use/write-better`, `intermedio`)
   AI as an editor on your own draft, not as a ghostwriter.
   Three patterns that keep your voice (draft + critique, multiple versions,
   emotional temperature), the average-voice trap with a "standing"
   instruction to dampen the default, a yes/caution/no matrix.
   Full review cycle (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-23).
   Main integrations: a second ChatDemo on pattern 1
   (client delay email), a mini-paragraph on "how you identify
   your voice" in pattern 2, a "paste past texts" variant
   to avoid the average voice, a "diagnosis can be wrong" caveat
   in pattern 3, a privacy callout for anonymizing before
   pasting, a "work is almost all caution" callout for HR/customer
   success, inline glosses of *AI-polish* and *padding*.
   Style-checker: OK verdict, no fixes required.

7. ✅ **Foto, immagini e file** (`everyday-use/images-and-files`, `intermedio`)
   Multimodality: photos, screenshots, PDFs, spreadsheets. Three canonical
   use cases (photo of a paper document, screenshot, PDF/file),
   four criteria for choosing between ChatGPT / Claude / Gemini,
   what works and what doesn't for each format, privacy. Full
   review cycle (`analyze-lesson` + `integrate-questions` +
   `style-checker`, 2026-04-23). Main integrations: a
   `:::tip` callout on how to upload a file (paperclip / drag-and-drop /
   camera), a `:::caution` callout on training with opt-out
   (the key question for the intermediate reader about uploaded files),
   a `:::note` callout on documents in other languages, a paragraph on
   handwriting (block letters vs a doctor's cursive) in use
   case 1, an explicit digital-PDF vs scanned-PDF distinction in use
   case 3, a clarification on Office Files "via attachment" on Claude.
   Style-checker: OK verdict, four optional refinements
   applied (an inline gloss of *opt-out*, replacing "that
   territory" with a plainer phrasing, an explicit anchor link
   to the "What works, what doesn't" section, varying a
   repetition of "the same cautions apply").

8. ✅ **Cose da NON fare** (`everyday-use/what-not-to-do`, `principiante`)
   Closes the module. The thesis isn't "AI gets things wrong" (that's in
   Fondamenti 5) nor privacy (Fondamenti 6): it's about where not to delegate the
   **decision** even if the answer were right, for whoever
   takes responsibility. A master rule (high cost + you won't
   notice → only understand, don't decide) with two tests, a worst case
   on specialized topics where the "I'll notice in time" test
   doesn't hold. Five areas: health, money, legal matters,
   decisions that affect other people, jobs where your signature
   equals your own competence. Final compass: the concrete
   difference is "who signs". Full review cycle (`analyze-lesson` +
   `integrate-questions` + `style-checker`, 2026-04-23).
   Main integrations: extending the master rule for the
   specialized case (you lack the competence to notice
   the error), a `:::tip` callout on medical emergencies (call 112 or
   the ER, not the AI), a clarification in the "doctor vs
   AI" section, a mini-example on the line between full delegation
   and help thinking through a difficult conversation, a
   `:::tip` callout on editor vs ghostwriter (who has the initial idea),
   extending the "Why" of the signature section with the interview
   boomerang. Style-checker: OK verdict, two refinements applied
   in the compass ("Look at the five cases above" → "In all five
   cases", the **Non/Sì** triad loosened).

**Current status**: 8 out of 8 published, **Uso quotidiano module
complete at 100%**.

## Module 3: Sul lavoro (level `intermedio`)

Target: non-developer knowledge workers (project manager, marketing,
HR, consulting, sales, teaching, design, communication) who already
know how to use AI for personal things and want to bring it into their work.
Cross-cutting by activity (not by profession). Module
spec: `docs/superpowers/specs/2026-04-23-sul-lavoro-module-design.md`.

Structure validated 2026-04-23. Nine lessons, pedagogical order = writing
order. Uniform level `intermedio`: the audience arrives here
after Fondamenti + Uso quotidiano or with equivalent experience.

1. ✅ **Email difficili** (`at-work/hard-emails`)
   Saying no, replying to someone who made a mistake, giving delicate feedback.
   Specific angle: "the wrong word costs you". Three situations,
   a three-step pattern (tell the full situation, ask for
   versions in different registers, compose your own from the pieces), an
   anonymized central ChatDemo, a callout on tone for the boss, what NOT to do.
   Absorbs the two provisional entries "Email che funzionano" and
   "Riformulare comunicazioni difficili". **Full review
   cycle** (`analyze-lesson` + manual integration curated with
   the user + `style-checker` IT and EN, 2026-04-24). Main
   integrations: full anonymization of the ChatDemo (three ways:
   generic, fictional name, initials), a mini-example in *Dire di no*
   (no + reason + bridge, variant without a bridge), a concrete prompt for
   diagnosing tone in *Rispondere a chi ha sbagliato*, an explicit
   reactive/proactive difference between the two sections, a note on urgency at step
   1 of the pattern. Style-checker IT requested only one fix
   on the opening ("room temperature" → "the reader clocks
   how you react"); EN requested 11 idiomaticity adjustments
   (IT→EN calques).

2. ✅ **Bozze di documenti professionali** (`at-work/draft-professional-documents`)
   Proposals, briefs, reports. Structure (exec summary, audience, sections),
   not just writing. The chosen angle is *structure before text*: AI
   as a first structured draft, not a ghostwriter. Three canonical documents
   (proposal, internal brief, report), the *outline + fill-in* pattern,
   a stop-rule on the outline, a callout on imposed templates (procurement,
   tenders), explicit calibration for the audience. Full review
   cycle (`analyze-lesson` + integration + `style-checker` IT and EN,
   2026-04-24). Main integrations: a line on "when a ghostwriter is
   fine" at the opening, an inline gloss of *handoff* + a four-item
   structure for the brief, a data → interpretation mini-example in the report,
   a "but I don't know how to critique" paragraph with the filter question "does it speak to
   my client or to a generic client?", a `:::tip` callout on the outline
   stop-rule, a `:::note` callout on imposed templates, a clarification that "section
   by section keeps a single chat". Style-checker IT requested fixes
   on two em dashes in the ChatDemo (lines 178 and 206), "literally" as
   a magic adverb, a disguised "First/Second" listicle pattern,
   consistency between "executive summary" and "exec summary". Style-checker EN
   requested three idiomaticity fixes ("It happens often" calque from IT,
   the "so does X, so does Y" cascade, a trailing relative "which").

3. ✅ **Preparare una riunione** (`at-work/prepare-a-meeting`)
   A structured agenda (goal, owner, time, expected
   decision), a prep brief under 150 words, anticipating
   objections with AI as a devil's advocate. "During" is a
   short section: AI isn't at the table. Afterward, an actionable
   three-section extract (decisions, action items with owner and deadline,
   open questions) instead of "summarize the meeting". A ChatDemo on a
   fake transcript of a weekly status update. A `:::note` callout
   on AIs built into call tools (Zoom Companion, Teams
   Copilot, Gemini in Meet) and a `:::caution` on the privacy of
   transcripts as third-party data, with a practical criterion for
   deciding whether the meeting is "sensitive". Full review
   cycle (`analyze-lesson` + integration + `style-checker` IT and
   EN, 2026-04-24). Main integrations from the reader analysis:
   concrete context for the "anticipate objections" prompt (roles,
   stakes, recent history), a completeness check
   on the extract (scan the agenda), a practical criterion for
   "sensitive" + a non-sensitive case with names, a note on
   consent methods (verbal for routine, written for formal),
   a `:::note` callout on AIs in call tools. Style-checker IT
   requested fixing the phrase "we'll get back to this part further
   down" ("see above/below" rule) and two optional refinements
   (ritrovo → riunione, an inline gloss on devil's advocate).
   Style-checker EN requested 8 idiomaticity fixes (IT→EN
   calques like "pays a high return", "buy you double", "don't
   land", "beats the benefit", "record only if you're the one
   recording", "paper minutes", "jotted down too", "straight away
   the two topics").

4. ✅ **Slide e presentazioni** (`at-work/slides-and-presentations`)
   Content, not design. Three rigid prompts to reverse the default
   "slides full of text": an outline from the document (narrative thread over
   N slides, one idea per slide, 30 words max), lean bullets
   (max 4-6 bullets of max 10 words, no third-person verbs,
   telegraphic, figures and names kept), speaker notes (what
   you say out loud, not what's on the slide, no word-for-word
   repetition). A central example on a "Q2 Results" slide
   with a before/after ChatDemo. A `:::note` callout on
   AI-generated slide tools (Gamma, Tome, Beautiful.ai, Decktopus) with
   a criterion for choosing between them and the ChatGPT + PowerPoint route.
   "What NOT to ask for": design, colors, fonts, animations, templates.
   Full review cycle (`analyze-lesson` + integration +
   `style-checker` IT and EN, 2026-04-24). Main integrations
   from the reader analysis: decisions outside the prompt (number of
   slides from presentation time, a long document to summarize
   first), an explicit bridge on why "no third-person
   verbs" makes more work, a criterion for choosing Gamma/Tome vs
   ChatGPT+PowerPoint, speaker notes one at a time not in bulk,
   a practical exception for those without a company template.
   Style-checker IT: OK verdict, two refinements applied (a missing
   link to *Bozze di documenti professionali* on the second
   reference, "is important" → "makes the difference"). Style-checker
   EN requested 5 idiomaticity fixes (a double aside "which are
   numbers and names, that is...", "carry the narrative" → "tell
   the story", agreement "are worth" → "is worth", "And what to
   feed in" → "What to feed in", "the dedicated tool" → "your slide
   tool or a designer").

5. ✅ **Lavorare con dati e tabelle** (`at-work/data-and-tables`)
   Three canonical use cases (cleaning inconsistent data, Excel/Sheets
   formulas, small analyses on extracts), three privacy moves
   before uploading to a public chat (the newspaper policy/test,
   extract only the necessary columns, anonymize
   names), a *Public AI or company AI?* callout with a practical
   criterion to distinguish consumer vs business, a *AI for
   ad-hoc, BI for recurring* callout with a monthly rule, a central
   ChatDemo on cleaning up five rows with the constraint "plus a
   row for open doubts". Full review cycle
   (`analyze-lesson` + integration + `style-checker` IT and EN,
   2026-04-24). Main integrations from the reader analysis:
   a 5% rule with a minimum of three for sample verification, a
   *sample, rule, extension* pattern for large datasets, a mini-paragraph
   on bouncing an Excel error (`#NOME?`, `#VALORE!`, `#RIF!`)
   back to the chat, the newspaper criterion for freelancers without IT/legal,
   an addition to the *Public AI or company AI?* callout on how to
   distinguish consumer from business by the plan name. Style-checker
   IT: OK verdict with optional refinements, six fixes applied
   (explicit "see above/below" link in two spots, "really makes the
   difference" in the intro, "genuinely useful", the title "Three
   concrete use cases", spelling out "BI" as Business Intelligence,
   splitting the "What if there are five hundred rows" paragraph).
   Style-checker EN requested a structural fix (*management
   system* as a calque of "gestionale", replaced with *CRM*/*ERP*
   in five occurrences) and nine idiomaticity refinements
   ("caveat you can't skip" → "catch", "hand over" → "give",
   "more robust" + "keeps control" → "safer" + "keeps you in
   control", "The useful part is" → "The real value is",
   "Bouncing the error back" → "Pasting the error back",
   "recurrently" → "regularly", "ask it to a tool" → "ask a
   tool", "what it got even better" → "better still", "the
   difference is in the method" → "method is what separates the
   two", "less risk surface" → "less risk").

6. ✅ **Ricerca per il lavoro** (`at-work/research-for-work`)
   Three ways to use AI for research (mapping a new
   territory, synthesizing sources you already have, doing live research with
   citations), three forms of professional hallucination (made-up
   citations, round numbers with no source, a summary that invents
   attribution), a verify-cite-track pattern in three steps with
   a mini tracking template, a `:::caution` callout on confidential
   company sources (consistent with the privacy section of
   lesson 5), a central ChatDemo on a competitive brief in the
   Italian sportswear sector. Full review
   cycle (`analyze-lesson` + integration + `style-checker` IT
   and EN, 2026-04-25). Main integrations from the reader
   analysis: an explicit difference between mapping a topic and
   a document's index (Module 2 lesson 4), volumes beyond the
   context limit + a pointer to NotebookLM, a privacy callout
   on confidential sources, a criterion for choosing between Perplexity and the
   other live search engines, an operational rule for how many links to open
   (five points in the brief = five sources), a note on the
   "say so if you have no source" constraint (a brake, not a guarantee), Deep Research and
   agentic research with an inline gloss. Style-checker IT: one
   clear violation (an em dash inside the tracking example,
   replaced with a slash) and three optional refinements applied
   ("Vale la pena" → "conviene", two "you'll see/read below"
   replaced with explicit anchors, "literally" → "word
   for word"). Style-checker EN: OK with optional refinements,
   five idiomaticity polishes applied ("it happens that"
   calque → "Sometimes", a cluster of "actually" reduced, "different
   weight" calque → "more weight than", a triple "It [verb]" merged
   into one varied sentence, a double "usually X, usually Y" removed).

7. ✅ **L'IA come collega che ti aiuta a pensare** (`at-work/ai-as-thinking-partner`)
   A change of posture: AI doesn't produce an output, it helps pull
   out a thought. Three ways (devil's advocate on your idea,
   structured diverge-converge brainstorming, anticipating objections
   in role-play). Sycophancy as a specific risk, with an
   explanation of RLHF and three challenge prompts (specific role +
   blocking preambles + number/intensity). A closing test "at least
   one thing changed" with an anti-test on "changing for the worse"
   (reread it cold, verify the facts the new
   position rests on). Central ChatDemo: a skeptical CFO on a
   mentoring program for juniors with three objections (turnover
   cause-and-effect, the hidden cost of senior time, a six-month
   horizon that's too short). Full review cycle (`analyze-lesson` +
   integration + `style-checker` IT and EN, 2026-04-25).
   Main integrations from the reader analysis: a `:::tip` callout
   on "how much context to give" (a minimal setup, not a page-long brief),
   translating the "specific critic" for those without classic board
   roles (NGOs, freelancers, schools), a second round of
   brainstorming to get past the obvious angles, a privacy paragraph
   in the role-play (reuses the section from *Lavorare con dati e
   tabelle*), a note that sycophancy varies across models but with
   explicit constraints as the main defense, an anti-test
   of rereading cold + fact-checking for the risk of changing for the
   worse, a dedicated paragraph in *Cosa NON fare* on the thinking
   partner being allowed even on health/money/legal matters but only for
   thinking better (understanding options, formulating the questions to ask
   a professional). Style-checker IT: OK with optional
   refinements, four corrections applied (two deictic
   "above/previous paragraph" replaced with explicit anchors,
   two "davvero" thinned out, "which we'll see shortly" replaced with an
   explicit link). Style-checker EN: OK with optional refinements,
   three polishes applied ("make the difference" calque of "fare la
   differenza" → "that matter", typo "a accommodating" → "an
   accommodating", a defensive "actually" removed). Side bug fix:
   the description in both frontmatters contained an unquoted
   `: ` that YAML parsed as a mapping; quoted in
   both languages to stabilize the build.

8. ✅ **Riusare contesto con i progetti** (`at-work/reuse-context-with-projects`)
   Same pattern across Claude Projects, ChatGPT Custom GPTs, Gemini
   Gems: a persistent container with instructions + knowledge files
   + examples, inherited by every chat opened inside it. Three ingredients
   explained one by one with good practices and things to avoid.
   A comparison table of the three platforms with specific
   strengths (Claude for long files, ChatGPT for Actions and
   the marketplace, Gemini for free-tier simplicity). Three applicability
   criteria (recurrence, stable context, multiple people or
   channels). Central example: setting up a project for a
   consulting firm's Thursday newsletter with
   complete instructions + three targeted knowledge files + inline
   examples. Five things not to do: turning it into a file warehouse, confidential
   material in a consumer account, confusion with personal Memory,
   too many projects, lack of maintenance. Full review
   cycle (`analyze-lesson` + integration + `style-checker` IT
   and EN, 2026-04-25). Main integrations from the reader
   analysis: the mechanical reason why a few targeted files beat
   many generic ones (diluted relevance, risk of retrieving the
   wrong one), file formats (PDF and Markdown reliable,
   scanned ones not), a `:::tip` callout on how to update the
   knowledge (delete and reupload, no automatic versioning, an
   "uploaded documents" line at the bottom of the instructions), the
   distinction between creating a Custom GPT (Plus and up) and using a
   public one (Free too), an explanation of what wins between project
   instructions and a single turn's request (an explicit turn wins,
   the project default otherwise), a final paragraph on
   maintenance and the project's end of life (a quarterly review,
   a two-month no-open threshold). Style-checker IT: OK with
   optional refinements, two lexical polishes applied ("The
   knowledge ages" → "Uploaded documents age",
   "over-engineering" → "overcomplicating"). Style-checker
   EN: OK with optional refinements, one small polish applied
   ("Below that threshold" → "Below that" for rhythm); the
   sweep for Italian-English calques found nothing.

9. ✅ **Privacy e dati aziendali** (`at-work/company-data-and-privacy`)
   Closes the module. Scales the personal privacy model from
   Fondamenti 6 to the company context: three risk levels
   (red/yellow/green), how to anonymize in practice (names,
   numeric identifiers, combinable details), real business
   plans (Team/Enterprise/Workspace/Copilot for Business) vs
   consumer plans (Plus/Pro/Advanced) with the criterion "look for data
   retention, training opt-out, DPA", an NDA as the first filter,
   GDPR and special categories, the AI Act for high-risk uses,
   company policy and a freelance variant. Bridge to the following
   modules (4, 5, 6) as the module's natural close.
   Full review cycle (`analyze-lesson` + integration +
   `style-checker` IT and EN, 2026-04-25). Main integrations
   from the reader analysis: an inline gloss on DPA and DPO, a clarification that
   "Plus/Pro/Advanced are consumer, not business", a
   `:::tip` callout "if I've already pasted data in the past" with three
   countermeasures, a `:::tip` callout on scanned PDFs/photos/audio
   (anonymizing at the source, rewriting, local OCR), a
   quick "read it like a stranger" check before pasting,
   a distinction between business numbers needed for reasoning
   and numbers to cut, a gloss on Microsoft Copilot's Azure
   OpenAI backend, a practical AI Act example ("a small firm
   screening CVs"), a freelance variant with a standard clause
   in contracts. Style-checker IT: OK with optional refinements,
   two polishes applied ("below" → "typical of
   business plans" to avoid a deictic, softening the closing "The
   tool amplifies who you are" into a less keynote-style phrase).
   Style-checker EN: OK with optional refinements, four
   polishes applied (varying "usually" → "typically" / "likely",
   "roughly these three" → "Business plans usually offer three",
   splitting a long DPA sentence into two, "may move you in"
   → "may put you in scope").

**Current status**: **9 out of 9 published, Sul lavoro module
complete at 100%** (2026-04-25). All lessons live (IT + EN)
with an active learning check-in (`<LlmExercise
variant="review">` section before "What comes next", with a
dedicated prompt in `public/skills/<locale>/review-<slug>.txt`); the
Module 3 sidebar with all 9 lessons active, no disabled
placeholders; the "Sul lavoro" / "At work" cards on the homepage and
start-here active, pointing to lesson 1.

## Module 4: Per studenti (level `intermedio`)

Target: students from high school through university (plus adults in
career retraining), who want to use AI as study support
without falling into "do my homework for me". Practical tone, mindful of the
plagiarism risk and the boundary between studying and substitution. Module spec:
`docs/superpowers/specs/2026-05-13-per-studenti-module-design.md`.

Structure validated 2026-05-13. Eight lessons, pedagogical order = writing
order. Uniform level `intermedio`: the audience arrives here
after Fondamenti + Uso quotidiano (or with equivalent experience).

1. ✅ **Studiare un argomento nuovo** (`for-students/study-a-new-topic`)
   Formal study against a fixed syllabus. Opens the module with
   the contract "this isn't the do-my-homework manual". Full review
   cycle (`analyze-lesson` + `integrate-questions` + `style-checker`
   IT and EN, 2026-05-13). Main integrations from the reader analysis:
   extending the "reference material" bullet to cover a mix of
   books + handouts + slides, making the professor-vs-textbook
   tension explicit, an opening paragraph for the techniques section that clarifies
   how the three combine, a `:::tip` callout "How much to paste at a
   time", a clarification on sparse slides, a concrete operational example
   in Technique 3 (contemporary history, Mosse/Gentile), a
   `:::note` callout "For those studying math, physics, engineering,
   computer science", a quick anchoring-verification test, extending
   the final Feynman check with what to do if you stumble. Style-checker
   IT: OK with refinements (removing the mic-drop "That's all there is",
   two M2L5 codes replaced with explicit links to `learn-something-new`, two
   defensive "davvero" removed). Style-checker EN: OK with one
   calque fix ("questions of type Z" → "questions like Z").

2. ✅ **Appunti da lezioni e testi lunghi** (`for-students/notes-from-lectures`)
   Raw material (audio, handouts, slides) turned into a studyable form.
   Full review cycle (`analyze-lesson` + `integrate-questions` +
   `style-checker` IT and EN, 2026-05-13). Main integrations
   from the reader analysis: extending the reference to context
   capacity with practical guidance (an hour of audio + slides + 40-50 pages
   of a chapter in the same prompt), an extended Whisper tip with
   concrete examples of normalized proper names (Husserl→Usserl, Schmitt→Smith),
   a note on the photo quality of handwritten notes + how the
   AI behaves faced with a doctor's handwriting, a `:::caution` callout "Verify
   the tags before trusting them" on the fact that the `[Prof]
   [Textbook] [Slide]` attributions are made by the AI and can be wrong, a note
   on the plan required for Claude Projects and ChatGPT Custom GPTs (Gems
   are free, otherwise work in single chats), extending "What
   NOT to do 2" on the professor-vs-textbook tension and how to handle it orally.
   Style-checker IT: OK with one critical fix (an em dash on line 95 inside
   a nested parenthetical, resolved into two sentences). Style-checker EN: OK
   with one borderline non-blocking "actually" (kept, it does semantic
   work).

3. ✅ **Ripassare prima di un esame** (`for-students/revise-before-an-exam`)
   Simulated oral exams, maps, flashcards, a strategy for the professor.
   Full review cycle (`analyze-lesson` + `integrate-questions` +
   `style-checker` IT and EN, 2026-05-13). Main integrations
   from the reader analysis: a "practical session pace" paragraph
   (40-minute duration, 5-8 questions, a "three answers in a row without
   correction" threshold), instructions for students without a single textbook (slides +
   handouts + articles → reconstructing 15-20 entries from the titles), a pattern
   for multiple-choice tests with an explanation of the "why not" for
   distractors, a "first exam with an unfamiliar professor" strategy (defaulting
   to an unpredictable profile), a third cross-AI countermeasure in the callout
   "The AI that agrees with you" (Claude vs ChatGPT vs Gemini as a triple
   check), a workflow for when to verify against the textbook (in real time
   for conceptual corrections, at session's end for minor ones). Style-checker
   IT: OK with a syntactic agreement fix ("alle distrattori" → "ai
   distrattori"). Style-checker EN: OK, the "28" → "B+"
   conversion checked as consistent in both occurrences.

4. ✅ **Scrivere una tesi** (`for-students/write-a-thesis`)
   Published IT + EN on 2026-05-13. The longest lesson in the module
   (~1525 words IT). Outline + fill-in inherited from M3L2, each
   chapter is a separate dialogue, AI as a second reader (not an
   author). Central ChatDemo on Mannerism in Florence (Medici
   vs Roman patronage). `:::note` callout "What if my thesis is
   lab-based?" to generalize the pattern to STEM theses, a
   `:::tip` callout "Evasive advisor" on how to extract expectations
   indirectly, a `:::caution` callout "Declaring LLM use"
   with a practical boundary between revision and generation. Full
   review cycle (`analyze-lesson` 10 questions + `integrate-questions`
   with 6 changes + style-checker IT and EN, 2026-05-13). Main
   integrations from the reader analysis: a STEM callout (the pattern beyond
   the humanities), an inline example on the boundary between "make it clearer"
   and "rephrase it as if I'd written it myself", a concrete notebook
   for original ideas (three things to jot down), handling a university
   with no official policy ("declare it anyway"), the evasive advisor.

5. ✅ **Fonti e citazioni** (`for-students/sources-and-citations`)
   Published IT + EN on 2026-05-13. A technical lesson on the module's
   riskiest topic: the bibliography. Anatomy of a made-up
   citation (four typical patterns), the DOI as a verification gate with
   three possible outcomes, four main styles (APA, MLA, Chicago,
   ISO 690) with practical guidance for choosing, three filters to distinguish
   a real academic source from a disguised blog (DOI, indexed journal,
   known publisher). Central ChatDemo: economics, three papers on
   food consumption taxation, two with made-up DOIs and one real
   (Cawley et al. 2019). `:::tip` callout "AI with web access"
   (ChatGPT browsing, Claude web search, Perplexity), `:::note`
   "Institutional sources: a special case" (Banca d'Italia, OECD, ISTAT),
   `:::tip` "NotebookLM and similar tools" (Claude Projects, Custom GPTs).
   Full review cycle (`analyze-lesson` 8 questions +
   `integrate-questions` with 7 changes + style-checker IT and EN,
   2026-05-13). Main integrations from the reader analysis:
   a conceptual explanation of "why the AI invents with that
   exact structure" (a plausible combination vs an existing
   combination is information external to the writing pattern),
   an operational clarification on library proxies, Zotero explained
   for those who don't know it (installation, sync, Word/Docs plugin),
   choosing a style by discipline, the difference between NotebookLM,
   Claude Projects, and Custom GPTs.

6. ✅ **Tradurre e confrontare testi** (`for-students/translate-and-compare`)
   Published IT + EN on 2026-05-13. A side lesson for the audience of
   language students (modern and ancient), classics, comparative literature,
   philology. The three-versions pattern (literal, idiomatic,
   free) to recompose rather than choose; historical glosses with
   mandatory verification; a comparison between editions (Monti vs Calzecchi
   Onesti for the *Iliad* in IT, Lattimore vs Fagles in EN; Pavese vs
   Fatica for *Moby Dick* in IT, Heaney vs Tolkien for *Beowulf* in
   EN); formal/informal registers for modern languages with regional
   variants. Central ChatDemo: Catullus's *Carmen 5* (*Vivamus, mea
   Lesbia, atque amemus*), three versions + a solid gloss on *vivamus*
   + a gloss with declared uncertainty on *amemus*. `:::tip` callout
   "Without access to paid encyclopedias" (Perseus, SEP,
   Wikipedia EN/FR, Castiglioni-Mariotti, Rocci, LSJ), `:::caution`
   "When the AI doesn't flag uncertainty but is wrong" (three countermeasures
   for non-experts), `:::caution` "Linguistic traps" (false
   friends, historical registers, dialects), `:::danger` "AI in a
   translation exam is plagiarism" with the gray zone between studying and
   preparing to plagiarize. Full review cycle
   (`analyze-lesson` 9 questions + `integrate-questions` with 7
   changes + style-checker IT and EN, 2026-05-13). Main
   integrations: a priority order for glosses to verify (proper names,
   dates, etymologies), instructions for comparing editions
   (always paste 10-30 lines, never trust the AI's memory
   for well-known works), handling texts with only one Italian
   translation, free alternatives to OCD, countermeasures for a
   wrong gloss with no declared uncertainty, the distinction between studying
   and preparing to plagiarize.

7. ✅ **Quando l'IA ti imbroglia** (`for-students/when-ai-tricks-you`)
   Published IT + EN on 2026-05-13. A response-critique lesson
   calibrated for the study context. Opens on the structural problem
   (someone studying a topic for the first time can't notice the error).
   Five typical errors in a study context: definitions that shift from the
   textbook (Durkheim's vs Merton's anomie), confused dates (Yalta in March vs
   February 1945), mixed-up biographies (the middle stoa, Curie, numbered popes,
   Carracci), formulas correct in form but wrong in meaning
   (*F = ma* always right, the Schrödinger equation often wrong),
   phantom works (Foucault, *Le tecniche del sapere normativo*). Three
   quick tests that work without knowing the answer: the textbook
   test, the source test, the second-prompt test. A ChatDemo
   on a history student verifying the date of Yalta.
   `:::tip` callout "Recognizing a high-risk question" (a precise
   figure + homonyms/variants), `:::note` "When a 'new chat' isn't
   really new" (ChatGPT memory, Claude Projects), `:::tip`
   "Riskier subjects" (math, physics, medicine, law,
   chronologies). Full review cycle (`analyze-lesson` 8
   questions + `integrate-questions` with 5 changes + style-checker
   IT and EN, 2026-05-13). Main integrations: a second cross-cutting
   example for mixed-up biographies (Curie, Carracci, popes), practical
   instructions on phrasing the second prompt, the textbook test for
   those without a single textbook, a callout on AI with memory turned on.

8. ✅ **Etica dello studio** (`for-students/ethics-of-studying`)
   Published IT + EN on 2026-05-13. Closes the module. Opens
   by recalling the contract set in lesson 1 and the
   "who signs" rule from M2L8. A four-level usage scale (explanation/
   tutoring always OK; organization/structure usually OK with
   disclosure; generating portions depends on context, with
   four distinct cases: thesis/paper/essay/ungraded work;
   full generation counts as copying even if rewritten word for
   word). A section on declaring AI use with a complete standard
   formula of "were used as" and "were NOT used for",
   instructions for filling in the placeholders with a concrete example
   (ChatGPT Plus GPT-5 on May 12, 2026, Claude Sonnet 4.6).
   `:::note` callout "Institutional policies change" (Polimi,
   Bocconi, Sapienza in IT; Polimi, MIT, Stanford in EN). `:::caution`
   callout "Proctored exams and AI detectors" quoting Turnitin's
   official disclaimer. The "who signs" rule applied to
   three cases (oral exam, thesis, written exam). Full review cycle
   (`analyze-lesson` 8 questions + `integrate-questions` with 4
   inline changes + style-checker IT and EN, 2026-05-13).
   Main integrations: a practical line between a style reviewer and
   a paragraph author, the edge case of a complete rewrite,
   an example of filling in the placeholders, concrete indicators that
   an exam board recognizes. Bridge to the following modules (Per docenti,
   Per chi vuole di più). Doesn't use ChatDemo (a conceptual/ethical lesson).

**Current status**: 8 out of 8 published, **Per studenti module complete
at 100%**.

## Module 5: Per docenti (level `intermedio`)

Target: primary, secondary, and university teachers, plus
corporate trainers and educators. Non-technical audience but with their
own teaching expertise. Practical tone, classroom use cases.
Module spec:
`docs/superpowers/specs/2026-05-16-per-docenti-module-design.md`.

Structure validated 2026-05-16. Nine lessons, pedagogical order = writing
order. Uniform level `intermedio`: the audience arrives here
after Fondamenti + Uso quotidiano (or with equivalent experience).

Module-specific editorial pattern: every operational lesson (1-7)
closes with an "Approfondisci per la tua disciplina" section that
exposes a `deepen-<slug>.txt` prompt file via
`<LlmExercise variant="practice">`. The prompt has the AI interview the
teacher on discipline/level/class/concrete case and generates
a targeted application of the lesson's technique. Pattern absent
in lessons 8-9 (critique + closing, not operational).

Recurring thread "recognizing AI use by students":
a short callout in L5 and L6 with an explicit pointer to the dedicated
lesson L8 (*Quando lo studente usa l'IA*).

Total independence from Module 4 (Per studenti): no cross-links, no
explicit disambiguation toward the student lessons, even where the
topics mirror each other.

1. ✅ **Progettare una lezione** (`for-teachers/design-a-lesson`)
   Published IT + EN on 2026-05-16. Opens the module. The module's
   contract (AI in preparation, not in class, with a tactical
   opening on on-the-fly use). A three-step outline (learning
   objective → grading → timing), critiquing the outline
   before the materials, materials hooked to the validated outline.
   Central ChatDemo: science, age 12, the water cycle, before/after
   with a glass covered in the sun. Four callouts (the first time
   costs more; the minus-25-30% rule; non-standard durations;
   multi-day lessons + subjects with other structures). The project's
   first lesson to use `<LlmExercise variant="practice">`
   for the "Approfondisci per la tua disciplina" section. Full
   review cycle (`analyze-lesson` 10 questions +
   `integrate-questions` with 10 changes all applied + style-checker
   IT and EN, 2026-05-16). Style-checker IT: OK with no fixes requested.
   Style-checker EN: OK with 7 idiomaticity fixes applied ("makes
   sense" split into two sentences, "decides whether" → "is what makes
   it work", "experienced guess" → "educated guess", "of little use"
   → "not much use", "Without explicit constraints" repositioned,
   "Under a microscope it collapses fast" → "Look closer and it
   falls apart", "miraculously" removed).
2. ✅ **Spiegare in cinque modi diversi** (`for-teachers/explain-in-five-ways`)
   Published IT + EN on 2026-05-17. The same notion told to
   idea through multiple representations (not by level; reframed away
   from learning styles, which research doesn't support). The five versions
   (everyday analogy, technical register, visual mode,
   historical narrative, hands-on activity) requested in a single turn;
   2-3 chosen for the class. A hinge between prep and classroom:
   also works on-the-fly when a student doesn't connect.
   Central ChatDemo on inverse functions, ages 16-17, with five
   versions in a single turn. Four callouts (subjects without
   formulas, visual mode without drawing skills, a preset
   "teacher project", schools without phones in class).
   Full review cycle (`analyze-lesson` 9 questions +
   `integrate-questions` with 9 changes all applied +
   style-checker IT and EN, 2026-05-17). Style-checker IT: OK with
   a "qui sopra" fix (forbidden by the voice guide) replaced with
   an explicit anchor at step 3 of the ChatDemo. Style-checker EN
   caught a genuine numeric error (3x5=15, the text said
   "nine combinations never used") fixed in both languages,
   plus 9 EN idiomaticity fixes ("aren't transparent" with reversed
   meaning → "stay invisible", opaque "reformulates it on calibration"
   → "reframes it to fit your class", plus seven minor
   calques).
3. ✅ **Materiali differenziati per livello** (`for-teachers/differentiated-materials`)
   Published IT + EN on 2026-06-24. Same topic, vertical difficulty
   levels, distinct from L2's by-representation axis.
   Pattern *one base text, three derivatives*: the teacher writes the
   standard, the AI derives consolidation and extension (the standard
   is already the base text, the AI is asked for the two extremes). Three
   alignment rules (same answers to the base questions, same work
   time, same glossary). Central ChatDemo on history, first year of
   high school, Constantine's reforms, with the base text visible in the prompt
   and the two derived variants. `:::note` callout for STEM subjects
   (differentiating = changing the support, not the number of problems),
   `:::tip` primary school (a two-level scheme), `:::note` combining
   style × level. What NOT to do: variants without a base text, easy/
   medium/hard labels, drifting away from the assessment. Full
   review cycle (`analyze-lesson` 9 questions + `integrate-questions`
   with 6 changes + style-checker IT and EN, 2026-06-24). Main
   integrations from the reader analysis: the base text made visible in
   the ChatDemo (previously absent), the STEM callout, a clarification that exercises differ
   but the underlying answers stay the same, making the two variants / three
   levels explicit, an anti-drift check against the base text, a gloss
   of "drift" in Italian. Style-checker IT: OK verdict, only the
   description refinement applied. Style-checker EN: OK with
   optional refinements (consolidation/extension, real-world task,
   "genuinely"), none applied (real, clearer teaching jargon in English
   for an international audience).
4. ✅ **Inclusività: BES e DSA** (`for-teachers/inclusive-materials`)
   Published IT + EN on 2026-06-24. Inclusion as accessibility,
   not as an "easy version", distinct from L3's by-level axis.
   A gloss of BES, DSA, PDP, PEI at the opening. Three adaptation
   axes (page layout, visual summary, syntactic simplification that
   keeps the key terms). Central ChatDemo on Italian, second year of
   high school, Petrarch/Canzoniere adapted for a student with
   dyslexia (EN localized on Shakespeare's Sonnets). Guardrails:
   validation with the SEN specialist or support teacher, minors'
   privacy (no name or diagnosis in the chat), no diagnosing or
   severity assessment, adapting within the PDP/PEI plan, not instead of the
   plan. `:::tip` callout "If there's no formal support network" (schools without
   a specialist, uncertified SEN), `:::note` beyond dyslexia
   (dyscalculia, dysgraphia, ADHD), `:::tip` adapting existing
   material via a photo. Full review cycle (`analyze-lesson` 8
   questions + `integrate-questions` with 5 changes + style-checker IT and
   EN, 2026-06-24). Main integrations from the reader analysis:
   a callout on a missing formal support network, extension to dyscalculia/
   dysgraphia/ADHD, a check on the nuance of the literary text,
   the scheme's format (text or ASCII, not an image), a line on
   universal design (making accessibility the default for everyone). Build bug
   caught and fixed: the IT description with an unquoted `: `
   broke the frontmatter's YAML parsing (same case as M3L7),
   rewritten without a colon-space. Style-checker IT and EN: OK verdict,
   no changes required.
5. ✅ **Domande per verifiche** (`for-teachers/generate-assessment-questions`)
   Published IT + EN on 2026-06-24. Four formats (open-ended, multiple
   choice, true/false, problem-solving) each with its own criterion,
   calibrated on Bloom's taxonomy, distractors as typical errors with
   the "why" for each. Central ChatDemo on history, third year of
   high school, World War I (six mixed questions). Anti-cheating
   thread: a callout "questions that hold up to AI-assisted studying", with a pointer by
   name (no link, lesson not yet published) to L8 *Quando lo
   studente usa l'IA*. Other callouts: oral exams, subjects
   without clear-cut facts (multiple choice is weak, open-ended is better), Anki/Quizlet/
   online quizzes, "reread before administering it" with a check on the
   Bloom level the AI claims. Full review cycle
   (`analyze-lesson` 7 questions + `integrate-questions` with 5 changes +
   style-checker IT and EN, 2026-06-24). Style-checker IT and EN: OK
   verdict, no changes required.
6. ✅ **Correggere con criterio** (`for-teachers/grading-with-criteria`)
   Published IT + EN on 2026-06-24. AI as a grading
   assistant, not as a judge. Three principles (the teacher's rubric,
   the teacher's decision, anonymization) and a five-step workflow:
   explicit rubric, a first AI pass on 3-5 papers, the teacher's
   verification on the same ones, extension to batches if it holds up (with a spot-check on
   the full set), written feedback from the teacher. Central ChatDemo on
   Italian, fifth year of high school, text analysis of Foscolo's *A
   Zacinto*: the AI applies the rubric, gets an ambiguous criterion
   wrong (a Foscolo/Leopardi chronological error it misses), and disagreement with the
   teacher refines the rubric. EN localized on Keats (*When I have
   fears*) with a Keats/Tennyson error. Anti-cheating thread: a callout on
   manual indicators of suspected AI use (clues, not proof), a pointer by
   name to L8. Other callouts: handwritten essays (photo, handwriting,
   name anonymization), STEM/answer key, privacy, a table
   for the gradebook (link to M3L5 *data-and-tables*). Full review
   cycle (`analyze-lesson` 6 questions + `integrate-questions` with 3
   changes + style-checker IT and EN, 2026-06-24). Style-checker IT: OK
   with one refinement applied ("In sintesi" → "Nel complesso" in
   the AI's line in the ChatDemo). Style-checker EN: OK.
7. ✅ **Comunicare con le famiglie** (`for-teachers/emails-to-families`)
   Published IT + EN on 2026-06-24. Delicate emails to parents: AI
   compresses time, not sensitivity. Three registers according to
   school level (primary friendly, secondary institutional but
   close, university formal with a note on the adult student's
   consent). A three-step pattern (an anonymized situation, three
   versions in different registers, compose from the pieces and reread it cold).
   Central ChatDemo on lower secondary school, a sudden drop in
   performance: three versions (dry, warm, formal) recomposed into
   one. Cases with pitfalls (low grade, behavior, a suspected learning
   disability, a summons). A reinforced minors' privacy callout,
   non-Italian-speaking families (EN: non-English-speaking), replying to
   an angry parent, when email is NOT the right tool (serious
   facts → an internal procedure). Full review cycle
   (`analyze-lesson` 6 questions + `integrate-questions` with 3 changes +
   style-checker IT and EN, 2026-06-24). Style-checker IT: OK with two
   refinements applied ("davvero", a positional reference).
   Style-checker EN: OK with two refinements applied ("pour data" →
   "enter/put", "at your earliest convenience").
8. ✅ **Quando lo studente usa l'IA** (`for-teachers/when-students-use-ai`)
   Drafted IT + EN. Recognizing without demonizing. Body: AI detectors
   unreliable in both directions (Turnitin AI / GPTZero / Copyleaks,
   with the 2023 Stanford study on bias against non-native writers and
   Turnitin's own disclaimer), then three moves. (1) Manual indicators
   as hypotheses not proof (uniform register, unverifiable citations,
   vanished personal errors). (2) Redesigning assignments so they hold
   up (hook onto a class source, a local/personal angle, an oral
   defense, a tight form constraint), with a central ChatDemo rewriting
   a weak "Industrial Revolution essay" prompt and a `:::tip` fragile-
   assignment test. (3) Conversation not condemnation, with the false-
   positive vs true case held together and a `:::caution` on the
   asymmetry (a false positive does more damage). `:::note` on scope
   (high school + university; primary/middle less). No deepen (critical,
   not operational): only the end-of-lesson check-in. Prereq
   `[ask-well, when-to-trust-it]`. Full review cycle (5-agent style +
   coherence sweep, `analyze-lesson`, `integrate-questions`, 2026-07-23).
   Main integrations from the reader analysis: a web-enabled AI can still
   fetch a plausible local fact so the hooks must combine (class source +
   oral defense), detector bias is English-tuned so even less validated on
   Italian, the conversation may not resolve (no proof, no sanction, adapt
   future work), plus a "no use as proof" wording fix. Style-checker:
   de-duplicated the repeated "hypotheses not proof" line, split two long
   sentences. L5 and L6 anti-cheating callouts now link here.
9. ✅ **Etica del docente** (`for-teachers/ethics-of-teaching`)
   Drafted IT + EN. Closes the module. Single thread "who signs is who
   answers" (from M2L8 *what-not-to-do*) across three axes. **Honesty**:
   routine prep needs no disclosure, but you check AI material before
   handing it out, you don't ask students for an honesty about AI you
   don't keep, and AI is never an authority source with families.
   **Privacy of minors**: no names/grades/diagnoses/class photos in a
   consumer chat, the electronic gradebook doesn't go into the chat, a
   `:::tip` on class photos/videos, the school's DPO/privacy lead as the
   frame. **Grading**: AI proposes, teacher decides and signs; no seat
   at the end-of-term grading meeting. `:::note` on Italian (Ministero,
   USR) + EU (European Commission guidelines) + UNESCO guidance
   (EN adds US districts / UK DfE), cited as pattern not precise sources.
   Bridge to Module 6. No ChatDemo (conceptual close). No deepen: only
   the end-of-lesson check-in. Prereq `[ask-well, privacy-basics,
   what-not-to-do, company-data-and-privacy]`. Full review cycle (5-agent
   style + coherence sweep, `analyze-lesson`, `integrate-questions`,
   2026-07-23). Main integrations: the gradebook's built-in AI is a
   contracted processor (not a consumer chat), a no-training business plan
   still doesn't authorize uploading minors' faces, public schools are
   legally required to have a DPO (fallback for those that seem not to),
   binding law vs non-binding guidance, why GDPR protects minors more.
   Style-checker: removed a "La prima/seconda/terza" listicle, softened a
   keynote triple, fixed an impersonal-voice slip. L4 and L6 now link here.

**Current status**: **9 out of 9 published, Per docenti module complete
at 100%** (2026-07-23). All lessons live (IT + EN) with the end-of-lesson
learning check-in (`<LlmExercise variant="review">`); lessons 1-7 also
carry the discipline deepen-dive (`variant="practice"`), lessons 8-9 do
not (critical + closing, not operational). Module 5 sidebar has all 9
lessons active in `astro.config.mjs`, no disabled placeholders. The three
forward references from L4/L5/L6 that named L8/L9 before they existed are
now real links.

## Module 6: Per chi vuole di più (level `avanzato`)

Target: developers and professionals who want to integrate AI into their own
tools. Technical audience: more direct tone, less hand-holding.

Final slugs and sidebar order (2026-04-23). Decision 2026-04-23:
the module stays a single block of 13 entries until the first 3-4
lessons are written; if it grows, consider splitting it into "Core APIs" +
"Beyond APIs".

0. ✍️ **Cos'è un'API in cinque minuti** (`going-deeper/what-is-an-api`)
   Drafted IT + EN (2026-11-01). Bridge lesson, first in the module, level
   `intermedio`, no prereq: request/response, endpoint, API key as a secret,
   JSON, status codes 200/400/401/429/500, rate limit, token billing.
   `from-chats-to-apis` now lists it as prerequisite.
1. ✍️ **Dalle chat alle API** (`going-deeper/from-chats-to-apis`)
   Drafted IT + EN (2026-07-24). Opens the technical module and shifts the
   register (developer audience, direct tone). Three sections: what actually
   changes (the chat is a product around the model; the API is the bare model,
   **stateless**, you resend the conversation each call), the first call (a
   real ~8-line Anthropic Messages call in **tabbed Python + TypeScript** via
   Starlight `<Tabs syncKey="lang">`, then a line-by-line walkthrough of
   client/model/`max_tokens`/`messages`/reading `content[0]`), when it's worth
   it (volume, integration, control/reproducibility vs the chat for
   exploration/one-off). Setup: `:::caution` on the API key as a credential
   (env var, never committed, never in browser code), `:::note` that the API
   bill is separate from the chat subscription (pay-per-token, bridge to L11).
   Forward refs to L3/L4/L5/L11 by name (not yet written). End-of-lesson
   check-in. No prereq (module on-ramp for developers). Full review cycle
   done (`analyze-lesson` 8 questions + `integrate-questions` recommended
   set + 2 style-gate rounds, 2026-07-24): added a `max_tokens`
   truncation / `stop_reason` gotcha, the concrete stateless-continue
   pattern (append an `assistant` message and resend, list grows until the
   window), a model-id alias-vs-pinned note, and a `:::note` on production
   error handling (429/overload/5xx, SDK retries) + streaming.
2. ✍️ **Scegliere il modello** (`going-deeper/choose-the-model`)
   Drafted IT + EN (2026-07-24). No code (comparative lesson). Reframe away
   from "which is strongest" toward "right for your constraint". The families
   (Claude/GPT/Gemini closed, deliberately not ranked since they leapfrog each
   release; open-weight Llama/Mistral/Qwen). Seven decision axes (capability
   vs task, cost, speed, context window, modality, data control, stack fit)
   with a scannable criteria table, a starting rule (mid-tier first, drop where
   quality holds, escalate where it doesn't, often two models in one system),
   an anti-leaderboard close (test on 5-10 of your own examples, bridge to
   L10 Evals). `:::note` open-weight isn't free (hardware/hosting cost),
   `:::tip` isolate the model call behind a thin seam without over-abstracting.
   Forward refs to L3/L10/L11/L12 by name. End-of-lesson check-in. Prereq
   `[from-chats-to-apis]`. Full review cycle done (`analyze-lesson` 8
   questions + `integrate-questions` recommended set + 2 style-gate rounds,
   2026-07-24): named the stack-fit + own-eval tie-breaker (the honesty
   gap in "families not ranked"), added price-per-token as the tier signal
   when names churn, made "quality holds" a measurable threshold, and a
   routing line for the two-model pattern. Runs ~1330 prose words (over the
   1200 soft target), kept whole as a coherent reference lesson.
3. ✍️ **Il contesto in token** (`going-deeper/context-in-tokens`)
   Drafted IT + EN (2026-07-27). No new provider concepts, builds on L1's
   stateless resend. Sections: what a token is (sub-word chunks, ~4 chars/token
   in English, more in Italian, tokenizer varies by model), the context window
   (input + output share one budget, `max_tokens` reserves the output slice,
   ballpark 100-200K up to 1M, check the docs), what fills it (system prompt +
   the whole resent conversation + attached docs + tool defs; a running total,
   not per-message), what happens when you overflow (API errors on input; the
   chat trims/summarizes old turns, which is why it "forgets" the start; distinct
   from `max_tokens` output truncation), counting and leaving room (a lean tabbed
   Python/TS snippet reading `usage.input_tokens`/`output_tokens`, then: pass only
   relevant text with a forward ref to L6 RAG, summarize-and-restart on long
   chats, and the "lost in the middle" position tip). `:::tip` on counting
   exactly (`usage` after the fact, `count_tokens` before). Forward refs to
   L4/L6/L11 by name, back-links to L1. End-of-lesson check-in. Prereq
   `[from-chats-to-apis]`.
4. ✍️ **System prompt e ruoli** (`going-deeper/system-prompts-and-roles`)
   Drafted IT + EN (2026-07-27). Sections: what the system prompt is (standing
   instruction, product-written-then-invisible in the chat, yours over the API),
   the three roles (system/user/assistant, with the provider accuracy note that
   Anthropic's `system` is a top-level param not a `messages` item, OpenAI uses a
   system message), a concrete classifier example (rules in `system`, ticket in
   `user`) as a tabbed Python/TS snippet tying back to L2's classification thread,
   separating instructions from data (the three reasons: clarity, maintenance,
   security, with the injection teaser), what to put in / keep out (persona /
   task / rules / format vs the case data and contradictory rules; a bloated
   system prompt costs tokens every call, bridge to L3 and to L11 caching).
   `:::tip` on Anthropic assistant-prefill to nail the output start, `:::caution`
   that the system prompt is a strong steer not a security wall (forward ref to
   L9). Forward refs to L5/L9/L11 by name, back-links to L1/L3. End-of-lesson
   check-in. Prereq `[from-chats-to-apis, context-in-tokens]`.
5. ✍️ **Tool use, function calling, structured output** (`going-deeper/tool-use-and-structured-output`)
   Drafted IT + EN (2026-07-27). Sections: what tool use is (tool use = function
   calling, two names; the model asks, your code executes and returns the
   result), the full loop (a tabbed Python/TS `get_weather` example: the first
   call returns a `tool_use` block with `stop_reason: "tool_use"`, you append the
   request + a `tool_result` to the stateless message list and recall, loop until
   `end_turn`), structured output (the portable single-tool trick: one tool whose
   `input_schema` is your output shape, forced with `tool_choice`, read the
   filled-in `.input`; the assistant-prefill `{` shortcut from L4 as the lighter
   alternative), what to keep in mind (validate the arguments as untrusted input,
   force vs let-it-choose, tool defs cost tokens, a tool is a capability so a
   security surface). `:::tip` that the tool description is the interface the
   model selects on. Forward refs to L3/L4 as real links, L9 by name (italic).
   End-of-lesson check-in. Prereq `[from-chats-to-apis, system-prompts-and-roles]`.
6. ✍️ **RAG: dare all'IA i tuoi documenti** (`going-deeper/rag`)
   Drafted IT + EN (2026-07-27). Open L6 question resolved: **concept-first + one
   minimal retrieval sketch** (not a full build-along), consistent with the
   module's "runnable but lean". Sections: the problem (the model doesn't know
   your private/internal/recent docs, and you can't cram them all in the window),
   what RAG is (retrieve the relevant pieces, put only those in the prompt;
   open-book-exam analogy), how it works (two stages: index once = chunk + embed
   into vectors; retrieve per query = embed the question, cosine similarity,
   top-k; embeddings from a dedicated model, semantic not keyword), a minimal
   example (a tabbed Python/TS cosine + top-k sketch feeding only the retrieved
   pieces to the model with an "answer only from context" system prompt), when you
   actually need it (need it: too many/changing/private docs, citable answers;
   don't: fits in context → long-context is simpler; managed route →
   Projects/Custom GPTs/Gems, link to M3L8). `:::tip` on chunking (size +
   overlap), `:::caution` that retrieval is the bottleneck + retrieved text is a
   prompt-injection vector. Forward refs to L3/M3L8 as real links, L7/L9 by name
   (italic). End-of-lesson check-in. Prereq `[from-chats-to-apis, context-in-tokens]`.
7. ✍️ **Prompt injection e sicurezza** (`going-deeper/prompt-injection`)
   Drafted IT + EN (2026-11-01), placed right after RAG. Direct vs indirect
   injection (indirect-injection `<ChatDemo>`), jailbreaks, why the system prompt
   is not a barrier, tool/agent risks (exfiltration, unwanted actions), defenses
   (label untrusted data, least privilege, human confirmation, allowlist output
   validation, no secrets in prompts, logging, adversarial tests), honest "no
   complete fix" `:::caution`. Tabbed Python + TS. Check-in forbids ready-made
   attack texts. Prereq `[system-prompts-and-roles, tool-use-and-structured-output, rag]`.
8. ✍️ **Agenti** (`going-deeper/agents`)
   Drafted IT + EN (2026-11-01). Realistic, no hype: an agent is a model calling
   tools in a loop (plan, act, observe). Tool-loop snippet with `MAX_STEPS`, a
   log and human approval for the consequential tool. Ladder single call, then
   fixed workflow, then agent. Four failure modes, four defenses. Prereq
   `[tool-use-and-structured-output, prompt-injection]`.
9. ✍️ **MCP e integrazioni** (`going-deeper/mcp-and-integrations`)
   Drafted IT + EN (2026-11-01). Open standard, server/client/host, tools /
   resources / prompts, N×M to N+M, local (stdio) vs remote, minimal server with
   the v2 SDKs (TS in beta, `:::note` to check the docs), trust and permissions.
   Prereq `[tool-use-and-structured-output, agents]`.
10. ✍️ **Evals** (`going-deeper/evals`)
   Drafted IT + EN (2026-11-01). 20-50 real cases incl. edge cases and past
   failures; checks from cheapest up (exact/structured, rules, LLM judge with
   rubric and calibration, human review); before/after and regressions; set in
   git. Minimal runner in Python + TS. Prereq `[system-prompts-and-roles, tool-use-and-structured-output]`.
11. ✍️ **Costi e prompt caching** (`going-deeper/costs-and-caching`)
   Drafted IT + EN (2026-11-01). Where cost comes from, levers (smallest model
   that passes evals, less context, `max_tokens`, Batch API, caching),
   `cache_control` on a stable prefix, measuring with `usage` fields. No price
   figures. Prereq `[context-in-tokens, choose-the-model]`.
12. ✍️ **Privacy e dati nelle API** (`going-deeper/privacy-in-apis`)
   Drafted IT + EN (2026-11-01). API vs consumer terms (hedged, "read the
   provider's terms"), minimisation and pseudonymisation with a redact/restore
   snippet (regex limits stated), GDPR in plain words (not legal advice), logs
   as personal data, key handling. Prereq `[from-chats-to-apis, prompt-injection]`.
13. ✍️ **Mini progetto end-to-end** (`going-deeper/mini-project`)
   Drafted IT + EN (2026-11-01). Module closer: "ask your documents" assistant
   in seven steps (model, system prompt, keyword retrieval, structured answer
   with sources, injection guard, 10-case eval, caching) plus an 8-item
   checklist. Prereq `[rag, evals, costs-and-caching]`.

**Decisions settled 2026-07-24** (with L1-L2): example stack = **both,
tabbed Python + TypeScript** (Starlight `<Tabs syncKey="lang">`, no new
dependency); code depth = **runnable but lean** (real copy-pasteable snippets
kept short, concepts explained around them, not full build-along tutorials).
Still open for L6: RAG as conceptual explanation vs a code walkthrough (decide
when writing it).

**Current status**: all 14 drafted (bridge lesson + 13; L7-L13 and the bridge on 2026-11-01). Earlier: 6 of 13 drafted (L1-L2 on 2026-07-24, L3-L4 and L5-L6 on
2026-07-27, IT + EN). Sidebar entries 1-6 unlocked in `astro.config.mjs`; the
"Per chi vuole di più" / "For people who want more" cards on the homepage and
start-here (IT + EN) activated and pointing to L1 (done at L1, not re-touched);
the Module 5 closer (`ethics-of-teaching` IT + EN) links "Modulo 6" to L1. The
forward refs inside L1-L4 (IT + EN) to the now-written L3/L4/L5/L6 are real
links. L1-L4 committed and deployed to production (through 3f93744). L5-L6 have
the draft + review check-in. Style-gate + reader-analysis still to run on
L3-L6.

## Module 7: Per mestiere (level `principiante`)

Target: non-technical people who do the same hands-on work every week in a
specific job. Persona-based structure: each chapter starts from a real weekly
task, shows it from raw notes to the finished document, and gives step-by-step
instructions on the tool that job really uses (Claude for the travel agency,
Copilot for the public sector). Tool facts are dated ("verificato a novembre
2026") and written generically where they could not be verified. Design:
`docs/superpowers/specs/2026-11-01-by-profession-design.md`.

Folder `src/content/docs/<lang>/by-profession/`, nested one level deeper than
other modules (`by-profession/<profession>/<slug>`). Sidebar: one group "Per
mestiere" with the entry page, the common lesson, and one collapsible subgroup
per profession.

- ✅ **Per mestiere** (`by-profession`): entry page, no `livello` (meta page),
  `<HomeCards>` of professions, link to the common lesson, invitation to
  propose other jobs via the About page.
- ✅ **Il tuo assistente di mestiere** (`by-profession/your-work-assistant`):
  common lesson. Creating a Project step by step in Claude (verified),
  generic in ChatGPT, Copilot custom instructions plus the Word-document
  fallback; instructions template; which files to upload and which not; how to
  update. Practice: the AI interviews the reader and hands back the Project
  instructions. Review included.

**Agenzia viaggi** (tool: Claude)

- ✅ **Prepara Claude per la tua agenzia** (`by-profession/travel-agency/start-here`)
- ✅ **Il preventivo personalizzato** (`by-profession/travel-agency/quote-from-template`)
- ✅ **L'itinerario controllato** (`by-profession/travel-agency/checked-itinerary`)
- ✅ **Il registro pagamenti in Excel** (`by-profession/travel-agency/payment-tracker`)

**Pubblica amministrazione** (tool: Copilot; EN keeps the Italian sources with a
note that the context is Italian public administration)

- ✅ **Cosa puoi fare con Copilot, e cosa no** (`by-profession/public-sector/start-here`)
- ✅ **Rispondere ai cittadini** (`by-profession/public-sector/citizen-replies`)
- ✅ **Verbali e circolari** (`by-profession/public-sector/minutes-and-circulars`)
- ✅ **Sistemare una lettera e verificare i fatti** (`by-profession/public-sector/fix-a-letter-check-facts`)

**Adding a profession** = a folder `by-profession/<profession>/` (IT + EN, plus
`public/skills/<lang>/` files), a collapsible subgroup in the "By profession"
sidebar group of `astro.config.mjs`, a card on `by-profession/index.mdx`, and
the slugs in the `'by-profession'` entry of `PATHS` in
`src/components/StudyPlanPrompt.astro`. Module label, progress, recap and
`llms.txt` pick up nested paths automatically (`lesson-data.ts`,
`progress.ts` and `Resume.astro` accept `<module>/<sub>/<slug>`).

## Cross-cutting pages (outside the modules)

- ✅ **Glossario** (`/it/glossary/`): technical terms (Allenamento
  [Training], Allucinazione [Hallucination], Contesto [Context], Freemium, IA [AI], LLM, Memoria [Memory], Modello [Model], Prompt)
  with a short definition and an "Explain it better with your AI" button
  that generates a prompt calibrated on the term.
- ✅ **Chi sono / About** (`/it/about/`, `/en/about/`): an authorial first-person
  page: what I do, where I come from, why AI-Guide. Includes
  `<MailtoComposer>` pointed at `ai-guide@larosa.work` for feedback collection and
  a link to LinkedIn + personal site. Linked from the footer (override
  `Footer.astro`) on every page.
- ✅ **Privacy del sito** (`/it/privacy/`, `/en/privacy/`): what the site
  itself collects (zero cookies, local `localStorage`, analytics via a
  Cloudflare proxy). Not to be confused with the *Quello che condividi quando
  usi l'IA* lesson (Module 1, lesson 6), which covers the reader's
  conversations with their own AI.
- 🆕 **FAQ**: privacy, costs, which AI to choose, what happens if the AI
  gets it wrong, the AI Act in a nutshell.
- 🆕 **Timeline** (optional): a short history of how we got here,
  narrative tone, not Wikipedia. An antidote to hype: "this isn't the first time
  AI has 'arrived'".

## Translation

**English live at 100% for the Fondamenti and Uso quotidiano modules**.
The EN translation of Module 2 progressed lesson by lesson in
step with the IT drafting (decision 2026-04-20): 8 out of 8
translated (*Chiedere bene* / *Ask well*, *Iterare la conversazione*
/ *Iterate the conversation*, *Capire una cosa complicata* /
*Understanding something complicated*, *Riassumere un documento
lungo* / *Summarize a long document*, *Imparare un argomento
nuovo* / *Learn something new*, *Scrivere meglio* / *Write better*,
*Foto, immagini e file* / *Photos, images, and files*, *Cose da
NON fare* / *Things NOT to do*).
Catalogs translated, mirror skill `.txt` files in
`public/skills/en/`, component UI strings in
`src/i18n/ui.ts`. To add a third language: add the entry
in `astro.config.mjs > locales` and in `src/i18n/ui.ts > STRINGS`,
mirror `src/content/docs/<lang>/` and `public/skills/<lang>/`.

The homepage and EN start-here cards for Module 2 were
activated with the publication of *Ask well* (commit b64e411,
2026-04-20) and point to the module's first EN lesson.

## Workflow for writing a lesson

1. Add the entry in the module with status ✍️ (in this file).
2. Draft in `src/content/docs/it/<sezione>/<slug>.mdx` following the voice guide.
3. `/analyze-lesson <path>` to generate reader questions.
4. Curate the generated questions in `analysis/<slug>.questions.md` (discard
   the ones that don't convince, add your own).
5. `/integrate-questions <path>` to apply the answers inline, as
   callouts, examples, or FAQ.
6. `style-checker` agent for final QA (em dash, AI patterns, voice).
7. Update the status to ✅ in this file, **in the same commit** that
   publishes the lesson.

## Next session

**Pending revisions**: none. Fondamenti module closed at 100% on
2026-04-19. Uso quotidiano module closed at 100% on 2026-04-23.
Sul lavoro module closed at 100% on 2026-04-25. Per studenti module
closed at 100% on 2026-05-13. Per docenti module closed at 100% on
2026-07-23.

**Module 5 (Per docenti)**: **complete, 9 out of 9 published**
(2026-07-23). Lessons 8 (**Quando lo studente usa l'IA**) and 9 (**Etica
del docente**) landed IT + EN with their `review-*.txt`, the sidebar
unlocked, and the now-stale forward references from L4/L5/L6 converted to
real links. Both omit "Approfondisci per la tua disciplina" (critical +
closing, not operational): only the end-of-lesson check-in. Full review
cycle done (5-agent style + coherence sweep, `analyze-lesson`,
`integrate-questions`). Structure validated in
`docs/superpowers/specs/2026-05-16-per-docenti-module-design.md`,
implementation plan in
`docs/superpowers/plans/2026-05-16-per-docenti-module.md`.

**Module 6 (Per chi vuole di più)**: in progress, **6 of 13 drafted**
(L1-L2 2026-07-24, L3-L4 and L5-L6 2026-07-27). L5 *Tool use, function calling,
structured output* and L6 *RAG: dare all'IA i tuoi documenti* landed IT + EN
with their `review-*.txt`, sidebar entries 5-6 unlocked, and the L1/L3/L4
forward refs to L5/L6 converted to real links. Module decisions settled: code
stack = both tabbed Python + TypeScript, depth = runnable but lean; L6 resolved
as concept-first + one minimal retrieval sketch. L1-L4 committed and deployed
(72f8ba0 + 3f93744); L5-L6 drafted with check-ins, style-gate + reader-analysis
still to run on L3-L6. Next up: L7 *Agenti*.

**Unlocking sidebar placeholders**: for every Module 5 lesson that
lands, replace the disabled placeholder entry in
`astro.config.mjs` with `{ slug: 'for-teachers/<slug>' }` in a
dedicated commit (a pattern already established with the "Unlock Module N lesson M
in sidebar" commits).

**Modules 3-6 audit (historical)**: gaps identified and covered in
modules 3, 4 (closed), 5 (in progress). For Module 6 see the provisional plan
in `CONTENT.md`.

## Picking up from another PC (Module 5 in progress)

Last state synced to `origin/main` on 2026-05-17. The commits
for lessons 3, 4, 5, 6, and 7 (2026-06-24) are **local on
`main`, not yet pushed**: run `git push origin main` to
make them available from another PC. To resume from another PC:

1. **Clone / pull** the repo, branch `main`.
2. **Environment setup**: Node 22 (pinned in `.nvmrc`). `npm install`
   takes about 3 minutes on the first run (sharp + pwa icons
   as a prebuild step).
3. **Build check**: `npm run build` (~60 sec). Smoke test that the
   site rebuilds clean (76+ pages expected).
4. **Start dev**: `npm run dev` at `http://localhost:4321`. To
   see the latest lesson: `/it/for-teachers/emails-to-families/`
   or `/en/for-teachers/emails-to-families/`.

**Module 5 context**:

- Phases A-H completed (scaffolding + lessons 1-7).
- Next: **Phase I, lesson 8 *Quando lo studente usa l'IA***
  (slug `for-teachers/when-students-use-ai`). No deepen: lessons
  8-9 only have the end-of-lesson check-in.
- Phase I brief in
  `docs/superpowers/plans/2026-05-16-per-docenti-module.md` section
  "Phase I".
- L8 frontmatter prerequisites: `[ask-well, when-to-trust-it]`.

**Editorial pattern established by Module 5 (to follow in L3 and
onward)**:

- Every operational lesson (1-7) closes with an "Approfondisci
  per la tua disciplina" section that uses `<LlmExercise variant="practice">`
  with the file `public/skills/<locale>/deepen-<slug>.txt`. The
  prompt schema in the `.txt` is standard: 4 questions to the AI (discipline,
  school level, concept/use case, specific constraints), then an
  operational application in phases A-E or A-D applied to the
  reader's case.
- End-of-lesson check-in with `<LlmExercise variant="review">` and
  a `review-<slug>.txt` file (4 progressive questions, as in the other
  modules).
- No cross-link to Module 4 (total independence, a spec decision).
- Anti-cheating thread in L5 and L6 (short callouts → dedicated L8).
- EN mirror in parallel with IT, not once the module is finished.
- Homepage + start-here cards already activated from L1 (don't redo it in L3).

**Lesson workflow (14-step summary)**:

1. CONTENT.md → ✍️ for the new lesson (absorbed by the IT commit)
2. IT draft in `src/content/docs/it/for-teachers/<slug>.mdx`
3. `/analyze-lesson <path>` → questions in `analysis/<slug>.questions.md`
4. `/integrate-questions <path>` → applies changes
5. **Deepen IT**: `public/skills/it/deepen-<slug>.txt` +
   `<LlmExercise variant="practice">` in the lesson
6. **Review IT**: `public/skills/it/review-<slug>.txt` +
   `<LlmExercise variant="review">` in the lesson
7. style-checker IT (a `general-purpose` subagent with a prompt that
   references `.claude/agents/style-checker.md`)
8. IT commit: `Module 5 lesson N: <titolo IT> + deepen and review exercises`
9. EN draft in `src/content/docs/en/for-teachers/<slug>.mdx`
10. Deepen EN: `public/skills/en/deepen-<slug>.txt`
11. Review EN: `public/skills/en/review-<slug>.txt`
12. style-checker EN (same pattern, with a focus on IT→EN calques)
13. EN commit: `Module 5 lesson N EN: <titolo EN> + deepen and review exercises`
14. Unlock sidebar in `astro.config.mjs` + CONTENT.md → ✅. Dedicated
    commit: `Unlock Module 5 lesson N in sidebar`

**Gitignored files (don't transfer between PCs)**: the `analysis/`
folder is ignored (`.gitignore`). Previous applied files
(`design-a-lesson.questions.applied.md`,
`explain-in-five-ways.questions.applied.md`) live only on the
local filesystem. On the new PC they'll start from scratch when you run
`/analyze-lesson` for the next lesson. Not an issue: they're
byproducts of the workflow, not necessary artifacts.

**Commits landed for Module 5** (in chronological order, from
oldest to most recent):

```
5082ed7 Add Module 5 'Per docenti' design spec
5df98fb Add Module 5 'Per docenti' implementation plan
01c0955 Scaffold Module 5 (Per docenti): 9-lesson plan, sidebar reordered, empty dirs
82b46ab Module 5 lesson 1: Progettare una lezione + deepen and review exercises
d20ed95 Module 5 lesson 1 EN: Design a lesson + deepen and review exercises
3a4fb37 Unlock Module 5 lesson 1 in sidebar
f67ccad Activate Module 5 cards on homepage and start-here (IT + EN)
412d09a Module 5 lesson 2: Spiegare in cinque modi diversi + deepen and review exercises
265620f Module 5 lesson 2 EN: Explain in five different ways + deepen and review exercises
b4856ee Unlock Module 5 lesson 2 in sidebar
c17df37 Module 5 lesson 3: Materiali differenziati per livello + deepen and review exercises
6c4f4f5 Module 5 lesson 3 EN: Differentiated materials by level + deepen and review exercises
ba484e0 Unlock Module 5 lesson 3 in sidebar
ada052f Module 5 lesson 4: Inclusivita BES e DSA + deepen and review exercises
57f3616 Module 5 lesson 4 EN: Inclusive materials (SEN) + deepen and review exercises
382184f Unlock Module 5 lesson 4 in sidebar
9f69915 Module 5 lesson 5: Domande per verifiche + deepen and review exercises (cherry-pick su main)
7da761a Module 5 lesson 5 EN: Generate assessment questions + deepen and review exercises
06e057a Unlock Module 5 lesson 5 in sidebar
1a83144 Module 5 lesson 6: Correggere con criterio + deepen and review exercises
c300f04 Module 5 lesson 6 EN: Grading with criteria + deepen and review exercises
c87dadd Unlock Module 5 lesson 6 in sidebar
d2e1988 Module 5 lesson 7: Comunicare con le famiglie + deepen and review exercises
905adaa Module 5 lesson 7 EN: Emails to families + deepen and review exercises
(questo commit) Unlock Module 5 lesson 7 in sidebar
```

**Branch note (2026-06-24 session)**: while writing L5, the main
working tree had been moved by the parallel workstream
(`feat/local-ai-assistant`, the in-browser AI assistant). The IT commit for
L5 had ended up by mistake on that branch (`f829409`) and was brought
back to `main` via cherry-pick (`9f69915`) in an isolated worktree
(`../AI-Guide-l5`), to avoid disturbing the other workstream. The commit
`f829409` stays on `feat/local-ai-assistant`: it gets deduplicated at merge time.
