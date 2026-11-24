"use client";

import { useEffect, useRef, useState } from "react";
import type { FitnessDay } from "@/lib/metrics/fitness";
import { formatDay, formatSigned } from "@/lib/format/units";

// Two stacked panels sharing one x axis:
//   top:    fitness (CTL) and fatigue (ATL), same unit, one y axis
//   bottom: form (TSB), its own chart because it centers on 0
// Hovering anywhere shows a crosshair through both panels and a tooltip.

const PAD_LEFT = 32; // room for y-axis labels
const PAD_RIGHT = 52; // room for direct labels at the line ends
const TOP_HEIGHT = 180;
const BOTTOM_HEIGHT = 96;
const GAP = 28; // between panels (holds the bottom panel's title)
const AXIS_HEIGHT = 22; // x-axis labels under the bottom panel
const PAD_Y = 8;

const COLORS = {
  ctl: "var(--color-fitness)",
  atl: "var(--color-fatigue)",
  tsb: "var(--color-form)",
};

export default function FitnessChart({ days }: { days: FitnessDay[] }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  // Draw at the real pixel width so lines and text stay crisp at any size.
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const totalHeight = TOP_HEIGHT + GAP + BOTTOM_HEIGHT + AXIS_HEIGHT;
  const plotWidth = Math.max(width - PAD_LEFT - PAD_RIGHT, 1);
  const last = days.length - 1;

  const x = (i: number) =>
    PAD_LEFT + (last === 0 ? plotWidth / 2 : (i / last) * plotWidth);

  // Top panel: 0 … nice max
  const topMax = niceCeil(Math.max(...days.map((d) => Math.max(d.ctl, d.atl))));
  const yTop = (v: number) =>
    PAD_Y + (1 - v / topMax) * (TOP_HEIGHT - 2 * PAD_Y);

  // Bottom panel: symmetric around 0 so positive and negative read fairly
  const bottomTop = TOP_HEIGHT + GAP;
  const tsbMax = niceCeil(Math.max(...days.map((d) => Math.abs(d.tsb))));
  const yBottom = (v: number) =>
    bottomTop + PAD_Y + ((tsbMax - v) / (2 * tsbMax)) * (BOTTOM_HEIGHT - 2 * PAD_Y);

  const path = (key: keyof typeof COLORS, y: (v: number) => number) =>
    days
      .map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`)
      .join("");

  const xTicks = pickTicks(days.length);
  const endLabels = spreadLabels(
    [
      { key: "ctl" as const, text: "CTL", y: yTop(days[last].ctl) },
      { key: "atl" as const, text: "ATL", y: yTop(days[last].atl) },
    ],
    14,
  );

  function onPointerMove(event: React.PointerEvent<SVGRectElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - box.left - PAD_LEFT) / plotWidth;
    setHover(Math.min(last, Math.max(0, Math.round(ratio * last))));
  }

  const hovered = hover === null ? null : days[hover];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <LegendItem color={COLORS.ctl} label="Fitness (CTL)" />
        <LegendItem color={COLORS.atl} label="Fatigue (ATL)" />
      </div>

      <div ref={wrapper} className="relative w-full" style={{ height: totalHeight }}>
        {width > 0 && (
          <svg
            width={width}
            height={totalHeight}
            role="img"
            aria-label="Fitness, fatigue and form over time"
            className="block"
          >
            {/* Top panel grid + y labels */}
            {[0, topMax / 2, topMax].map((v) => (
              <g key={`t${v}`}>
                <line
                  x1={PAD_LEFT}
                  x2={PAD_LEFT + plotWidth}
                  y1={yTop(v)}
                  y2={yTop(v)}
                  stroke="var(--color-line)"
                  strokeWidth={1}
                />
                <text
                  x={PAD_LEFT - 8}
                  y={yTop(v)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted text-2xs tabular-nums"
                >
                  {Math.round(v)}
                </text>
              </g>
            ))}

            <path d={path("atl", yTop)} fill="none" stroke={COLORS.atl} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            <path d={path("ctl", yTop)} fill="none" stroke={COLORS.ctl} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {endLabels.map((l) => (
              <text
                key={l.key}
                x={PAD_LEFT + plotWidth + 8}
                y={l.y}
                dominantBaseline="middle"
                className="fill-muted text-2xs font-medium"
              >
                {l.text}
              </text>
            ))}

            {/* Bottom panel title, grid + y labels */}
            <text x={PAD_LEFT} y={bottomTop - 8} className="fill-muted text-2xs font-medium">
              Form (TSB)
            </text>
            {[-tsbMax, 0, tsbMax].map((v) => (
              <g key={`b${v}`}>
                <line
                  x1={PAD_LEFT}
                  x2={PAD_LEFT + plotWidth}
                  y1={yBottom(v)}
                  y2={yBottom(v)}
                  stroke={v === 0 ? "var(--color-line-strong)" : "var(--color-line)"}
                  strokeWidth={1}
                />
                <text
                  x={PAD_LEFT - 8}
                  y={yBottom(v)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted text-2xs tabular-nums"
                >
                  {v > 0 ? `+${Math.round(v)}` : Math.round(v)}
                </text>
              </g>
            ))}
            <path d={path("tsb", yBottom)} fill="none" stroke={COLORS.tsb} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

            {/* X axis labels */}
            {xTicks.map((i) => (
              <text
                key={i}
                x={x(i)}
                y={totalHeight - 6}
                textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}
                className="fill-muted text-2xs tabular-nums"
              >
                {formatDay(days[i].date, "short")}
              </text>
            ))}

            {/* Crosshair */}
            {hovered && hover !== null && (
              <g pointerEvents="none">
                <line x1={x(hover)} x2={x(hover)} y1={PAD_Y} y2={bottomTop + BOTTOM_HEIGHT - PAD_Y} stroke="var(--color-muted)" strokeWidth={1} strokeDasharray="2 3" />
                <Dot cx={x(hover)} cy={yTop(hovered.atl)} color={COLORS.atl} />
                <Dot cx={x(hover)} cy={yTop(hovered.ctl)} color={COLORS.ctl} />
                <Dot cx={x(hover)} cy={yBottom(hovered.tsb)} color={COLORS.tsb} />
              </g>
            )}

            {/* Hit area: the whole plot, bigger than the thin lines */}
            <rect
              x={0}
              y={0}
              width={width}
              height={bottomTop + BOTTOM_HEIGHT}
              fill="transparent"
              onPointerMove={onPointerMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>
        )}

        {hovered && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 rounded-row border border-line-strong bg-canvas px-3 py-2 text-xs shadow-lg"
            style={tooltipPosition(x(hover), width)}
          >
            <p className="mb-1 font-medium text-fg">{formatDay(hovered.date)}</p>
            <TooltipRow color={COLORS.ctl} label="Fitness" value={Math.round(hovered.ctl).toString()} />
            <TooltipRow color={COLORS.atl} label="Fatigue" value={Math.round(hovered.atl).toString()} />
            <TooltipRow color={COLORS.tsb} label="Form" value={formatSigned(hovered.tsb)} />
          </div>
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-0.5 w-4 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function TooltipRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <p className="flex items-center gap-2 text-muted">
      <span className="h-0.5 w-3 rounded-full" style={{ background: color }} />
      <span className="flex-1">{label}</span>
      <span className="font-medium tabular-nums text-fg">{value}</span>
    </p>
  );
}

function Dot({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke="var(--color-surface)" strokeWidth={2} />;
}

// Round an axis maximum up to a friendly number (10, 20, 50, 100, …); never 0.
function niceCeil(value: number): number {
  if (value <= 10) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= step * magnitude) return step * magnitude;
  }
  return 10 * magnitude;
}

// Up to 4 evenly spread x labels, always including the first and last day.
function pickTicks(count: number): number[] {
  if (count <= 1) return [0];
  const ticks = count < 4 ? count : 4;
  return Array.from({ length: ticks }, (_, i) =>
    Math.round((i / (ticks - 1)) * (count - 1)),
  );
}

// Push two end labels apart when the lines finish close together.
function spreadLabels<T extends { y: number }>(labels: T[], minGap: number): T[] {
  const sorted = [...labels].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].y - sorted[i - 1].y < minGap) {
      const middle = (sorted[i].y + sorted[i - 1].y) / 2;
      sorted[i - 1] = { ...sorted[i - 1], y: middle - minGap / 2 };
      sorted[i] = { ...sorted[i], y: middle + minGap / 2 };
    }
  }
  return sorted;
}

// Keep the tooltip inside the chart: right of the crosshair, or left near the edge.
function tooltipPosition(crosshairX: number, width: number): React.CSSProperties {
  const tooltipWidth = 150;
  return crosshairX + 12 + tooltipWidth > width
    ? { left: Math.max(crosshairX - 12 - tooltipWidth, 0), width: tooltipWidth }
    : { left: crosshairX + 12, width: tooltipWidth };
}
