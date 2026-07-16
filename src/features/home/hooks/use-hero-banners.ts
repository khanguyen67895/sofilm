import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner/banner.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Movie } from "@/types/movie";

/** Only banners linked to a movie can feed the hero slider (it needs slug/description/etc.
 * to render the Watch Now / More Info actions) — image-only promo banners are skipped here. */
export function useHeroBanners() {
  return useQuery({
    queryKey: QUERY_KEYS.heroBanners,
    queryFn: async (): Promise<Movie[]> => {
      const banners = await bannerService.getActive();
      return banners
        .filter((banner) => banner.movie)
        .map((banner) => {
          const movie = banner.movie!;
          return {
            id: movie.id,
            slug: movie.slug,
            title: movie.title,
            description: movie.description ?? "",
            poster: movie.poster ?? "",
            backdrop: banner.imageUrl || movie?.backdrop || "",
            type: "MOVIE",
            genres: [],
            genreIds: [],
            releaseDate: "",
            duration: 0,
            rating: 0,
            views: 0,
            isPremium: false,
            videoUrl: banner.videoUrl ?? movie.videoUrl,
          } satisfies Movie;
        });
    },
  });
}
