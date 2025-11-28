import React, { useState } from "react";
import {
  Sparkles,
  Music,
  Heart,
  Zap,
  Coffee,
  Moon,
  Sun,
  Cloud,
  TreePine,
  Building,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAI } from "@/hooks/useAI";
import { useAuth } from "@/hooks/useAuth";

const musicStyles = [
  { id: "pop", name: "流行", icon: Music, description: "现代流行音乐风格" },
  { id: "rock", name: "摇滚", icon: Zap, description: "激情澎湃的摇滚风格" },
  {
    id: "electronic",
    name: "电子",
    icon: Sparkles,
    description: "未来感电子音乐",
  },
  {
    id: "classical",
    name: "古典",
    icon: TreePine,
    description: "优雅古典音乐风格",
  },
  { id: "jazz", name: "爵士", icon: Coffee, description: "慵懒爵士风格" },
  { id: "folk", name: "民谣", icon: Cloud, description: "温暖民谣风格" },
];

const moods = [
  { id: "happy", name: "快乐", icon: Sun, description: "轻松愉快的音乐" },
  { id: "sad", name: "悲伤", icon: Moon, description: "深情忧郁的音乐" },
  { id: "energetic", name: "激昂", icon: Zap, description: "充满活力的音乐" },
  { id: "calm", name: "舒缓", icon: Heart, description: "平静放松的音乐" },
  { id: "romantic", name: "浪漫", icon: Heart, description: "温柔浪漫的音乐" },
  {
    id: "mysterious",
    name: "神秘",
    icon: Cloud,
    description: "神秘莫测的音乐",
  },
];

const scenes = [
  { id: "work", name: "工作", icon: Building, description: "专注工作的音乐" },
  { id: "exercise", name: "运动", icon: Zap, description: "激励运动的节拍" },
  { id: "relax", name: "休闲", icon: Coffee, description: "悠闲时光的音乐" },
  { id: "sleep", name: "睡眠", icon: Moon, description: "助眠舒缓的音乐" },
  { id: "party", name: "聚会", icon: Users, description: "派对狂欢的音乐" },
  { id: "study", name: "学习", icon: TreePine, description: "专注学习的音乐" },
];

export const AICreator: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedScene, setSelectedScene] = useState("");
  const { generatePlaylist, isGenerating, generatedPlaylist } = useAI();
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!selectedStyle || !selectedMood || !selectedScene) {
      alert("请选择音乐风格、情绪和使用场景");
      return;
    }

    if (!user) {
      alert("请先登录");
      return;
    }

    await generatePlaylist(
      {
        style: selectedStyle,
        mood: selectedMood,
        scene: selectedScene,
      },
      user.id
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">AI音乐创作</h1>
        <p className="text-gray-400 text-lg">
          选择您喜欢的音乐风格、情绪和使用场景，让AI为您生成专属歌单
        </p>
      </div>

      {/* 音乐风格选择 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">选择音乐风格</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {musicStyles.map((style) => {
            const Icon = style.icon;
            return (
              <Card
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedStyle === style.id
                    ? "border-sky-600 bg-sky-900 bg-opacity-30"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-sky-600" />
                  <div>
                    <h3 className="text-white font-semibold">{style.name}</h3>
                    <p className="text-gray-400 text-sm">{style.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 情绪选择 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">选择音乐情绪</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            return (
              <Card
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedMood === mood.id
                    ? "border-sky-600 bg-sky-900 bg-opacity-30"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-sky-600" />
                  <div>
                    <h3 className="text-white font-semibold">{mood.name}</h3>
                    <p className="text-gray-400 text-sm">{mood.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 使用场景选择 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">选择使用场景</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {scenes.map((scene) => {
            const Icon = scene.icon;
            return (
              <Card
                key={scene.id}
                onClick={() => setSelectedScene(scene.id)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedScene === scene.id
                    ? "border-sky-600 bg-sky-900 bg-opacity-30"
                    : "border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-8 w-8 text-sky-600" />
                  <div>
                    <h3 className="text-white font-semibold">{scene.name}</h3>
                    <p className="text-gray-400 text-sm">{scene.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 生成按钮 */}
      <div className="text-center mb-8">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          {isGenerating ? (
            <>
              <Sparkles className="animate-pulse h-5 w-5 mr-2" />
              AI生成中...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              生成专属歌单
            </>
          )}
        </Button>
      </div>

      {/* 生成结果 */}
      {generatedPlaylist && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-2xl font-semibold text-white mb-4">生成的歌单</h3>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={generatedPlaylist.cover_url}
              alt={generatedPlaylist.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h4 className="text-xl font-semibold text-white">
                {generatedPlaylist.title}
              </h4>
              <p className="text-gray-400">{generatedPlaylist.description}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="primary">立即播放</Button>
            <Button variant="outline">收藏歌单</Button>
            <Button variant="outline">分享</Button>
          </div>
        </div>
      )}
    </div>
  );
};
