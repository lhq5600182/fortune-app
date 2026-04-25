import { View } from '@tarojs/components';
import './constellation.css';

const CONSTELLATION_DATA = {
  bigDipper: {
    stars: [
      { x: 0, y: 0 }, { x: 30, y: -10 }, { x: 65, y: -5 },
      { x: 95, y: 10 }, { x: 120, y: 25 }, { x: 140, y: 45 }, { x: 155, y: 70 }
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]
  },
  cassiopeia: {
    stars: [
      { x: 0, y: 30 }, { x: 35, y: 0 }, { x: 80, y: 20 },
      { x: 120, y: 45 }, { x: 150, y: 75 }
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,2],[2,0]]
  },
  lyra: {
    stars: [
      { x: 50, y: 0 }, { x: 25, y: 40 }, { x: 55, y: 55 },
      { x: 85, y: 40 }, { x: 60, y: 90 }, { x: 25, y: 100 }
    ],
    lines: [[0,1],[0,2],[0,3],[1,2],[2,4],[1,5],[5,4],[3,4]]
  },
  orion: {
    stars: [
      { x: 20, y: 0 }, { x: 35, y: 50 }, { x: 15, y: 120 },
      { x: 40, y: 150 }, { x: 80, y: 160 }, { x: 100, y: 120 },
      { x: 130, y: 50 }, { x: 150, y: 0 }
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[1,6],[2,5]]
  }
};

function ConstellationBackground() {
  const stars = CONSTELLATION_DATA.bigDipper.stars.map((star, index) => ({
    id: `s${index}`,
    x: star.x,
    y: star.y,
    delay: `${index * 0.15}s`
  }));

  const lines = CONSTELLATION_DATA.bigDipper.lines.map((line, index) => ({
    id: `l${index}`,
    x1: CONSTELLATION_DATA.bigDipper.stars[line[0]].x,
    y1: CONSTELLATION_DATA.bigDipper.stars[line[0]].y,
    x2: CONSTELLATION_DATA.bigDipper.stars[line[1]].x,
    y2: CONSTELLATION_DATA.bigDipper.stars[line[1]].y,
    delay: `${index * 0.1}s`
  }));

  return (
    <View className="constellation-bg">
      <View className="constellation-container" style={{ position: 'absolute', top: '15%', left: '10%' }}>
        {stars.map((star) => (
          <View
            key={star.id}
            className="constellation-star"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
              animationDelay: star.delay
            }}
          />
        ))}
        {lines.map((line) => {
          const dx = line.x2 - line.x1;
          const dy = line.y2 - line.y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={line.id}
              className="constellation-line"
              style={{
                left: `${line.x1}px`,
                top: `${line.y1}px`,
                width: `${length}px`,
                transform: `rotate(${angle}deg)`,
                animationDelay: line.delay
              }}
            />
          );
        })}
        <View className="shooting-star" />
      </View>

      <View className="constellation-container" style={{ position: 'absolute', top: '55%', right: '8%' }}>
        {CONSTELLATION_DATA.cassiopeia.stars.map((star, index) => (
          <View
            key={`cs${index}`}
            className="constellation-star"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
              animationDelay: `${index * 0.2}s`
            }}
          />
        ))}
        {CONSTELLATION_DATA.cassiopeia.lines.map((line, index) => {
          const x1 = CONSTELLATION_DATA.cassiopeia.stars[line[0]].x;
          const y1 = CONSTELLATION_DATA.cassiopeia.stars[line[0]].y;
          const x2 = CONSTELLATION_DATA.cassiopeia.stars[line[1]].x;
          const y2 = CONSTELLATION_DATA.cassiopeia.stars[line[1]].y;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={`cl${index}`}
              className="constellation-line"
              style={{
                left: `${x1}px`,
                top: `${y1}px`,
                width: `${length}px`,
                transform: `rotate(${angle}deg)`,
                animationDelay: `${index * 0.15}s`
              }}
            />
          );
        })}
      </View>

      <View className="twinkle-dot" style={{ top: '8%', left: '25%' }} />
      <View className="twinkle-dot" style={{ top: '25%', left: '8%' }} />
      <View className="twinkle-dot" style={{ top: '40%', left: '60%' }} />
      <View className="twinkle-dot" style={{ top: '12%', left: '80%' }} />
      <View className="twinkle-dot" style={{ top: '70%', left: '25%' }} />
      <View className="twinkle-dot" style={{ top: '85%', left: '75%' }} />
      <View className="twinkle-dot" style={{ top: '60%', left: '45%' }} />
      <View className="twinkle-dot" style={{ top: '90%', left: '15%' }} />
    </View>
  );
}

export default ConstellationBackground;
