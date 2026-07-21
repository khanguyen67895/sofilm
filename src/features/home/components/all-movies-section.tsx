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
      <Reveal
        delay={0.1}
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
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
