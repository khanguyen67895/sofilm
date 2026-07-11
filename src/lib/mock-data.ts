import type { Movie, MovieRow } from "@/types/movie";
import type { Short } from "@/types/shorts";
import type { SubscriptionPlan } from "@/types/subscription";

const GENRES = ["Hành Động", "Kinh Dị", "Tình Cảm", "Hài Hước", "Viễn Tưởng"];

function makeMovie(i: number): Movie {
  const isSeries = i % 3 === 0;
  return {
    id: `movie-${i}`,
    slug: `movie-${i}`,
    title: `Phim Bom Tấn ${i}`,
    originalTitle: `Blockbuster Movie ${i}`,
    description:
      "Một câu chuyện đầy kịch tính xoay quanh hành trình chinh phục những giới hạn của bản thân.",
    poster: `https://picsum.photos/seed/poster-${i}/400/600`,
    backdrop: `https://picsum.photos/seed/backdrop-${i}/1600/900`,
    type: isSeries ? "SERIES" : "MOVIE",
    genres: [GENRES[i % GENRES.length], GENRES[(i + 1) % GENRES.length]],
    releaseDate: `${2018 + (i % 7)}-01-01`,
    duration: 90 + (i % 60),
    rating: Number((6 + (i % 4) + Math.random()).toFixed(1)),
    views: (i + 1) * 12345,
    isPremium: i % 4 === 0,
    episodes: isSeries
      ? Array.from({ length: 8 }, (_, e) => ({
          id: `movie-${i}-ep-${e + 1}`,
          title: `Tập ${e + 1}`,
          slug: `ep-${e + 1}`,
          episodeNumber: e + 1,
          duration: 45,
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          thumbnail: `https://picsum.photos/seed/ep-${i}-${e}/400/225`,
        }))
      : undefined,
  };
}

export const MOCK_MOVIES: Movie[] = Array.from({ length: 40 }, (_, i) =>
  makeMovie(i + 1)
);

export const MOCK_ROWS: MovieRow[] = [
  { id: "continue-watching", title: "Continue Watching", movies: MOCK_MOVIES.slice(0, 12) },
  { id: "new-releases", title: "New Releases", movies: MOCK_MOVIES.slice(10, 22) },
];

export const MOCK_TRENDING: Movie[] = MOCK_MOVIES.slice(0, 8);

export const MOCK_SHORTS: Short[] = Array.from({ length: 15 }, (_, i) => ({
  id: `short-${i + 1}`,
  title: `Khoảnh khắc đỉnh cao #${i + 1}`,
  videoUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  thumbnail: `https://picsum.photos/seed/short-${i}/400/700`,
  movieSlug: MOCK_MOVIES[i % MOCK_MOVIES.length].slug,
  likes: (i + 1) * 234,
  comments: (i + 1) * 12,
  isLiked: false,
}));

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Cơ Bản",
    price: 59000,
    currency: "VND",
    durationDays: 30,
    perks: ["Xem HD", "1 thiết bị", "Có quảng cáo"],
  },
  {
    id: "standard",
    name: "Tiêu Chuẩn",
    price: 99000,
    currency: "VND",
    durationDays: 30,
    perks: ["Xem Full HD", "2 thiết bị", "Không quảng cáo"],
    isPopular: true,
  },
  {
    id: "premium",
    name: "Cao Cấp",
    price: 149000,
    currency: "VND",
    durationDays: 30,
    perks: ["Xem 4K", "4 thiết bị", "Không quảng cáo", "Tải xuống offline"],
  },
];
