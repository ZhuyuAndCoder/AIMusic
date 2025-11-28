"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { PlayerBar } from "@/components/layout/PlayerBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dice1, Gamepad2, Trophy, ArrowLeft, CloudRain } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  icon: React.ReactNode;
}

const games: Game[] = [
  {
    id: "guess-number",
    title: "猜数字游戏",
    description: "经典的猜数字游戏，考验你的逻辑思维能力",
    category: "休闲益智",
    difficulty: "easy",
    icon: <Dice1 className="h-8 w-8 text-sky-600" />,
  },
  {
    id: "daletou",
    title: "模拟大乐透摇号",
    description: "模拟大乐透摇号过程，包含球滚动与摇号动画",
    category: "休闲模拟",
    difficulty: "medium",
    icon: <Dice1 className="h-8 w-8 text-sky-600" />,
  },
  {
    id: "rain-run",
    title: "雨中奔跑",
    description: "点击加速，在雨中一路疾跑",
    category: "动作休闲",
    difficulty: "easy",
    icon: <CloudRain className="h-8 w-8 text-sky-600" />,
  },
  {
    id: "coming-soon-1",
    title: "音乐节拍器",
    description: "跟随音乐节拍点击，测试你的节奏感",
    category: "音乐节奏",
    difficulty: "medium",
    icon: <Trophy className="h-8 w-8 text-purple-600" />,
  },
  {
    id: "coming-soon-2",
    title: "记忆翻牌",
    description: "翻牌记忆游戏，挑战你的记忆力极限",
    category: "记忆训练",
    difficulty: "easy",
    icon: <Gamepad2 className="h-8 w-8 text-green-600" />,
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "简单";
      case "medium":
        return "中等";
      case "hard":
        return "困难";
      default:
        return "未知";
    }
  };

  if (selectedGame === "guess-number") {
    return <GuessNumberGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "daletou") {
    return <DaletouGame onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "rain-run") {
    return <RainRunGame onBack={() => setSelectedGame(null)} />;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <FadeIn>
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">音乐游戏中心</h1>
            <p className="text-gray-400 text-lg">
              在享受音乐的同时，体验有趣的小游戏
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className="p-6 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  {game.icon}
                  <span
                    className={`text-sm font-medium ${getDifficultyColor(
                      game.difficulty
                    )}`}
                  >
                    {getDifficultyText(game.difficulty)}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{game.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                    {game.category}
                  </span>

                  {game.id === "guess-number" ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedGame(game.id)}
                    >
                      开始游戏
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedGame(game.id)}
                    >
                      进入
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </FadeIn>
      </main>

      <PlayerBar />
    </div>
  );
}

function RainRunGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [running, setRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(2);
  const [boost, setBoost] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const boostRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const lastUiRef = useRef<number>(performance.now());
  const isCrouchingRef = useRef<boolean>(false);
  const runnerYRef = useRef<number>(0);
  const runnerVyRef = useRef<number>(0);
  const runnerXRef = useRef<number>(120);
  const obstaclesRef = useRef<
    Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      type: "banana" | "bird";
      scored?: boolean;
      hit?: boolean;
    }>
  >([]);
  const nextSpawnRef = useRef<number>(1.2);
  const hitCooldownRef = useRef<number>(0);
  const shakeRef = useRef<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hint, setHint] = useState<string>("点击加速，↑跳跃，↓下蹲");
  const [health, setHealth] = useState<number>(100);
  const healthRef = useRef<number>(100);
  useEffect(() => {
    healthRef.current = health;
  }, [health]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = (canvas.width = 720);
    const h = (canvas.height = 280);

    const drops: { x: number; y: number; l: number; s: number }[] = [];
    for (let i = 0; i < 180; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        l: Math.random() * 15 + 10,
        s: Math.random() * 3 + 1,
      });
    }

    let runnerPhase = 0;
    let bgOffset = 0;
    let lastTs = performance.now();

    const groundY = h - 80;
    const drawRunner = (cx: CanvasRenderingContext2D) => {
      const x = 120;
      const y = groundY - runnerYRef.current;
      cx.save();
      const jx = shakeRef.current > 0 ? (Math.random() - 0.5) * 3 : 0;
      const jy = shakeRef.current > 0 ? (Math.random() - 0.5) * 2 : 0;
      cx.translate(x + jx, y + jy);
      cx.fillStyle = "#0ea5e9"; // sky-500
      // body
      const bodyH = isCrouchingRef.current ? 22 : 30;
      cx.fillRect(-6, -bodyH, 12, bodyH);
      // head
      cx.beginPath();
      cx.arc(0, -bodyH - 8, 8, 0, Math.PI * 2);
      cx.fill();
      // health bar above head
      const hp = Math.max(0, Math.min(100, healthRef.current));
      const hpW = 44;
      const hpH = 6;
      cx.fillStyle = "#1f2937"; // bg
      cx.fillRect(-hpW / 2, -bodyH - 22, hpW, hpH);
      const hpColor = hp > 60 ? "#22c55e" : hp > 30 ? "#f59e0b" : "#ef4444";
      cx.fillStyle = hpColor;
      cx.fillRect(-hpW / 2, -bodyH - 22, (hpW * hp) / 100, hpH);
      cx.strokeStyle = "#334155";
      cx.lineWidth = 1;
      cx.strokeRect(-hpW / 2, -bodyH - 22, hpW, hpH);
      // arms
      cx.strokeStyle = "#0ea5e9";
      cx.lineWidth = 3;
      cx.beginPath();
      cx.moveTo(0, -Math.min(20, bodyH - 8));
      cx.lineTo(12 * Math.sin(runnerPhase), -10);
      cx.moveTo(0, -Math.min(20, bodyH - 8));
      cx.lineTo(-12 * Math.sin(runnerPhase), -5);
      cx.stroke();
      // legs
      cx.beginPath();
      cx.moveTo(0, 0);
      cx.lineTo(10 * Math.cos(runnerPhase), 18);
      cx.moveTo(0, 0);
      cx.lineTo(-10 * Math.cos(runnerPhase + 0.8), 20);
      cx.stroke();
      cx.restore();
    };

    const draw = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      const curSpeed = speed + boostRef.current;
      boostRef.current = Math.max(0, boostRef.current - dt * 0.8);
      if (ts - lastUiRef.current > 120) {
        setBoost(Number(boostRef.current.toFixed(2)));
        distanceRef.current += curSpeed * 3;
        setDistance(Math.floor(distanceRef.current));
        lastUiRef.current = ts;
      } else {
        distanceRef.current += curSpeed * 3;
      }
      runnerPhase += dt * (6 + curSpeed);
      bgOffset += dt * curSpeed * 30;

      // physics: jump and crouch
      runnerVyRef.current += -38 * dt; // gravity downward
      runnerYRef.current += runnerVyRef.current * 60 * dt; // height above ground
      if (runnerYRef.current < 0) runnerYRef.current = 0;
      if (runnerYRef.current > 60) runnerYRef.current = 60;
      if (runnerYRef.current === 0) runnerVyRef.current = 0;
      shakeRef.current = Math.max(0, shakeRef.current - dt);

      ctx.clearRect(0, 0, w, h);
      // background lines (parallax)
      ctx.strokeStyle = "#0b1a2b";
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const x = (i * 120 - (bgOffset % 120) + w) % w;
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(x - 20, h - 40);
        ctx.stroke();
      }

      // ground baseline
      ctx.strokeStyle = "#334155"; // slate-700
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 1);
      ctx.lineTo(w, groundY + 1);
      ctx.stroke();

      // rain
      ctx.strokeStyle = "rgba(148, 163, 184, 0.7)"; // slate-400
      ctx.lineWidth = 1.5;
      drops.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 3, d.y + d.l);
        ctx.stroke();
        d.x -= 1.5;
        d.y += d.s * 4;
        if (d.y > h + 20) {
          d.y = -10;
          d.x = Math.random() * w;
        }
        if (d.x < -20) d.x = w + 10;
      });

      // parallax background: trees and houses (layered, slower than foreground)
      type Deco = {
        x: number;
        y: number;
        w: number;
        h: number;
        type: "tree" | "house";
        layer: 1 | 2;
      };
      (draw as any).decor1 ||= [] as Deco[];
      (draw as any).decor2 ||= [] as Deco[];
      const decor1: Deco[] = (draw as any).decor1;
      const decor2: Deco[] = (draw as any).decor2;
      const initDecor = (arr: Deco[], count: number, layer: 1 | 2) => {
        if (arr.length === 0) {
          for (let i = 0; i < count; i++) {
            const isTree = Math.random() < 0.6;
            const wDec = isTree
              ? 20 + Math.random() * 10
              : 26 + Math.random() * 14;
            const hDec = isTree
              ? 24 + Math.random() * 16
              : 20 + Math.random() * 12;
            const yBase = layer === 1 ? groundY - 36 : groundY - 52;
            arr.push({
              x: i * (w / count) + Math.random() * 30,
              y: yBase,
              w: wDec,
              h: hDec,
              type: isTree ? "tree" : "house",
              layer,
            });
          }
        }
      };
      initDecor(decor1, 6, 1);
      initDecor(decor2, 4, 2);
      const moveAndDrawDecor = (arr: Deco[], speedScale: number) => {
        arr.forEach((d) => {
          d.x -= curSpeed * speedScale * dt;
          if (d.x < -60) {
            d.x = w + Math.random() * 80;
            d.type = Math.random() < 0.6 ? "tree" : "house";
            d.w =
              d.type === "tree"
                ? 20 + Math.random() * 10
                : 26 + Math.random() * 14;
            d.h =
              d.type === "tree"
                ? 24 + Math.random() * 16
                : 20 + Math.random() * 12;
            d.y = d.layer === 1 ? groundY - 36 : groundY - 52;
          }
          if (d.type === "tree") {
            ctx.fillStyle = "#475569";
            ctx.fillRect(
              d.x + d.w * 0.45,
              d.y + d.h * 0.3,
              d.w * 0.1,
              d.h * 0.7
            );
            ctx.fillStyle =
              d.layer === 1
                ? "rgba(56, 189, 248, 0.35)"
                : "rgba(56, 189, 248, 0.22)";
            ctx.beginPath();
            ctx.moveTo(d.x, d.y + d.h * 0.3);
            ctx.lineTo(d.x + d.w * 0.5, d.y);
            ctx.lineTo(d.x + d.w, d.y + d.h * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#93c5fd";
            ctx.lineWidth = 1;
            ctx.stroke();
          } else {
            ctx.fillStyle =
              d.layer === 1
                ? "rgba(99, 102, 241, 0.28)"
                : "rgba(99, 102, 241, 0.18)";
            ctx.fillRect(d.x, d.y + d.h * 0.2, d.w, d.h * 0.8);
            ctx.strokeStyle = "#93c5fd";
            ctx.lineWidth = 1;
            ctx.strokeRect(d.x, d.y + d.h * 0.2, d.w, d.h * 0.8);
            ctx.fillStyle =
              d.layer === 1
                ? "rgba(2, 132, 199, 0.32)"
                : "rgba(2, 132, 199, 0.22)";
            ctx.beginPath();
            ctx.moveTo(d.x, d.y + d.h * 0.2);
            ctx.lineTo(d.x + d.w * 0.5, d.y);
            ctx.lineTo(d.x + d.w, d.y + d.h * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        });
      };
      // draw farther layer first, then nearer layer
      moveAndDrawDecor(decor2, 10); // far
      moveAndDrawDecor(decor1, 18); // near

      // obstacles: banana peel (low) and bird (high)
      const obstacles = obstaclesRef.current;
      let nextSpawn = nextSpawnRef.current;

      nextSpawn -= dt;
      nextSpawnRef.current = nextSpawn;
      if (nextSpawn <= 0 && !gameOver) {
        const type: "banana" | "bird" = Math.random() < 0.6 ? "banana" : "bird";
        const wOb = type === "banana" ? 24 : 26;
        const hOb = type === "banana" ? 16 : 18;
        const yOb = type === "banana" ? groundY - hOb : groundY - hOb - 38;
        obstacles.push({
          x: w + 10,
          y: yOb,
          w: wOb,
          h: hOb,
          type,
          scored: false,
          hit: false,
        });
        nextSpawn = 1.4 - Math.min(curSpeed, 6) * 0.15 + Math.random() * 1.0;
        nextSpawnRef.current = nextSpawn;
      }
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= curSpeed * 34 * dt;
        if (
          !obstacles[i].scored &&
          !obstacles[i].hit &&
          obstacles[i].x + obstacles[i].w < runnerXRef.current - 6
        ) {
          const requiresCrouch = obstacles[i].type === "bird";
          if (!requiresCrouch || isCrouchingRef.current) {
            obstacles[i].scored = true;
            setScore((s) => s + 10);
          } else {
            obstacles[i].hit = true;
            if (hitCooldownRef.current <= 0) {
              hitCooldownRef.current = 0.5;
              shakeRef.current = 0.3;
              setHealth((h) => {
                const nh = Math.max(0, h - 10);
                if (nh <= 0) {
                  setGameOver(true);
                  setHint("体力耗尽，点击重置继续！");
                  setRunning(false);
                }
                return nh;
              });
            }
          }
        }
        if (obstacles[i].x < -40) obstacles.splice(i, 1);
      }
      // render obstacles
      obstacles.forEach((ob) => {
        if (ob.type === "banana") {
          // banana peel shape
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.moveTo(ob.x, ob.y + ob.h);
          ctx.quadraticCurveTo(
            ob.x + ob.w * 0.5,
            ob.y - ob.h * 0.2,
            ob.x + ob.w,
            ob.y + ob.h
          );
          ctx.lineTo(ob.x + ob.w * 0.7, ob.y + ob.h * 0.7);
          ctx.lineTo(ob.x + ob.w * 0.3, ob.y + ob.h * 0.7);
          ctx.closePath();
          ctx.fill();
        } else {
          // bird shape
          ctx.fillStyle = "#60a5fa";
          ctx.beginPath();
          ctx.ellipse(
            ob.x + ob.w * 0.5,
            ob.y + ob.h * 0.5,
            ob.w * 0.5,
            ob.h * 0.5,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.strokeStyle = "#93c5fd";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(ob.x + ob.w * 0.2, ob.y + ob.h * 0.4);
          ctx.lineTo(ob.x + ob.w * 0.6, ob.y + ob.h * 0.2);
          ctx.moveTo(ob.x + ob.w * 0.8, ob.y + ob.h * 0.4);
          ctx.lineTo(ob.x + ob.w * 0.4, ob.y + ob.h * 0.2);
          ctx.stroke();
        }
      });

      // collision
      const rx = runnerXRef.current - 6;
      const rw = 12;
      const rh = (isCrouchingRef.current ? 22 : 30) + 20;
      const ry =
        groundY - runnerYRef.current - (isCrouchingRef.current ? 22 : 30);
      hitCooldownRef.current = Math.max(0, hitCooldownRef.current - dt);
      for (let i = 0; i < obstacles.length; i++) {
        const ob = obstacles[i];
        const collide =
          rx < ob.x + ob.w &&
          rx + rw > ob.x &&
          ry < ob.y + ob.h &&
          ry + rh > ob.y;
        if (collide && hitCooldownRef.current <= 0) {
          hitCooldownRef.current = 0.5;
          ob.hit = true;
          setHealth((h) => {
            const nh = Math.max(0, h - 10);
            if (nh <= 0) {
              setGameOver(true);
              setHint("体力耗尽，点击重置继续！");
              setRunning(false);
            }
            return nh;
          });
          break;
        }
      }

      // runner
      drawRunner(ctx);

      if (running) rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const handleClick = () => {
      boostRef.current = Math.min(boostRef.current + 2.2, 6);
      setBoost(boostRef.current);
    };
    canvas.addEventListener("click", handleClick);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        if (runnerYRef.current === 0) {
          runnerVyRef.current = 28;
          setHint("跳跃！↓下蹲躲高障碍");
        }
      } else if (e.key === "ArrowDown") {
        isCrouchingRef.current = true;
        setHint("下蹲中，↑跳跃躲低障碍");
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        isCrouchingRef.current = false;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [running, speed]);

  const reset = () => {
    distanceRef.current = 0;
    boostRef.current = 0;
    setDistance(0);
    setBoost(0);
    setSpeed(2);
    setRunning(true);
    setScore(0);
    setGameOver(false);
    setHint("点击加速，↑跳跃，↓下蹲");
    setHealth(100);
    runnerXRef.current = 120;
    runnerYRef.current = 0;
    runnerVyRef.current = 0;
    isCrouchingRef.current = false;
    obstaclesRef.current = [];
    nextSpawnRef.current = 1.2;
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <FadeIn>
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回游戏列表
            </Button>
            <h1 className="text-4xl font-bold text-white mb-2">雨中奔跑</h1>
            <p className="text-gray-400">点击画面加速，冲刺更远的距离</p>
          </div>
        </FadeIn>

        <FadeIn>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
              <div className="text-gray-300 text-sm">
                速度:{" "}
                <span className="text-sky-400 font-semibold">
                  {(speed + boost).toFixed(1)}
                </span>{" "}
                · 距离:{" "}
                <span className="text-sky-400 font-semibold">
                  {Math.floor(distance)} m
                </span>
                · 得分:{" "}
                <span className="text-sky-400 font-semibold">{score}</span>
                <span className="ml-3 text-gray-500">{hint}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSpeed((s) => Math.max(1, s - 0.5))}
                >
                  减速
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSpeed((s) => Math.min(6, s + 0.5))}
                >
                  加速
                </Button>
                <Button variant="primary" onClick={reset}>
                  重置
                </Button>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden relative">
              <canvas ref={canvasRef} className="w-full h-64" />
              {/* Desktop controls */}
              <div className="absolute bottom-2 right-2 hidden sm:flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (runnerYRef.current === 0) {
                      runnerVyRef.current = 28;
                      setHint("跳跃！↓下蹲躲高障碍");
                    }
                  }}
                >
                  跳跃
                </Button>
                <Button
                  variant="outline"
                  onMouseDown={() => {
                    isCrouchingRef.current = true;
                    setHint("下蹲中，↑跳跃躲低障碍");
                  }}
                  onMouseUp={() => {
                    isCrouchingRef.current = false;
                  }}
                >
                  下蹲
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    boostRef.current = Math.min(boostRef.current + 2.2, 6);
                    setBoost(boostRef.current);
                  }}
                >
                  加速
                </Button>
              </div>
              {/* Mobile controls */}
              <div className="absolute bottom-2 left-2 sm:hidden flex gap-4">
                <button
                  className="w-14 h-14 rounded-full bg-sky-600 text-white"
                  onClick={() => {
                    if (runnerYRef.current === 0) {
                      runnerVyRef.current = 28;
                      setHint("跳跃！↓下蹲躲高障碍");
                    }
                  }}
                >
                  ↑
                </button>
                <button
                  className="w-14 h-14 rounded-full bg-sky-600 text-white"
                  onTouchStart={() => {
                    isCrouchingRef.current = true;
                    setHint("下蹲中，↑跳跃躲低障碍");
                  }}
                  onTouchEnd={() => {
                    isCrouchingRef.current = false;
                  }}
                >
                  ↓
                </button>
                <button
                  className="w-14 h-14 rounded-full bg-sky-600 text-white"
                  onClick={() => {
                    boostRef.current = Math.min(boostRef.current + 2.2, 6);
                    setBoost(boostRef.current);
                  }}
                >
                  ⚡
                </button>
              </div>
              {gameOver && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center flex flex-col items-center justify-center gap-4">
                    <div className="text-3xl font-extrabold text-sky-400">
                      总得分
                    </div>
                    <div className="text-6xl font-black text-white">
                      {score}
                    </div>
                    <Button variant="primary" onClick={reset}>
                      重置再来
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-gray-500 text-xs mt-2">
              提示：点击画面可瞬时加速，雨滴与地面线条随速度变化产生动态感。
            </div>
          </Card>
        </FadeIn>
      </main>
      <PlayerBar />
    </div>
  );
}

// 猜数字游戏组件
function GuessNumberGame({ onBack }: { onBack: () => void }) {
  const [targetNumber, setTargetNumber] = useState<number>(
    () => Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [message, setMessage] = useState<string>("猜一个1到100之间的数字！");
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [guessHistory, setGuessHistory] = useState<number[]>([]);

  const handleGuess = () => {
    const num = parseInt(guess);

    if (isNaN(num) || num < 1 || num > 100) {
      setMessage("请输入1到100之间的有效数字！");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setGuessHistory([...guessHistory, num]);
    setGuess("");

    if (num === targetNumber) {
      setMessage(
        `🎉 恭喜你！用了 ${newAttempts} 次猜中了数字 ${targetNumber}！`
      );
      setGameWon(true);
    } else if (num < targetNumber) {
      setMessage(`太小了！再试试更大的数字。已尝试 ${newAttempts} 次`);
    } else {
      setMessage(`太大了！再试试更小的数字。已尝试 ${newAttempts} 次`);
    }
  };

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setAttempts(0);
    setMessage("猜一个1到100之间的数字！");
    setGameWon(false);
    setGuessHistory([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !gameWon) {
      handleGuess();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        <FadeIn>
          <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回游戏列表
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">猜数字游戏</h1>
            <p className="text-gray-400">经典的逻辑推理游戏</p>
          </div>
        </FadeIn>

        <FadeIn>
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>
              <div className="text-gray-400">
                尝试次数:{" "}
                <span className="text-sky-400 font-bold">{attempts}</span>
              </div>
            </div>

            {!gameWon ? (
              <div className="space-y-6">
                <div>
                  <input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入你的猜测 (1-100)"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    min="1"
                    max="100"
                  />
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGuess}
                  className="w-full"
                  disabled={!guess.trim()}
                >
                  提交猜测
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={resetGame}
                  className="w-full"
                >
                  再玩一局
                </Button>
              </div>
            )}

            {guessHistory.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">
                  猜测历史
                </h3>
                <div className="flex flex-wrap gap-2">
                  {guessHistory.map((num, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        num === targetNumber
                          ? "bg-green-600 text-white"
                          : num < targetNumber
                          ? "bg-blue-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                游戏规则
              </h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• 系统随机生成一个1到100之间的数字</li>
                <li>• 你需要猜出这个数字是多少</li>
                <li>• 系统会告诉你猜的数字是太大还是太小</li>
                <li>• 尽量用最少的次数猜中数字！</li>
              </ul>
            </div>
          </Card>
        </FadeIn>
      </main>

      <PlayerBar />
    </div>
  );
}

function DaletouGame({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<"idle" | "shaking" | "drawing" | "done">(
    "idle"
  );
  const [frontResult, setFrontResult] = useState<number[]>([]);
  const [backResult, setBackResult] = useState<number[]>([]);
  const [sequence, setSequence] = useState<
    { num: number; type: "front" | "back" }[]
  >([]);
  const [positions, setPositions] = useState<
    { x: number; y: number; type: "front" | "back" }[]
  >([]);
  const [rolling, setRolling] = useState<number[]>([]);
  const velRef = useRef<{ vx: number; vy: number }[]>([]);
  const [selectedFront, setSelectedFront] = useState<number[]>([]);
  const [selectedBack, setSelectedBack] = useState<number[]>([]);
  const [matchFront, setMatchFront] = useState<number>(0);
  const [matchBack, setMatchBack] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [showFireworks, setShowFireworks] = useState<boolean>(false);

  useEffect(() => {
    const init: { x: number; y: number; type: "front" | "back" }[] = [];
    for (let i = 1; i <= 35; i++) {
      init.push({
        x: Math.random() * 85,
        y: Math.random() * 75,
        type: "front",
      });
    }
    for (let i = 1; i <= 12; i++) {
      init.push({ x: Math.random() * 85, y: Math.random() * 75, type: "back" });
    }
    setPositions(init);
    velRef.current = init.map((p) => {
      const base = p.type === "front" ? 1.2 : 1.6;
      return {
        vx: (Math.random() * 2 - 1) * base * 2,
        vy: (Math.random() * 2 - 1) * base * 2,
      };
    });
  }, []);

  useEffect(() => {
    if (stage !== "shaking") return;
    const MIN = 3;
    const MAXX = 97;
    const MAXY = 97;
    const id = setInterval(() => {
      setPositions((prev) =>
        prev.map((p, i) => {
          const v = velRef.current[i] || { vx: 0, vy: 0 };
          const speed = p.type === "front" ? 2.2 : 2.8;
          let x = p.x + v.vx * speed;
          let y = p.y + v.vy * speed;
          if (x < MIN || x > MAXX) {
            v.vx = -v.vx;
            x = Math.min(MAXX, Math.max(MIN, x));
          }
          if (y < MIN || y > MAXY) {
            v.vy = -v.vy;
            y = Math.min(MAXY, Math.max(MIN, y));
          }
          v.vx += (Math.random() - 0.5) * 0.25;
          v.vy += (Math.random() - 0.5) * 0.25;
          const maxMag = p.type === "front" ? 3.5 : 4.2;
          const mag = Math.hypot(v.vx, v.vy);
          if (mag > maxMag) {
            v.vx = (v.vx / mag) * maxMag;
            v.vy = (v.vy / mag) * maxMag;
          }
          velRef.current[i] = v;
          return { x, y, type: p.type };
        })
      );
    }, 33);
    return () => clearInterval(id);
  }, [stage]);

  const start = () => {
    if (selectedFront.length !== 5 || selectedBack.length !== 2) {
      return;
    }
    setStage("shaking");
    setFrontResult([]);
    setBackResult([]);
    setSequence([]);
    setRolling([]);
    setTimeout(draw, 2000);
  };

  const pickUnique = (count: number, max: number) => {
    const set = new Set<number>();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(set).sort((a, b) => a - b);
  };

  const draw = () => {
    setStage("drawing");
    const front = pickUnique(5, 35);
    const back = pickUnique(2, 12);
    setFrontResult(front);
    setBackResult(back);
    const seq: { num: number; type: "front" | "back" }[] = [
      ...front.map((n) => ({ num: n, type: "front" })),
      ...back.map((n) => ({ num: n, type: "back" })),
    ];
    let t = 0;
    seq.forEach((s, i) => {
      setTimeout(() => {
        setSequence((prev) => [...prev, s]);
        setRolling((prev) => [...prev, i]);
        if (i === seq.length - 1) setTimeout(() => setStage("done"), 800);
      }, t);
      t += 800;
    });
  };

  const reset = () => {
    setStage("idle");
    setFrontResult([]);
    setBackResult([]);
    setSequence([]);
    setRolling([]);
    setMatchFront(0);
    setMatchBack(0);
    setResultMessage("");
    setShowFireworks(false);
  };

  const toggleFront = (n: number) => {
    setSelectedFront((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 5) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  };

  const toggleBack = (n: number) => {
    setSelectedBack((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 2) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  };

  const quickPick = () => {
    setSelectedFront(pickUnique(5, 35));
    setSelectedBack(pickUnique(2, 12));
  };

  useEffect(() => {
    if (stage !== "done") return;
    const mf = selectedFront.filter((n) => frontResult.includes(n)).length;
    const mb = selectedBack.filter((n) => backResult.includes(n)).length;
    setMatchFront(mf);
    setMatchBack(mb);
    const won = mf >= 3 || mb === 2;
    setResultMessage(
      won
        ? `恭喜中奖！前区命中 ${mf} 个，后区命中 ${mb} 个`
        : `未中奖：前区命中 ${mf} 个，后区命中 ${mb} 个，继续加油！`
    );
    setShowFireworks(won);
  }, [stage, selectedFront, selectedBack, frontResult, backResult]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        <FadeIn>
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回游戏列表
            </Button>
            <h1 className="text-4xl font-bold text-white mb-2">大乐透</h1>
            <p className="text-gray-400">
              5个前区号码(1-35)与2个后区号码(1-12)
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <Card className="p-6 mb-6">
            <h3 className="text-white font-semibold mb-3">选择你的号码</h3>
            <div className="mb-4">
              <div className="text-sm text-red-400 mb-2">前区（选择5个）</div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 35 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleFront(n)}
                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                      selectedFront.includes(n)
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-blue-400 mb-2">后区（选择2个）</div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleBack(n)}
                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                      selectedBack.includes(n)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={quickPick}>
                机选
              </Button>
              <span className="text-sm text-gray-400">
                已选：前区 {selectedFront.join(",") || "无"} · 后区{" "}
                {selectedBack.join(",") || "无"}
              </span>
            </div>
          </Card>
        </FadeIn>

        <FadeIn>
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  className="relative aspect-square rounded-full border border-gray-700 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
                  style={{
                    transition: "transform 0.2s ease",
                    transform: stage === "shaking" ? "rotate(1deg)" : undefined,
                  }}
                >
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(closest-side,rgba(255,255,255,0.15),transparent)]" />
                  <div className="absolute top-2 left-2 text-xs text-red-400">
                    前区
                  </div>
                  {positions
                    .filter((p) => p.type === "front")
                    .map((p, idx) => (
                      <div
                        key={`f-${idx}`}
                        className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow bg-red-600 text-white"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          transition: "left 0.12s ease, top 0.12s ease",
                        }}
                      >
                        {idx + 1}
                      </div>
                    ))}
                </div>
                <div
                  className="relative aspect-square rounded-full border border-gray-700 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
                  style={{
                    transition: "transform 0.2s ease",
                    transform:
                      stage === "shaking" ? "rotate(-1deg)" : undefined,
                  }}
                >
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(closest-side,rgba(255,255,255,0.15),transparent)]" />
                  <div className="absolute top-2 left-2 text-xs text-blue-400">
                    后区
                  </div>
                  {positions
                    .filter((p) => p.type === "back")
                    .map((p, idx) => (
                      <div
                        key={`b-${idx}`}
                        className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow bg-blue-600 text-white"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          transition: "left 0.12s ease, top 0.12s ease",
                        }}
                      >
                        {idx + 1}
                      </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  {stage === "idle" && (
                    <Button
                      variant="primary"
                      onClick={start}
                      disabled={
                        selectedFront.length !== 5 || selectedBack.length !== 2
                      }
                    >
                      开始摇号
                    </Button>
                  )}
                  {stage !== "idle" && (
                    <Button variant="outline" onClick={reset}>
                      重新开始
                    </Button>
                  )}
                  <span className="text-sm text-gray-400">
                    {stage === "idle"
                      ? "准备开始"
                      : stage === "shaking"
                      ? "正在摇号"
                      : stage === "drawing"
                      ? "号码滚出中"
                      : "摇号完成"}
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2">摇出号码</h3>
                  <div className="flex flex-wrap gap-3">
                    {sequence.map((s, i) => (
                      <BallRoll key={i} num={s.num} type={s.type} />
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-white font-semibold mb-2">前区</h3>
                  <div className="flex flex-wrap gap-2">
                    {frontResult.map((n, i) => (
                      <span
                        key={i}
                        className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">后区</h3>
                  <div className="flex flex-wrap gap-2">
                    {backResult.map((n, i) => (
                      <span
                        key={i}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                {stage === "done" && (
                  <div className="mt-6 p-4 rounded-lg bg-gray-900 border border-gray-800">
                    <div className="text-white font-semibold mb-2">结果</div>
                    <div className="text-gray-300 text-sm">{resultMessage}</div>
                    {showFireworks && <Fireworks />}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </FadeIn>
      </main>
      <PlayerBar />
    </div>
  );
}

function BallRoll({ num, type }: { num: number; type: "front" | "back" }) {
  const [start, setStart] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setStart(true), 50);
    return () => clearTimeout(id);
  }, []);
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow ${
        type === "front" ? "bg-red-600 text-white" : "bg-blue-600 text-white"
      }`}
      style={{
        transform: start
          ? "translateX(0px) rotate(360deg)"
          : "translateX(-120px) rotate(0deg)",
        transition: "transform 0.7s ease",
      }}
    >
      {num}
    </div>
  );
}

function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = (canvas.width = 400);
    const h = (canvas.height = 200);
    const origin = [w * 0.25, w * 0.5, w * 0.75];
    const colors = ["#60a5fa", "#22d3ee", "#f87171", "#34d399", "#fbbf24"];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
    }[] = [];
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x: origin[k],
          y: h * 0.6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          life: Math.random() * 60 + 40,
          color: colors[(Math.random() * colors.length) | 0],
        });
      }
    }
    let raf: number;
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= 1;
        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    const timer = setTimeout(() => setRunning(false), 2500);
    return () => {
      setRunning(false);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [running]);
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full max-w-md h-32 rounded" />
    </div>
  );
}
