/**
 * ABDELRAHMAN SHEHATA ELSAYED - CYBER PORTFOLIO
 * RADAR & BACKGROUND CANVAS VISUALIZER
 * Implements interactive background network constellation + SOC Command Radar screen
 */

(function () {
  'use strict';

  // ==========================================
  // 1. BACKGROUND CANVAS - Constellation & Packets
  // ==========================================
  const bgCanvas = document.getElementById('cyber-bg-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    const maxDistance = 140;

    let mouse = {
      x: null,
      y: null,
      radius: 120
    };

    function resizeBg() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeBg);
    resizeBg();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.8;
        this.baseColor = Math.random() > 0.85 ? 'rgba(255, 30, 56, ' : 'rgba(220, 38, 38, ';
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction: slight repellent or attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor + this.alpha + ')';
        ctx.shadowColor = 'rgba(255, 30, 56, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateBg() {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 30, 56, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateBg);
    }

    animateBg();
  }

  // ==========================================
  // 2. SOC COMMAND RADAR SCREEN (Hero Widget)
  // ==========================================
  const radarCanvas = document.getElementById('soc-radar-screen');
  if (radarCanvas) {
    const rCtx = radarCanvas.getContext('2d');
    const rWidth = radarCanvas.width;
    const rHeight = radarCanvas.height;
    const centerX = rWidth / 2;
    const centerY = rHeight / 2;
    const maxRadius = Math.min(centerX, centerY) - 15;

    let scanAngle = 0;
    const sweepSpeed = 0.024; // Radians per frame

    // Simulated blips / endpoints
    const blips = [
      { angle: 0.8, distance: 0.65, label: 'SYS_01 (Wazuh)', alpha: 0, life: 1 },
      { angle: 2.1, distance: 0.45, label: 'GATEWAY_FW', alpha: 0, life: 1 },
      { angle: 3.7, distance: 0.85, label: 'EXT_SRC (Threat)', alpha: 0, life: 1, isThreat: true },
      { angle: 4.9, distance: 0.35, label: 'SURICATA_IDS', alpha: 0, life: 1 },
      { angle: 5.6, distance: 0.72, label: 'SPLUNK_IDX', alpha: 0, life: 1 }
    ];

    function drawRadar() {
      rCtx.clearRect(0, 0, rWidth, rHeight);

      // Radar Concentric Circles
      rCtx.strokeStyle = 'rgba(255, 30, 56, 0.22)';
      rCtx.lineWidth = 1;

      for (let r = 1; r <= 3; r++) {
        rCtx.beginPath();
        rCtx.arc(centerX, centerY, (maxRadius / 3) * r, 0, Math.PI * 2);
        rCtx.stroke();
      }

      // Crosshairs
      rCtx.beginPath();
      rCtx.moveTo(centerX - maxRadius, centerY);
      rCtx.lineTo(centerX + maxRadius, centerY);
      rCtx.moveTo(centerX, centerY - maxRadius);
      rCtx.lineTo(centerX, centerY + maxRadius);
      rCtx.strokeStyle = 'rgba(255, 30, 56, 0.15)';
      rCtx.stroke();

      // Sweeping Beam Wedge
      scanAngle += sweepSpeed;
      if (scanAngle > Math.PI * 2) {
        scanAngle -= Math.PI * 2;
      }

      const sweepSegments = 25;
      const sweepAngleSpan = 0.55; // Radians wide

      for (let s = 0; s < sweepSegments; s++) {
        const segAngle = scanAngle - (sweepAngleSpan * s) / sweepSegments;
        const segAlpha = (1 - s / sweepSegments) * 0.28;

        rCtx.beginPath();
        rCtx.moveTo(centerX, centerY);
        rCtx.arc(
          centerX,
          centerY,
          maxRadius,
          segAngle - 0.03,
          segAngle,
          false
        );
        rCtx.closePath();
        rCtx.fillStyle = `rgba(255, 30, 56, ${segAlpha})`;
        rCtx.fill();
      }

      // Sweeping Front Line
      rCtx.beginPath();
      rCtx.moveTo(centerX, centerY);
      rCtx.lineTo(
        centerX + Math.cos(scanAngle) * maxRadius,
        centerY + Math.sin(scanAngle) * maxRadius
      );
      rCtx.strokeStyle = '#ff1e38';
      rCtx.lineWidth = 1.6;
      rCtx.shadowColor = '#ff1e38';
      rCtx.shadowBlur = 8;
      rCtx.stroke();
      rCtx.shadowBlur = 0;

      // Draw Blips & Fade Effect
      blips.forEach((blip) => {
        // Calculate difference with scan angle
        let diff = scanAngle - blip.angle;
        while (diff < 0) diff += Math.PI * 2;
        while (diff > Math.PI * 2) diff -= Math.PI * 2;

        if (diff < 0.1) {
          blip.alpha = 1; // Trigger glow on sweep pass
        } else {
          blip.alpha = Math.max(0.15, blip.alpha - 0.008);
        }

        const bx = centerX + Math.cos(blip.angle) * (maxRadius * blip.distance);
        const by = centerY + Math.sin(blip.angle) * (maxRadius * blip.distance);

        rCtx.beginPath();
        rCtx.arc(bx, by, blip.isThreat ? 3.5 : 2.5, 0, Math.PI * 2);
        rCtx.fillStyle = blip.isThreat
          ? `rgba(255, 30, 56, ${blip.alpha})`
          : `rgba(0, 240, 255, ${blip.alpha})`;
        rCtx.shadowColor = blip.isThreat ? '#ff1e38' : '#00f0ff';
        rCtx.shadowBlur = blip.alpha * 8;
        rCtx.fill();
        rCtx.shadowBlur = 0;

        // Label if active
        if (blip.alpha > 0.5) {
          rCtx.font = '9px "JetBrains Mono", monospace';
          rCtx.fillStyle = `rgba(255, 255, 255, ${blip.alpha})`;
          rCtx.fillText(blip.label, bx + 6, by - 4);
        }
      });

      // Central Reticle
      rCtx.beginPath();
      rCtx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      rCtx.fillStyle = '#ff1e38';
      rCtx.fill();

      requestAnimationFrame(drawRadar);
    }

    drawRadar();
  }
})();
