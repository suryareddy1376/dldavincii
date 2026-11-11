"use client";

import { useMemo, useState } from "react";
import { Function as FunctionIcon, Sliders } from "@phosphor-icons/react";

type ActivationKey = "sigmoid" | "tanh" | "relu";

function evalActivation(key: ActivationKey, z: number): number {
  if (key === "sigmoid") return 1 / (1 + Math.exp(-z));
  if (key === "tanh") return Math.tanh(z);
  return Math.max(0, z);
}

function evalDerivative(key: ActivationKey, z: number): number {
  if (key === "sigmoid") {
    const s = 1 / (1 + Math.exp(-z));
    return s * (1 - s);
  }
  if (key === "tanh") {
    const t = Math.tanh(z);
    return 1 - t * t;
  }
  return z > 0 ? 1 : 0;
}

const ACTIVATION_META: Array<{
  key: ActivationKey;
  label: string;
  formula: string;
  color: string;
}> = [
  {
    key: "sigmoid",
    label: "Sigmoid",
    formula: "1 / (1 + exp(-z))",
    color: "#38BDF8",
  },
  {
    key: "tanh",
    label: "Tanh",
    formula: "(exp(z) - exp(-z)) / (exp(z) + exp(-z))",
    color: "#FBBF24",
  },
  {
    key: "relu",
    label: "ReLU",
    formula: "max(0, z)",
    color: "#34D399",
  },
];

export function MathPlayground() {
  const [zInput, setZInput] = useState<number>(1.2);
  const [activeCurve, setActiveCurve] = useState<ActivationKey>("sigmoid");

  const width = 480;
  const height = 220;
  const padX = 36;
  const padY = 20;

  const mapX = (z: number) =>
    padX + ((z + 6) / 12) * (width - padX * 2);

  const mapY = (val: number) => {
    const clamped = Math.max(-1.2, Math.min(6, val));
    return height - padY - ((clamped + 1.2) / 7.2) * (height - padY * 2);
  };

  const paths = useMemo(() => {
    const zs: number[] = [];
    for (let z = -6; z <= 6.001; z += 0.2) {
      zs.push(Number(z.toFixed(2)));
    }

    return ACTIVATION_META.map((meta) => {
      const d = zs
        .map((z, idx) => {
          const x = mapX(z).toFixed(1);
          const y = mapY(evalActivation(meta.key, z)).toFixed(1);
          return `${idx === 0 ? "M" : "L"}${x},${y}`;
        })
        .join(" ");
      return { ...meta, d };
    });
  }, []);

  const markerX = mapX(zInput);
  const markerY = mapY(evalActivation(activeCurve, zInput));
  const activeColor =
    ACTIVATION_META.find((m) => m.key === activeCurve)?.color ?? "#FFFFFF";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-[#1F1F1F] border border-[#272727] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FunctionIcon
              size={18}
              className="text-[#FFFFFF]"
              aria-hidden="true"
            />
            <h3 className="title-3 text-[#FFFFFF]">
              Activation function response curve (Ex 05)
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ACTIVATION_META.map((item) => {
              const selected = activeCurve === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveCurve(item.key)}
                  className={`button-xsm rounded-lg border px-2.5 py-1.5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFFFF]/40 ${
                    selected
                      ? "bg-[#313131] border-[#313131] text-[#FFFFFF]"
                      : "bg-[#181818] border-[#272727] text-[#9B9B9B] hover:text-[#FFFFFF]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-[#000000] border border-[#272727] p-3">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Activation curves for Sigmoid, Tanh, and ReLU from minus 6 to plus 6"
            className="w-full h-auto"
          >
            {/* Axis lines */}
            <line
              x1={padX}
              y1={mapY(0)}
              x2={width - padX}
              y2={mapY(0)}
              stroke="#313131"
              strokeWidth="1"
            />
            <line
              x1={mapX(0)}
              y1={padY}
              x2={mapX(0)}
              y2={height - padY}
              stroke="#313131"
              strokeWidth="1"
            />
            <line
              x1={padX}
              y1={mapY(1)}
              x2={width - padX}
              y2={mapY(1)}
              stroke="#272727"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {/* Curves */}
            {paths.map((curve) => (
              <path
                key={curve.key}
                d={curve.d}
                fill="none"
                stroke={curve.color}
                strokeWidth={curve.key === activeCurve ? "3" : "1.5"}
                strokeOpacity={curve.key === activeCurve ? 1 : 0.4}
              />
            ))}

            {/* Probe crosshair */}
            <line
              x1={markerX}
              y1={padY}
              x2={markerX}
              y2={height - padY}
              stroke="#FFFFFF"
              strokeOpacity="0.3"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            <circle
              cx={markerX}
              cy={markerY}
              r="5"
              fill={activeColor}
              stroke="#000000"
              strokeWidth="2"
            />

            <text
              x={padX}
              y={height - 4}
              fill="#9B9B9B"
              fontSize="11"
              fontFamily="monospace"
            >
              z = -6
            </text>
            <text
              x={mapX(0) - 14}
              y={height - 4}
              fill="#9B9B9B"
              fontSize="11"
              fontFamily="monospace"
            >
              z = 0
            </text>
            <text
              x={width - padX - 36}
              y={height - 4}
              fill="#9B9B9B"
              fontSize="11"
              fontFamily="monospace"
            >
              z = +6
            </text>
          </svg>
        </div>

        {/* Slider control */}
        <div className="mt-4 flex flex-col gap-3 rounded-xl bg-[#181818] border border-[#272727] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="z-probe-slider"
              className="body-5 inline-flex items-center gap-2 text-[#D4D4D4]"
            >
              <Sliders size={16} aria-hidden="true" />
              <span>Probe input logit z</span>
            </label>
            <span className="caption-1 font-mono text-[#FFFFFF]">
              z = {zInput.toFixed(1)}
            </span>
          </div>

          <input
            id="z-probe-slider"
            type="range"
            min={-6}
            max={6}
            step={0.1}
            value={zInput}
            onChange={(e) => setZInput(parseFloat(e.target.value))}
            className="w-full accent-[#FFFFFF] cursor-pointer"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {ACTIVATION_META.map((item) => {
              const val = evalActivation(item.key, zInput);
              const grad = evalDerivative(item.key, zInput);
              return (
                <div
                  key={item.key}
                  className="rounded-lg bg-[#1F1F1F] border border-[#272727] p-3"
                >
                  <p className="caption-3 text-[#FFFFFF] mb-1">{item.label}</p>
                  <p className="caption-4 font-mono text-[#D4D4D4]">
                    f(z) = {val.toFixed(4)}
                  </p>
                  <p className="caption-4 font-mono text-[#9B9B9B]">
                    f&apos;(z) = {grad.toFixed(4)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notebook regularization & stability summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#181818] border border-[#272727] p-4">
          <p className="caption-3 font-mono text-[#9B9B9B] mb-1">
            Ex 09 &amp; Ex 10
          </p>
          <p className="title-4 text-[#FFFFFF] mb-1">
            Overfitting controls in Keras
          </p>
          <p className="body-6 text-[#9B9B9B]">
            Bike Sharing networks compare unregularized SGD against L2 penalty
            0.005 on outer layers and Dropout rate 0.20 across 2000 epochs.
          </p>
        </div>

        <div className="rounded-xl bg-[#181818] border border-[#272727] p-4">
          <p className="caption-3 font-mono text-[#9B9B9B] mb-1">
            Ex 01 &amp; Ex 13a
          </p>
          <p className="title-4 text-[#FFFFFF] mb-1">
            Gradient and input stability
          </p>
          <p className="body-6 text-[#9B9B9B]">
            StandardScaler prevents sigmoid saturation in Ex 01, while Adam
            clipnorm=1.0 prevents exploding gradients in stacked SimpleRNN layers.
          </p>
        </div>
      </div>
    </div>
  );
}
