// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import PlantIdentifier from '../components/PlantIdentifier';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 relative">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <Head>
        <title>Plant Identifier</title>
        <meta name="description" content="Identify plants using AI" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="relative z-10">
        <PlantIdentifier />
      </main>
    </div>
  );
};

export default Home;