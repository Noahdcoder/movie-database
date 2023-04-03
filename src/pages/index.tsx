import axios from "axios";
import Head from "next/head";
import SearchBar from "@/components/SearchBar";
import TrendingDay from "@/components/TrendingDay";

interface Props {
  results: Array<any>;
}

export default function Home({ results }: Props) {
  return (
    <>
      <Head>
        <title>Noah&apos;s Movie Database</title>
        <meta
          name="description"
          content="Noah's Movie Database - Check out your favourite movies"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 space-y-8 md:p-8">
        <SearchBar />
        <TrendingDay results={results} />
      </main>
    </>
  );
}

export async function getStaticProps(): Promise<{ props: Props }> {
  const API_KEY = process.env.API_KEY; // Replace with your own API key
  const TRENDING_MOVIES_URL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`;

  try {
    const response = await axios.get(TRENDING_MOVIES_URL);
    const { results } = response.data;

    return {
      props: {
        results,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        results: [],
      },
    };
  }
}
