import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner/banner.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { HeroItem } from "@/types/movie";

/** A banner not linked to any movie still autoplays its own uploaded video
 * in the hero — it just renders without the Watch Now / More Info actions
 * (HeroSlide hides those when `slug` is absent). */
export function useHeroBanners() {
  return useQuery({
    queryKey: QUERY_KEYS.heroBanners,
    queryFn: async (): Promise<HeroItem[]> => {
      const banners = await bannerService.getActive();
      return banners.map(
        (banner): HeroItem => ({
          id: banner.id,
          slug: banner.movie?.slug,
          title: banner.movie?.title ?? banner.title ?? "",
          description: banner.content || banner.movie?.description,
          poster: banner.movie?.poster,
          backdrop: banner.thumbnailUrl || banner.imageUrl || banner.movie?.backdrop,
          videoUrl: banner.videoUrl ?? banner.movie?.videoUrl,
        })
      );
    },
  });
}
