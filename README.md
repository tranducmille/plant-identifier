
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

### API Routes

The application includes an API route for fetching images. You can access it on [http://localhost:3000/api/fetch-image](http://localhost:3000/api/fetch-image). This endpoint can be edited in `pages/api/fetch-image.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

Production Version: https://plant-identifier-d49d2eblc-tranducmilles-projects.vercel.app/

![Alt text](/plant-identifier/public/plantidentifier.png)

### Features

- Fetch images from external URLs.
- Display images dynamically based on user input.
- Optimized for performance using Next.js features.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **TypeScript**: A superset of JavaScript that adds static types.
- **Node-fetch**: A lightweight module that brings `window.fetch` to Node.js.
- **@google/generative-ai**: Used for generating plant information based on the image description.
- **Tailwind CSS & Lucide Icons & Shadcn**: A utility-first CSS framework for rapidly building custom designs.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.