import { useEffect, useRef } from "react";

function BackgroundFX({ mouse = { x: 50, y: 50 } }) {
  const canvasRef = useRef(null);

  /*
   * Keep the latest mouse position without
   * restarting the canvas animation.
   */
  const mouseRef = useRef(mouse);

  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    let animationFrame;
    let stars = [];

    let width = 0;
    let height = 0;

    /*
     * Current cursor position.
     *
     * This moves slowly toward targetMouse,
     * creating a smooth cinematic effect.
     */
    const mousePosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    /*
     * Actual target position of the cursor.
     */
    const targetMouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    /*
     * Galaxy settings
     */
    const STAR_COUNT = 260;

    const CONNECTION_DISTANCE = 110;

    /*
     * Slightly smaller interaction area.
     */
    const MOUSE_RADIUS = 170;

    /*
     * Lower = slower cursor reaction.
     *
     * Previous value:
     * 0.035
     *
     * New value:
     * 0.022
     */
    const MOUSE_SMOOTHING = 0.022;

    /*
     * Lower = gentler star movement.
     */
    const STAR_REACTION_FORCE = 10;

    function resizeCanvas() {
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      createStars();
    }

    function createStars() {
      stars = [];

      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,

          baseX: Math.random() * width,
          baseY: Math.random() * height,

          /*
           * Most stars are tiny.
           * A few are slightly larger.
           */
          radius:
            Math.random() < 0.82
              ? Math.random() * 1.1 + 0.25
              : Math.random() * 1.8 + 0.8,

          /*
           * Natural brightness.
           */
          alpha:
            Math.random() * 0.65 + 0.2,

          /*
           * Very slow natural movement.
           */
          speed:
            Math.random() * 0.0008 + 0.0002,

          phase:
            Math.random() * Math.PI * 2,

          drift:
            Math.random() * 0.4 + 0.1,
        });
      }
    }

    function updateMouseFromProps() {
      /*
       * Read the latest mouse position from
       * the ref instead of restarting the effect.
       */
      const currentMouse = mouseRef.current;

      targetMouse.x =
        (currentMouse.x / 100) * width;

      targetMouse.y =
        (currentMouse.y / 100) * height;
    }

    function drawNebula() {
      /*
       * -----------------------------------------
       * NEBULA 1
       * -----------------------------------------
       */

      const nebulaOne =
        ctx.createRadialGradient(
          width * 0.12,
          height * 0.25,
          0,
          width * 0.12,
          height * 0.25,
          width * 0.45
        );

      nebulaOne.addColorStop(
        0,
        "rgba(37, 99, 235, 0.10)"
      );

      nebulaOne.addColorStop(
        0.45,
        "rgba(30, 64, 175, 0.035)"
      );

      nebulaOne.addColorStop(
        1,
        "rgba(2, 6, 23, 0)"
      );

      ctx.fillStyle = nebulaOne;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /*
       * -----------------------------------------
       * NEBULA 2
       * -----------------------------------------
       */

      const nebulaTwo =
        ctx.createRadialGradient(
          width * 0.86,
          height * 0.72,
          0,
          width * 0.86,
          height * 0.72,
          width * 0.42
        );

      nebulaTwo.addColorStop(
        0,
        "rgba(79, 70, 229, 0.08)"
      );

      nebulaTwo.addColorStop(
        0.5,
        "rgba(59, 130, 246, 0.025)"
      );

      nebulaTwo.addColorStop(
        1,
        "rgba(2, 6, 23, 0)"
      );

      ctx.fillStyle = nebulaTwo;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    }

    function drawGalaxyDust() {
      /*
       * Subtle diagonal atmospheric light.
       */
      const gradient =
        ctx.createLinearGradient(
          0,
          height,
          width,
          0
        );

      gradient.addColorStop(
        0,
        "rgba(30, 64, 175, 0.015)"
      );

      gradient.addColorStop(
        0.5,
        "rgba(96, 165, 250, 0.035)"
      );

      gradient.addColorStop(
        1,
        "rgba(79, 70, 229, 0.015)"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );
    }

    function updateStars(time) {
      /*
       * -----------------------------------------
       * SMOOTH CURSOR MOVEMENT
       * -----------------------------------------
       *
       * The cursor target moves immediately,
       * but the visual interaction follows slowly.
       */
      mousePosition.x +=
        (targetMouse.x -
          mousePosition.x) *
        MOUSE_SMOOTHING;

      mousePosition.y +=
        (targetMouse.y -
          mousePosition.y) *
        MOUSE_SMOOTHING;

      stars.forEach((star) => {
        /*
         * ---------------------------------------
         * NATURAL STAR DRIFT
         * ---------------------------------------
         */

        star.x =
          star.baseX +
          Math.sin(
            time * star.speed +
              star.phase
          ) *
            star.drift;

        star.y =
          star.baseY +
          Math.cos(
            time * star.speed +
              star.phase
          ) *
            star.drift;

        /*
         * ---------------------------------------
         * CURSOR INTERACTION
         * ---------------------------------------
         */

        const dx =
          star.x -
          mousePosition.x;

        const dy =
          star.y -
          mousePosition.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        if (
          distance < MOUSE_RADIUS
        ) {
          const strength =
            1 -
            distance /
              MOUSE_RADIUS;

          /*
           * Smooth falloff.
           */
          const force =
            strength *
            strength *
            STAR_REACTION_FORCE;

          if (distance > 0) {
            star.x +=
              (dx / distance) *
              force;

            star.y +=
              (dy / distance) *
              force;
          }
        }
      });
    }

    function drawStars() {
      stars.forEach((star) => {
        const dx =
          star.x -
          mousePosition.x;

        const dy =
          star.y -
          mousePosition.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        /*
         * How close the star is to
         * the cursor.
         */
        const interaction =
          Math.max(
            0,
            1 -
              distance /
                MOUSE_RADIUS
          );

        /*
         * Slight brightness increase.
         */
        const alpha =
          star.alpha +
          interaction * 0.45;

        /*
         * Slight size increase.
         */
        const radius =
          star.radius +
          interaction * 0.9;

        /*
         * ---------------------------------------
         * STAR GLOW
         * ---------------------------------------
         */

        if (
          interaction > 0.05
        ) {
          const glow =
            ctx.createRadialGradient(
              star.x,
              star.y,
              0,
              star.x,
              star.y,
              radius * 8
            );

          glow.addColorStop(
            0,
            `rgba(96, 165, 250, ${Math.min(
              alpha,
              0.8
            )})`
          );

          glow.addColorStop(
            0.3,
            `rgba(59, 130, 246, ${
              interaction * 0.24
            })`
          );

          glow.addColorStop(
            1,
            "rgba(59, 130, 246, 0)"
          );

          ctx.fillStyle = glow;

          ctx.beginPath();

          ctx.arc(
            star.x,
            star.y,
            radius * 8,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }

        /*
         * ---------------------------------------
         * STAR CORE
         * ---------------------------------------
         */

        ctx.beginPath();

        ctx.arc(
          star.x,
          star.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(191, 219, 254, ${Math.min(
            alpha,
            1
          )})`;

        ctx.fill();
      });
    }

    function drawConnections() {
      /*
       * Constellation connections.
       *
       * These remain extremely subtle.
       */
      for (
        let i = 0;
        i < stars.length;
        i++
      ) {
        for (
          let j = i + 1;
          j < stars.length;
          j++
        ) {
          const first =
            stars[i];

          const second =
            stars[j];

          const dx =
            first.x -
            second.x;

          const dy =
            first.y -
            second.y;

          const distance =
            Math.sqrt(
              dx * dx +
                dy * dy
            );

          if (
            distance >
            CONNECTION_DISTANCE
          ) {
            continue;
          }

          const midpointX =
            (first.x +
              second.x) /
            2;

          const midpointY =
            (first.y +
              second.y) /
            2;

          const mouseDistance =
            Math.sqrt(
              Math.pow(
                midpointX -
                  mousePosition.x,
                2
              ) +
                Math.pow(
                  midpointY -
                    mousePosition.y,
                  2
                )
            );

          const mouseInfluence =
            Math.max(
              0,
              1 -
                mouseDistance /
                  MOUSE_RADIUS
            );

          const opacity =
            0.025 +
            mouseInfluence *
              0.09;

          ctx.beginPath();

          ctx.moveTo(
            first.x,
            first.y
          );

          ctx.lineTo(
            second.x,
            second.y
          );

          ctx.strokeStyle =
            `rgba(96, 165, 250, ${opacity})`;

          ctx.lineWidth =
            mouseInfluence > 0.2
              ? 0.55
              : 0.3;

          ctx.stroke();
        }
      }
    }

    function drawCursorGlow() {
      /*
       * Very subtle cursor atmosphere.
       */
      const glow =
        ctx.createRadialGradient(
          mousePosition.x,
          mousePosition.y,
          0,
          mousePosition.x,
          mousePosition.y,
          MOUSE_RADIUS
        );

      glow.addColorStop(
        0,
        "rgba(59, 130, 246, 0.035)"
      );

      glow.addColorStop(
        0.45,
        "rgba(59, 130, 246, 0.014)"
      );

      glow.addColorStop(
        1,
        "rgba(59, 130, 246, 0)"
      );

      ctx.fillStyle = glow;

      ctx.beginPath();

      ctx.arc(
        mousePosition.x,
        mousePosition.y,
        MOUSE_RADIUS,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    function animate(time) {
      /*
       * Clear previous frame.
       */
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /*
       * Update cursor target.
       */
      updateMouseFromProps();

      /*
       * Base background.
       */
      ctx.fillStyle = "#020617";

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /*
       * Background layers.
       */
      drawNebula();

      drawGalaxyDust();

      /*
       * Stars.
       */
      updateStars(time);

      drawConnections();

      drawStars();

      /*
       * Cursor atmosphere.
       */
      drawCursorGlow();

      animationFrame =
        requestAnimationFrame(
          animate
        );
    }

    /*
     * Initial setup.
     */
    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    animationFrame =
      requestAnimationFrame(
        animate
      );

    /*
     * Cleanup.
     */
    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      cancelAnimationFrame(
        animationFrame
      );
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* Canvas starfield */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      {/* Atmospheric overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(2,6,23,0.12)_45%,rgba(2,6,23,0.5)_100%)]" />

      {/* Subtle galaxy gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(30,64,175,0.025),transparent_35%,rgba(79,70,229,0.025)_75%,transparent)]" />

      {/* Soft central light */}
      <div className="absolute left-1/2 top-[32%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/[0.025] blur-[120px]" />

    </div>
  );
}

export default BackgroundFX;