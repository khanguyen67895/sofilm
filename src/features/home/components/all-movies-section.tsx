import Link from "next/link";
import { MovieCard } from "@/components/movie/movie-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";
import { ROUTES } from "@/constants/routes";
import type { Movie } from "@/types/movie";

export function AllMoviesSection({ movies }: { movies: Movie[] }) {
  return (
    <section className="space-y-6 px-4 sm:px-8">
      <Reveal>
        <h2 className="text-lg font-semibold text-white">All Movies</h2>
      </Reveal>
      <Reveal delay={0.1} className="flex flex-wrap gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="w-40 shrink-0 sm:w-55">
            <MovieCard movie={movie} />
          </div>
        ))}
      </Reveal>
      <Reveal delay={0.2} className="flex justify-center pt-2">
        <Link href={ROUTES.category}>
          <Button variant="primary">View All</Button>
        </Link>
      </Reveal>
    </section>
  );
}
