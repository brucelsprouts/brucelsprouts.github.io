/* ============================================================
   hero/particles.js — instanced particle and shard buffers

   Both buffers are split into fixed ranges, one per rift slot. When
   a rift spawns it writes everything it will ever emit into its
   range once — with future start times — and the vertex shaders
   work out each element's state from the clock. Nothing here runs
   per frame except flush(), which uploads whatever ranges changed.
============================================================ */
(function () {
  'use strict';
  const Hero = window.Hero = window.Hero || {};

  function dynAttr(count, size) {
    const a = new THREE.InstancedBufferAttribute(new Float32Array(count * size), size);
    a.setUsage(THREE.DynamicDrawUsage);
    return a;
  }

  /* Pending upload window per attribute set: several slots may be written
     in one frame, so ranges are merged into one bufferSubData per attribute */
  function uploader(attrs, width) {
    let lo = Infinity, hi = -Infinity;
    return {
      mark(first, count) { lo = Math.min(lo, first); hi = Math.max(hi, first + count); },
      flush() {
        if (lo === Infinity) return;
        for (const a of attrs) {
          a.updateRange.offset = lo * width;
          a.updateRange.count = (hi - lo) * width;
          a.needsUpdate = true;
        }
        lo = Infinity; hi = -Infinity;
      },
    };
  }

  /* Particles — one quad per instance.
     Each descriptor: { x, y, vx, vy, start, life, size, type, c0, c1, c2 }
     type 0 spark, 1 glint, 2 debris (start is relative to heal start) */
  function createParticles(material, perSlot, slots) {
    const count = perSlot * slots;
    const geo = new THREE.InstancedBufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    const aPA = dynAttr(count, 4), aPB = dynAttr(count, 4), aPC = dynAttr(count, 4);
    geo.setAttribute('aPA', aPA);
    geo.setAttribute('aPB', aPB);
    geo.setAttribute('aPC', aPC);
    geo.instanceCount = count;
    const mesh = new THREE.Mesh(geo, material);
    mesh.frustumCulled = false;
    const up = uploader([aPA, aPB, aPC], 4);
    const lists = new Array(slots).fill(null);

    function write(slot, list) {
      const base = slot * perSlot;
      const n = Math.min(list.length, perSlot);
      const A = aPA.array, B = aPB.array, C = aPC.array;
      for (let i = 0; i < perSlot; i++) {
        const o = (base + i) * 4;
        if (i < n) {
          const p = list[i];
          A[o] = p.x; A[o + 1] = p.y; A[o + 2] = p.vx; A[o + 3] = p.vy;
          B[o] = p.start; B[o + 1] = p.life; B[o + 2] = p.size; B[o + 3] = p.type;
          C[o] = p.c0 || 0; C[o + 1] = p.c1 || 0; C[o + 2] = p.c2 || 0; C[o + 3] = slot;
        } else {
          B[o + 1] = 0;                               // life 0 = never drawn
          C[o + 3] = slot;
        }
      }
      lists[slot] = n < list.length ? list.slice(0, n) : list;
      up.mark(base, perSlot);
    }

    // How many are alive at time t (debris times count from the heal start)
    function alive(slot, t, healStart) {
      const list = lists[slot];
      if (!list) return 0;
      let n = 0;
      for (const p of list) {
        const s = p.type === 2 ? p.start + healStart : p.start;
        if (t >= s && t <= s + p.life) n++;
      }
      return n;
    }

    return {
      mesh, perSlot, write, alive, flush: up.flush,
      clear(slot) { write(slot, []); lists[slot] = null; },
      dispose() { geo.dispose(); },
    };
  }

  /* Shards — one triangle per instance; aBary picks the corner.
     Each descriptor: { x, y, size, rot, r0, r1, r2, seed, appear, detach,
                        fall, dx, dy, spin, orbit } */
  function createShards(material, perSlot, slots) {
    const count = perSlot * slots;
    const geo = new THREE.InstancedBufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0, 0, 0, 0], 3));
    geo.setAttribute('aBary', new THREE.Float32BufferAttribute([1, 0, 0, 0, 1, 0, 0, 0, 1], 3));
    const aShA = dynAttr(count, 4), aShB = dynAttr(count, 4), aShT = dynAttr(count, 4), aShF = dynAttr(count, 4);
    geo.setAttribute('aShA', aShA);
    geo.setAttribute('aShB', aShB);
    geo.setAttribute('aShT', aShT);
    geo.setAttribute('aShF', aShF);
    geo.instanceCount = count;
    const mesh = new THREE.Mesh(geo, material);
    mesh.frustumCulled = false;
    const up = uploader([aShA, aShB, aShT, aShF], 4);

    function write(slot, list) {
      const base = slot * perSlot;
      const n = Math.min(list.length, perSlot);
      const A = aShA.array, B = aShB.array, T = aShT.array, F = aShF.array;
      for (let i = 0; i < perSlot; i++) {
        const o = (base + i) * 4;
        if (i < n) {
          const s = list[i];
          A[o] = s.x; A[o + 1] = s.y; A[o + 2] = s.size; A[o + 3] = s.rot;
          B[o] = s.r0; B[o + 1] = s.r1; B[o + 2] = s.r2; B[o + 3] = s.seed;
          T[o] = s.appear; T[o + 1] = s.detach; T[o + 2] = s.fall; T[o + 3] = slot;
          F[o] = s.dx; F[o + 1] = s.dy; F[o + 2] = s.spin; F[o + 3] = s.orbit;
        } else {
          T[o] = 1e9;                                  // appears never
          T[o + 3] = slot;
        }
      }
      up.mark(base, perSlot);
    }

    return {
      mesh, perSlot, write, flush: up.flush,
      clear(slot) { write(slot, []); },
      dispose() { geo.dispose(); },
    };
  }

  Hero.particles = { createParticles, createShards };
})();
