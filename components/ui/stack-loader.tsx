// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { SplitText } from "gsap/dist/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const INTRO_EASE = "cubic-bezier(0.25,1,0.5,1)";
const IMAGE_ENTRY_Y_PERCENT = 500;
const TEXT_ROTATE_X_START = 90;
const TEXT_TRANSFORM_PERSPECTIVE = 1000;
const IMAGE_Z_INDEX_DURATION = 0.1;
const IMAGE_Z_INDEX_STAGGER = 0.2;
const TEXT_STAGGER = 0.08;
const STACK_SCALE_STEP = 0.15;
const STACK_Y_PERCENT_STEP = 20;
const SPREAD_Y_PERCENT_STEP = 110;
const IMAGE_FADE_STAGGER = 0.08;

// WOCHA Product Images (Only the "1" named product images)
export const WOCHA_PRODUCT_1_IMAGES = [
  "/street wear/f1-redbull/1.png",
  "/street wear/hotwheels/1.png",
  "/street wear/holy-sprit/1.png",
  "/gym wear/SPORTS-DROPSHOULDER/1.png",
  "/gym wear/gym-wear-2/1.png",
  "/Desing wear/black-shirt/1.png",
  "/Desing wear/red-shirt/1.png",
];

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numericValue));
}

interface StackToSpreadIntroProps {
  images?: string[];
  imageSize?: number;
  duration?: number;
  fadeOutDuration?: number;
  backgroundColor?: string;
  textLeft?: string;
  textRight?: string;
  textDescription?: string;
  onComplete?: () => void;
}

const StackToSpreadIntro = forwardRef<HTMLElement, StackToSpreadIntroProps>(
  function StackToSpreadIntro(
  {
    images = WOCHA_PRODUCT_1_IMAGES,
    imageSize = 1,
    duration = 1,
    fadeOutDuration = 0.8,
    backgroundColor = "var(--color-background, #fcfcfc)",
    textLeft = "WOCHA ATELIER",
    textRight = "ARCHITECTURAL APPAREL",
    textDescription = "WOCHA ARCHIVE — 2026",
    onComplete,
  },
  ref
) {
  const uid = useId().replace(/:/g, "");
  const loaderWrapperId = `loader-wrapper-${uid}`;
  const imgsWrapperId = `imgs-wrapper-${uid}`;
  const rootRef = useRef<HTMLElement | null>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const text1Ref = useRef<HTMLParagraphElement | null>(null);
  const text2Ref = useRef<HTMLParagraphElement | null>(null);
  const descriptionTextRef = useRef<HTMLParagraphElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  const safeImageSize = clampNumber(imageSize, 0.5, 4, 1.2);
  const safeDuration = clampNumber(duration, 0.25, 3, 1);
  const safeFadeOutDuration = clampNumber(fadeOutDuration, 0.1, 3, 0.8);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
      false;

    // Reduced-motion: images already in a vertical line - smooth opacity only.
    if (reduceMotion) {
      const ctx = gsap.context(() => {
        const imageElements = imagesRef.current.filter(Boolean);
        const sideText = [text1Ref.current, text2Ref.current].filter(Boolean);
        const description = descriptionTextRef.current;
        const totalImages = imageElements.length;
        const totalSpread =
          totalImages > 1 ? SPREAD_Y_PERCENT_STEP * (totalImages - 1) : 0;

        gsap.set(`#${imgsWrapperId}`, { yPercent: 0, opacity: 1 });
        gsap.set(imageElements, {
          opacity: 0,
          scale: 1,
          zIndex: (index: number) => index,
          yPercent: (index: number) =>
            totalImages === 1
              ? 0
              : -totalSpread / 2 + index * SPREAD_Y_PERCENT_STEP,
        });
        gsap.set(sideText, { opacity: 0, rotateX: 0 });
        if (description) gsap.set(description, { opacity: 0, rotateX: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            gsap.set(rootRef.current, { display: "none" });
            onCompleteRef.current?.();
          },
        });
        tl.timeScale(1 / safeDuration);

        // Smooth opacity in (already laid out vertically).
        tl.to(imageElements, {
          opacity: 1,
          duration: 0.7,
          stagger: { each: 0.06, from: "center" },
        });

        tl.to(
          sideText,
          { opacity: 1, duration: 0.55 },
          "-=0.35"
        );
        if (description) {
          tl.to(description, { opacity: 1, duration: 0.55 }, "<");
        }

        tl.to(
          [...sideText, description].filter(Boolean),
          { opacity: 0, duration: 0.5 },
          "+=0.55"
        );
        tl.to(
          imageElements,
          {
            opacity: 0,
            duration: safeFadeOutDuration,
            stagger: { each: 0.04, from: "edges" },
          },
          "-=0.15"
        );
        tl.to(rootRef.current, { opacity: 0, duration: safeFadeOutDuration }, "-=0.2");
      }, rootRef);

      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      const imageElements = imagesRef.current.filter(Boolean);

      let text1: any;
      let text2: any;
      let descriptionText: any;

      try {
        text1 = SplitText.create(text1Ref.current, {
          type: "words",
        });

        text2 = SplitText.create(text2Ref.current, {
          type: "words",
        });

        descriptionText = SplitText.create(descriptionTextRef.current, {
          type: "words,lines",
        });
      } catch (e) {
        // Fallback if SplitText is unavailable
        text1 = { words: text1Ref.current, revert: () => {} };
        text2 = { words: text2Ref.current, revert: () => {} };
        descriptionText = { lines: descriptionTextRef.current, revert: () => {} };
      }

      const animatedTextTargets = [
        text1.words,
        text2.words,
        descriptionText.lines,
      ];

      gsap.set(animatedTextTargets, {
        rotateX: TEXT_ROTATE_X_START,
        opacity: 0,
        transformPerspective: TEXT_TRANSFORM_PERSPECTIVE,
        transformOrigin: "50% 100%",
        willChange: "transform",
      });

      gsap.set(imageElements, {
        opacity: 0,
      });

      gsap.set(descriptionTextRef.current, {
        opacity: 1,
      });

      const tl = gsap.timeline();
      tl.timeScale(1 / safeDuration);

      tl.fromTo(
        `#${imgsWrapperId}`,
        {
          yPercent: IMAGE_ENTRY_Y_PERCENT,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: INTRO_EASE,
        }
      );

      tl.set([text1Ref.current, text2Ref.current], { opacity: 1 }, "<");

      tl.to(
        imageElements,
        {
          opacity: 1,
          duration: 0.5,
          ease: INTRO_EASE,
        },
        "<"
      );

      tl.to(
        animatedTextTargets,
        {
          rotateX: 0,
          opacity: 1,
          stagger: TEXT_STAGGER,
          ease: INTRO_EASE,
        },
        "<+0.5"
      );

      imageElements.forEach((imageElement, index) => {
        tl.to(
          imageElement,
          {
            zIndex: index,
            duration: IMAGE_Z_INDEX_DURATION,
            ease: INTRO_EASE,
          },
          index * IMAGE_Z_INDEX_STAGGER
        );
      });

      tl.to(
        imageElements,
        {
          scale: (index: number) => 1 + index * STACK_SCALE_STEP,
          yPercent: (index: number) => -(index * STACK_Y_PERCENT_STEP),
          duration: 1,
          stagger: {
            each: 0.01,
            from: "end",
          },
          ease: "power3.inOut",
        },
        "<"
      );

      tl.to(
        imageElements,
        {
          scale: 1,
          yPercent: (index: number, _target: unknown, elements: unknown[]) => {
            const totalImages = elements.length;

            if (totalImages === 1) return 0;

            const totalSpread = SPREAD_Y_PERCENT_STEP * (totalImages - 1);

            return -totalSpread / 2 + index * SPREAD_Y_PERCENT_STEP;
          },
          duration: 1,
          stagger: {
            each: 0.01,
            from: "end",
          },
          ease: "power3.inOut",
        },
        "+=0.2"
      );

      tl.to(
        descriptionText.lines,
        {
          rotateX: TEXT_ROTATE_X_START,
          transformOrigin: "top center",
          opacity: 0,
          duration: 1,
          stagger: TEXT_STAGGER,
          ease: INTRO_EASE,
        },
        "<-0.1"
      );

      tl.to(
        `#${imgsWrapperId}`,
        {
          yPercent: 0,
          ease: INTRO_EASE,
        },
        "<"
      );

      tl.to([text1.words, text2.words], {
        opacity: 0,
        duration: 0.5,
        rotateX: TEXT_ROTATE_X_START,
        transformOrigin: "top center",
        stagger: TEXT_STAGGER,
        ease: INTRO_EASE,
      });

      tl.to(
        imageElements,
        {
          opacity: 0,
          duration: safeFadeOutDuration,
          stagger: {
            each: IMAGE_FADE_STAGGER,
            from: "end",
          },
          onComplete: () => {
            gsap.to(rootRef.current, {
              opacity: 0,
              duration: safeFadeOutDuration,
              ease: INTRO_EASE,
              onComplete: () => {
                gsap.set(rootRef.current, {
                  display: "none",
                });

                onCompleteRef.current?.();
              },
            });
          },
        },
        "<+0.2"
      );

      return () => {
        text1?.revert?.();
        text2?.revert?.();
        descriptionText?.revert?.();
      };
    }, rootRef);

    return () => ctx.revert();
  }, [imgsWrapperId, safeDuration, safeFadeOutDuration]);

  return (
    <section
      ref={(element) => {
        rootRef.current = element;

        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
      id={loaderWrapperId}
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center px-[2.5vw] text-foreground max-[1025px]:px-[5vw] max-md:px-[6vw] pointer-events-auto"
      style={{ backgroundColor }}
    >
      <div className="flex w-full items-center justify-between max-[1025px]:flex-col max-[1025px]:justify-center max-[1025px]:gap-[33vh] max-md:gap-[70vw]">
        <p
          ref={text1Ref}
          className="opacity-0 font-mono tracking-widest text-xs uppercase max-[1025px]:text-[2.8vw] max-md:text-[4.5vw] text-[#111111]"
        >
          {textLeft}
        </p>

        <div
          id={imgsWrapperId}
          className="relative max-[1025px]:z-99 shrink-0"
          style={{
            width: `clamp(14rem, ${20 * safeImageSize}vw, 30rem)`,
            height: `clamp(16rem, ${23 * safeImageSize}vw, 34rem)`,
          }}
        >
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              ref={(element) => {
                imagesRef.current[index] = element;
              }}
              className="absolute top-0 left-0 size-full overflow-hidden rounded-2xl bg-[#F4F4F2] border border-[#E5E3DD] shadow-2xl opacity-0 p-2 sm:p-3 flex items-center justify-center"
            >
              <img
                src={encodeURI(src)}
                width={800}
                height={800}
                className="h-full w-full object-contain object-center drop-shadow-sm"
                alt={`wocha-loader-piece-${index}`}
              />
            </div>
          ))}
        </div>

        <p
          ref={text2Ref}
          className="opacity-0 font-mono tracking-widest text-xs uppercase max-[1025px]:text-[2.8vw] max-md:text-[4vw] text-[#111111]"
        >
          {textRight}
        </p>
      </div>

      <p
        ref={descriptionTextRef}
        className="absolute bottom-[3vw] left-1/2 w-[40vw] -translate-x-1/2 text-center font-mono text-[11px] tracking-widest uppercase leading-[1.1] text-[#6B6B6B] opacity-0 max-[1025px]:bottom-[3vw] max-[1025px]:w-[68vw] max-[1025px]:text-[2.4vw] max-md:bottom-[6vw] max-md:w-[90%] max-md:text-[3.5vw]"
      >
        {textDescription}
      </p>
    </section>
  );
  }
);

export interface StackLoaderProps {
  /** Content revealed once the loader completes — behind the loader from the start, uncovered as it fades out. */
  children?: ReactNode;
  /** Called once the loader finishes and the stack has faded out. */
  onComplete?: () => void;
  images?: string[];
  imageSize?: number;
  duration?: number;
  fadeOutDuration?: number;
  backgroundColor?: string;
  textLeft?: string;
  textRight?: string;
  textDescription?: string;
}

export default function StackLoader({
  children,
  onComplete,
  images = WOCHA_PRODUCT_1_IMAGES,
  imageSize = 1,
  duration = 1,
  fadeOutDuration = 0.8,
  backgroundColor = "var(--color-background, #FAFAF8)",
  textLeft = "WOCHA ATELIER",
  textRight = "ARCHITECTURAL APPAREL",
  textDescription = "WOCHA ARCHIVE — 2026",
}: StackLoaderProps) {
  const uid = useId().replace(/:/g, "");
  const demoUiId = `demo-ui-${uid}`;
  const [introInstance, setIntroInstance] = useState(0);
  const stackToSpreadIntroRef = useRef<HTMLElement | null>(null);
  const previousRemixerPropsRef = useRef<Required<
    Omit<StackLoaderProps, "children" | "onComplete" | "images" | "textLeft" | "textRight" | "textDescription">
  > | null>(null);

  const handleLoaderComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const remixerProps = {
      imageSize,
      duration,
      fadeOutDuration,
      backgroundColor,
    };

    if (!previousRemixerPropsRef.current) {
      previousRemixerPropsRef.current = remixerProps;
      return;
    }

    const previousRemixerProps = previousRemixerPropsRef.current;
    const hasChanged = (
      Object.keys(remixerProps) as (keyof typeof remixerProps)[]
    ).some((key) => previousRemixerProps[key] !== remixerProps[key]);

    if (!hasChanged) return;

    previousRemixerPropsRef.current = remixerProps;
    setIntroInstance((currentInstance) => currentInstance + 1);
  }, [backgroundColor, duration, fadeOutDuration, imageSize]);

  return (
    <div
      id={demoUiId}
      className="relative w-full min-h-screen bg-background"
    >
      {children}

      <StackToSpreadIntro
        key={introInstance}
        ref={stackToSpreadIntroRef}
        images={images}
        imageSize={imageSize}
        duration={duration}
        fadeOutDuration={fadeOutDuration}
        backgroundColor={backgroundColor}
        textLeft={textLeft}
        textRight={textRight}
        textDescription={textDescription}
        onComplete={handleLoaderComplete}
      />
    </div>
  );
}
