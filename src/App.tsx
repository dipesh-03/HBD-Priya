import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from "react";
import { birthdayConfig, publicAsset } from "./config";

const dateNoLabels = ["No", "Are you sure?", "Think again", "Nice try", "Still no?", "Last chance"];
const confettiPieces = Array.from({ length: 36 }, (_, index) => index);
const ambiencePieces = Array.from({ length: 20 }, (_, index) => index);
const finaleSparkles = Array.from({ length: 10 }, (_, index) => index);
const bouquetFlowers = [
  { x: 50, height: 360, turn: -1, src: publicAsset("/flowers/rose.webp") },
  { x: 44, height: 345, turn: -6, src: publicAsset("/flowers/peony.webp") },
  { x: 56, height: 348, turn: 6, src: publicAsset("/flowers/cosmos.webp") },
  { x: 39, height: 324, turn: -10, src: publicAsset("/flowers/tulip.webp") },
  { x: 61, height: 328, turn: 10, src: publicAsset("/flowers/ranunculus.webp") },
  { x: 34, height: 304, turn: -13, src: publicAsset("/flowers/rose.webp") },
  { x: 66, height: 308, turn: 13, src: publicAsset("/flowers/peony.webp") },
  { x: 47, height: 318, turn: -3, src: publicAsset("/flowers/cosmos.webp") },
  { x: 53, height: 316, turn: 3, src: publicAsset("/flowers/tulip.webp") },
  { x: 31, height: 286, turn: -16, src: publicAsset("/flowers/ranunculus.webp") },
  { x: 69, height: 288, turn: 16, src: publicAsset("/flowers/rose.webp") },
  { x: 40, height: 295, turn: -8, src: publicAsset("/flowers/peony.webp") },
  { x: 60, height: 296, turn: 8, src: publicAsset("/flowers/cosmos.webp") },
  { x: 36, height: 275, turn: -12, src: publicAsset("/flowers/tulip.webp") },
  { x: 64, height: 276, turn: 12, src: publicAsset("/flowers/ranunculus.webp") }
] as const;

const birthdayLetterParagraphs = [
  "Happy Birthday.",
  "Some things feel too honest to keep only in my head, so I wanted to leave them here for you. The time I spend with you genuinely means a lot to me, and even the small moments stay with me more than I expect.",
  "There is something about us that feels easy, warm, and quietly special. The way we talk, laugh, and share little moments is something I truly value.",
  "I hope today makes you feel cared for, not just in a big birthday way, but in the small, honest ways too. I hope this year brings you peace on heavy days, laughter on ordinary days, and many more memories that we can smile about together.",
  "I am really grateful for you, and for us."
] as const;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

function Ambience() {
  return (
    <div className="ambience" aria-hidden="true">
      <div className="glow glow-one" />
      <div className="glow glow-two" />
      {ambiencePieces.map((piece) => (
        <span
          className={piece % 3 === 0 ? "petal" : "sparkle"}
          key={piece}
          style={
            {
              "--piece": piece,
              "--left": `${(piece * 37) % 96}%`,
              "--delay": `${(piece % 7) * -1.3}s`
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Gift({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  const openGift = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 850);
  };

  return (
    <button
      className={`gift ${opening ? "gift-opening" : ""}`}
      type="button"
      onClick={openGift}
      aria-label="Open your birthday gift"
    >
      <span className="gift-shadow" />
      <span className="gift-box">
        <span className="gift-ribbon-vertical" />
        <span className="gift-ribbon-horizontal" />
      </span>
      <span className="gift-lid">
        <span className="gift-ribbon-vertical" />
        <span className="gift-bow gift-bow-left" />
        <span className="gift-bow gift-bow-right" />
        <span className="gift-knot" />
      </span>
      <span className="gift-tag">open me</span>
    </button>
  );
}

function MusicButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const { song } = birthdayConfig;

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.7;
  }, []);

  if (!song.src) return null;

  const toggle = async () => {
    if (!audioRef.current) return;
    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch {
      setFailed(true);
      setPlaying(false);
    }
  };

  return (
    <div className="music-wrap">
      <audio
        ref={audioRef}
        src={song.src}
        preload="metadata"
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      <button className="music-button" type="button" onClick={toggle} disabled={failed}>
        <span aria-hidden="true">{failed ? "×" : playing ? "Ⅱ" : "♪"}</span>
        <span>{failed ? "Music unavailable" : playing ? "Pause music" : song.title}</span>
      </button>
    </div>
  );
}

function PhotoGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const goToPhoto = (index: number) => {
    const next = (index + birthdayConfig.photos.length) % birthdayConfig.photos.length;
    const card = galleryRef.current?.children[next] as HTMLElement | undefined;
    card?.scrollIntoView?.({ behavior: "smooth", block: "nearest", inline: "center" });
    setActivePhoto(next);
  };

  return (
    <section className="section photos-section" aria-labelledby="photos-title">
      <div className="section-heading">
        <span className="eyebrow">four little frames</span>
        <h2 id="photos-title">Some lovely things deserve a closer look.</h2>
        <p>Swipe, wander, or simply stay a while.</p>
      </div>

      <div className="photo-gallery" ref={galleryRef}>
        {birthdayConfig.photos.map((photo, index) => (
          <figure
            className="photo-card"
            key={`${photo.src}-${index}`}
            style={{ "--tilt": `${index % 2 === 0 ? -2.2 : 2.1}deg` } as CSSProperties}
          >
            <div className="photo-mat">
              <img src={photo.src} alt={photo.alt} loading={index > 0 ? "lazy" : "eager"} />
            </div>
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="gallery-controls" aria-label="Photo controls">
        <button type="button" onClick={() => goToPhoto(activePhoto - 1)} aria-label="Previous photo">
          ←
        </button>
        <div className="gallery-dots" aria-hidden="true">
          {birthdayConfig.photos.map((_, index) => (
            <span className={index === activePhoto ? "active" : ""} key={index} />
          ))}
        </div>
        <button type="button" onClick={() => goToPhoto(activePhoto + 1)} aria-label="Next photo">
          →
        </button>
      </div>
    </section>
  );
}

function DateInvitation({ onAccept }: { onAccept: () => void }) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [vanishing, setVanishing] = useState(false);
  const [gone, setGone] = useState(false);
  const [status, setStatus] = useState("Choose carefully.");

  const moveNo = (spatial: boolean) => {
    if (gone || attempts >= 5) return;
    const next = attempts + 1;
    setAttempts(next);

    if (spatial && !reducedMotion && arenaRef.current && noRef.current) {
      const arena = arenaRef.current.getBoundingClientRect();
      const button = noRef.current.getBoundingClientRect();
      const padding = 14;
      const bottom = arena.height - button.height - padding;
      const middle = Math.min(bottom, 128);
      const center = (arena.width - button.width) / 2;
      const points = [
        { x: arena.width - button.width - padding, y: bottom },
        { x: padding, y: bottom },
        { x: arena.width - button.width - padding, y: middle },
        { x: padding, y: middle },
        { x: center, y: bottom }
      ];
      const point = points[(next - 1) % points.length];
      setPosition({
        x: Math.max(padding, Math.min(point.x, arena.width - button.width - padding)),
        y: Math.max(padding, Math.min(point.y, arena.height - button.height - padding))
      });
    }

    if (next >= 5) {
      setStatus("The 'No' option has quietly disappeared.");
      const pause = reducedMotion ? 0 : 650;
      window.setTimeout(() => setVanishing(true), pause);
      window.setTimeout(() => setGone(true), pause + (reducedMotion ? 0 : 480));
      return;
    }

    setStatus(next < 3 ? "That answer seems a little unsure." : "The answer is getting harder to catch.");
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") moveNo(true);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") {
      event.preventDefault();
      moveNo(true);
    }
  };

  return (
    <section className="section question-section" aria-labelledby="date-invitation-title">
      <div className="question-card date-question-card">
        <span className="eyebrow">one small birthday invitation</span>
        <h2 id="date-invitation-title">{birthdayConfig.recipientName}, will you go out with me?</h2>
        <p className="question-subtitle">Good food, good music, and some time together. I will take care of the plan.</p>

        <div className="answer-arena" ref={arenaRef}>
          <button className={`royalty-button ${gone ? "centered" : ""}`} type="button" onClick={onAccept}>
            <span aria-hidden="true">✦</span>
            Yes, I would love to
          </button>
          {!gone && (
            <button
              ref={noRef}
              className={`normal-button ${vanishing ? "vanishing" : ""}`}
              style={position ? { left: position.x, top: position.y } : undefined}
              type="button"
              onPointerEnter={handlePointerEnter}
              onPointerDown={handlePointerDown}
              onClick={(event) => moveNo(event.detail !== 0)}
            >
              {dateNoLabels[Math.min(attempts, dateNoLabels.length - 1)]}
            </button>
          )}
        </div>
        <p className="answer-status" aria-live="polite">{status}</p>
      </div>
    </section>
  );
}

function Bouquet({ onFinale }: { onFinale: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    const flowerTimers = bouquetFlowers.map((_, index) =>
      window.setTimeout(() => setVisibleCount(index + 1), (index + 1) * 1900)
    );
    const completeTimer = window.setTimeout(() => setComplete(true), 30000);

    return () => {
      flowerTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completeTimer);
    };
  }, []);

  return (
    <section className="bouquet-section" aria-labelledby="bouquet-title">
      <div className="bouquet-copy">
        <span className="eyebrow">a little patience</span>
        <h2 id="bouquet-title">{complete ? `A bouquet for ${birthdayConfig.recipientName}.` : "Something beautiful is blooming..."}</h2>
        <p aria-live="polite">
          {complete
            ? noteOpen
              ? "A note for just us, tucked inside the flowers."
              : "There is one small note tucked into the ribbon."
            : "One stem, a few leaves, and then a flower. Watch it grow."}
        </p>
      </div>

      <div className={`bouquet-stage ${complete ? "bouquet-complete" : ""}`} aria-hidden="true">
        <div className="bouquet-glow" />
        {bouquetFlowers.map((flower, index) => (
          <div
            className={`bouquet-flower flower-type-${index % 3} ${index < visibleCount ? "flower-visible" : ""}`}
            key={index}
            style={
              {
                "--flower-x": `${flower.x}%`,
                "--flower-height": `${flower.height}px`,
                "--flower-turn": `${flower.turn}deg`,
                "--flower-order": index
              } as CSSProperties
            }
          >
            <img src={flower.src} alt="" />
          </div>
        ))}
        <div className="bouquet-paper bouquet-paper-left" />
        <div className="bouquet-paper bouquet-paper-right" />
        <div className="bouquet-ribbon"><span /></div>
        <div className="bouquet-note-peek">for you</div>
      </div>

      {complete && (
        <div className="bouquet-actions">
          {!noteOpen ? (
            <button className="seal-button bouquet-note-button" type="button" onClick={() => setNoteOpen(true)}>
              Open the note
              <span aria-hidden="true">*</span>
            </button>
          ) : (
            <div className="letter-wrap">
              <article className="birthday-letter" aria-label="A birthday note for Priya">
                <span className="eyebrow">a small note</span>
                <h3>For you</h3>
                {birthdayLetterParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <div className="letter-signature" aria-label="With warmth, Dipesh and Priya"><span>With warmth,</span><strong>Dipesh</strong><span className="letter-heart" aria-hidden="true" /><strong>Priya</strong></div>
              </article>
              <button className="seal-button bouquet-finale-button" type="button" onClick={onFinale}>
                See the birthday wish
                <span aria-hidden="true">*</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Finale() {
  return (
    <section className="finale" aria-labelledby="finale-title">
      <div className="confetti" aria-hidden="true">
        {confettiPieces.map((piece) => (
          <span
            key={piece}
            style={
              {
                "--confetti": piece,
                "--x": `${(piece * 47) % 100}%`,
                "--delay": `${(piece % 8) * 0.12}s`
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="finale-sparkles" aria-hidden="true">
        {finaleSparkles.map((sparkle) => (
          <span
            key={sparkle}
            style={
              {
                "--sparkle-x": `${(sparkle * 31 + 7) % 94}%`,
                "--sparkle-y": `${(sparkle * 47 + 11) % 86}%`,
                "--sparkle-delay": `${(sparkle % 5) * 0.32}s`
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="finale-flower" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span style={{ "--petal-index": index } as CSSProperties} key={index} />
        ))}
      </div>

      <div className="finale-copy">
        <span className="eyebrow">and now, the important part</span>
        <h2 id="finale-title">Happy Birthday,<br />{birthdayConfig.recipientName}.</h2>
        <p>{birthdayConfig.closingMessage}</p>
      </div>

      <div className="finale-collage" aria-label="Birthday photo collage">
        {birthdayConfig.photos.map((photo, index) => {
          const displayPhoto =
                index === 0
                  ? birthdayConfig.photos[1] // photo3 -> position1
                  : index === 1
                  ? birthdayConfig.photos[2] // photo1 -> position2
                  : index === 2
                  ? birthdayConfig.photos[0] // photo2 -> position3
                  : photo;

          return (
            <div
              className={`collage-photo collage-photo-${index + 1}`}
              key={`${displayPhoto.src}-finale`}
            >
              <img src={displayPhoto.src} alt="" />
            </div>
          );
        })}
        <div className="collage-center" aria-hidden="true">
          with love<br />& a little magic
        </div>
      </div>

      <p className="final-note">Today looks rather good on you.</p>
    </section>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [bouquetVisible, setBouquetVisible] = useState(false);
  const [finaleVisible, setFinaleVisible] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const bouquetRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);

  const openExperience = () => {
    setOpened(true);
    window.setTimeout(() => mainRef.current?.focus(), 120);
  };

  const revealBouquet = () => {
    setBouquetVisible(true);
    window.setTimeout(
      () => bouquetRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }),
      120
    );
  };

  const revealFinale = () => {
    setFinaleVisible(true);
    window.setTimeout(
      () => finaleRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }),
      120
    );
  };

  return (
    <div className={`app-shell ${opened ? "experience-open" : "invitation-open"}`}>
      <Ambience />
      <MusicButton />

      {!opened && (
        <main className="invitation" aria-labelledby="invitation-title">
          <div className="invitation-copy">
            <span className="eyebrow">a tiny celebration</span>
            <h1 id="invitation-title">For {birthdayConfig.recipientName}</h1>
            <p>Something lovely is waiting.</p>
          </div>
          <Gift onOpen={openExperience} />
          <span className="open-hint">tap the gift to begin</span>
        </main>
      )}

      {opened && (
        <main className="experience" ref={mainRef} tabIndex={-1}>
          <header className="hero">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <div className="hero-copy">
              <span className="eyebrow">made for one very important day</span>
              <h1>A little<br /><em>birthday magic.</em></h1>
              <p>No speeches. No sensible decisions. Just a small corner of the internet behaving beautifully for you.</p>
              <a href="#the-lovely-bits" className="scroll-link">
                begin the celebration <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-seal" aria-hidden="true">
              <span>JULY</span>
              <strong>02</strong>
              <span>CELEBRATE</span>
            </div>
          </header>

          <div id="the-lovely-bits">
            <PhotoGallery />
          </div>
          <DateInvitation onAccept={revealBouquet} />

          {bouquetVisible && (
            <div className="reveal-wrap" ref={bouquetRef}>
              <Bouquet onFinale={revealFinale} />
            </div>
          )}

          {finaleVisible && (
            <div className="reveal-wrap" ref={finaleRef}>
              <Finale />
            </div>
          )}
        </main>
      )}
    </div>
  );
}
