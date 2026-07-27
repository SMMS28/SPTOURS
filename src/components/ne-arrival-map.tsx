"use client";

import {
  MAP_W,
  MAP_H,
  INDIA_PATH,
  OTHER_PATH,
  MESH_PATH,
  AIR_PINS,
  TRAIN_PINS,
  ROAD_STOPS,
  ROAD_ROUTES,
  NEIGHBOURS,
  type Pin,
} from "@/lib/ne-map-data";

export type ArrivalMode = "air" | "train" | "road";

const LEGEND: Record<ArrivalMode, string> = {
  air: "Gateway airports",
  train: "Major railheads",
  road: "Road stops & routes",
};

/** Halo, dot, label — the comp's pin, as SVG rather than d3 selections. */
function Pins({ pins }: { pins: Pin[] }) {
  return (
    <>
      {pins.map((p) => (
        <circle
          key={`${p.n}-halo`}
          cx={p.x}
          cy={p.y}
          className="[r:24px] sm:[r:13px]"
          fill="#9B6A4C"
          fillOpacity={0.16}
        />
      ))}
      {pins.map((p) => (
        <circle
          key={`${p.n}-dot`}
          cx={p.x}
          cy={p.y}
          className="[r:12px] [stroke-width:4px] sm:[r:6.5px] sm:[stroke-width:2.5px]"
          fill="#9B6A4C"
          stroke="#F5F0E6"
        />
      ))}
      {pins.map((p) => (
        <text
          key={`${p.n}-label`}
          x={p.x + p.dx}
          y={p.y + p.dy}
          textAnchor={p.anchor}
          className="font-display text-[29px] sm:text-[16px]"
          fontWeight={700}
          fill="#17130D"
        >
          {p.n}
        </text>
      ))}
    </>
  );
}

/**
 * Map of the Northeast with the arrival hubs for the selected mode.
 *
 * Layers cross-fade rather than mount and unmount, so switching tabs doesn't
 * reflow the SVG — and because all three are always in the DOM, the labels are
 * available to assistive tech and to search regardless of which tab is showing.
 */
export function NeArrivalMap({ mode }: { mode: ArrivalMode }) {
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Map of North East India showing ${LEGEND[mode].toLowerCase()}`}
      className="block h-full w-full [&_text]:[paint-order:stroke] [&_text]:[stroke:#F5F0E6] [&_text]:[stroke-linejoin:round] [&_text]:[stroke-width:3px]"
    >
      <path d={OTHER_PATH} fill="#EAE1D0" />
      <path d={INDIA_PATH} fill="#D8C2A0" />
      <path
        d={MESH_PATH}
        fill="none"
        stroke="rgba(23,19,13,0.32)"
        className="[stroke-width:1.8px] sm:[stroke-width:0.9px]"
        strokeLinejoin="round"
      />

      {NEIGHBOURS.map((n) => (
        <text
          key={n.n}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          className="font-mono text-[20px] sm:text-[12px]"
          letterSpacing="0.18em"
          fill="rgba(23,19,13,0.34)"
        >
          {n.n}
        </text>
      ))}

      <g
        className="transition-opacity duration-500"
        style={{ opacity: mode === "air" ? 1 : 0 }}
        aria-hidden={mode !== "air"}
      >
        <Pins pins={AIR_PINS} />
      </g>

      <g
        className="transition-opacity duration-500"
        style={{ opacity: mode === "train" ? 1 : 0 }}
        aria-hidden={mode !== "train"}
      >
        <Pins pins={TRAIN_PINS} />
      </g>

      <g
        className="transition-opacity duration-500"
        style={{ opacity: mode === "road" ? 1 : 0 }}
        aria-hidden={mode !== "road"}
      >
        {ROAD_ROUTES.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#9B6A4C"
            className="[stroke-width:4px] sm:[stroke-width:2.2px]"
            strokeDasharray="1 6"
            strokeLinecap="round"
            opacity={0.8}
          />
        ))}
        {ROAD_STOPS.map((s) => (
          <circle
            key={`${s.n}-dot`}
            cx={s.x}
            cy={s.y}
            className={`${s.lab ? "[r:11px] sm:[r:6px]" : "[r:7px] sm:[r:4px]"} [stroke-width:3.5px] sm:[stroke-width:2px]`}
            fill="#9B6A4C"
            stroke="#F5F0E6"
          />
        ))}
        {ROAD_STOPS.filter((s) => s.lab).map((s) => (
          <text
            key={`${s.n}-label`}
            x={s.x + s.dx}
            y={s.y + s.dy}
            textAnchor={s.anchor}
            className="font-display text-[27px] sm:text-[15px]"
            fontWeight={700}
            fill="#17130D"
          >
            {s.n}
          </text>
        ))}
      </g>

      <text
        x={26}
        y={34}
        className="font-mono text-[22px] sm:text-[14px]"
        letterSpacing="0.28em"
        fill="rgba(23,19,13,0.55)"
      >
        NORTH EAST INDIA
      </text>

      <g transform={`translate(26, ${MAP_H - 30})`}>
        <circle
          cx={6}
          cy={0}
          className="[r:11px] [stroke-width:3.5px] sm:[r:6.5px] sm:[stroke-width:2px]"
          fill="#9B6A4C"
          stroke="#F5F0E6"
        />
        <text
          x={20}
          y={4}
          className="font-mono text-[20px] sm:text-[12px]"
          letterSpacing="0.06em"
          fill="rgba(23,19,13,0.6)"
        >
          {LEGEND[mode]}
        </text>
      </g>
    </svg>
  );
}
